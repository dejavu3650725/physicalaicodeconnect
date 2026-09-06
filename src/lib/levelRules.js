// ============================================================
// 수준별 단계 규칙 — 기초/기본/심화가 실제로 난이도 차이를 갖도록 블록 트리를 검사한다.
//  - AI 응답을 받은 뒤 normalizeTree 다음 단계에서 실행
//  - hard 위반: 수정 재요청 사유가 됨 / soft 위반: 화면에 참고로만 표시
// ============================================================
import { getBlockDef, PLATFORMS, countBlocks } from '../blocks/engine.js';

const COND_IDS = new Set(['_if', 'if_else', 'if']);
const LOOP_IDS = new Set(['repeat_basic', 'repeat_inf', 'repeat_while_true', 'repeat', 'while', 'forever', 'repeat_until']);
const VAR_IDS = new Set(['set_variable', 'change_variable', 'get_variable']);
const SENSOR_CATS = new Set(['input', 'sensors', 'pins', 'radio']);

export const isAI = (d) => !!(d && (d.aiOnly || d.cat === 'ai'));
export const isCondition = (d) => !!(d && COND_IDS.has(d.id));
export const isLoop = (d) => !!(d && LOOP_IDS.has(d.id));
export const isVariable = (d) => !!(d && VAR_IDS.has(d.id));
const EVENT_SENSOR_IDS = new Set(['on_button_pressed', 'on_gesture', 'on_logo_event', 'on_sound', 'on_pin_pressed', 'radio_on_received_number', 'radio_on_received_string', 'when_button_pressed', 'when_color', 'when_closer_than', 'when_tilted']);
export const isSensor = (d) => {
  if (!d || isAI(d) || isVariable(d)) return false;
  if (d.shape === 'hat') return EVENT_SENSOR_IDS.has(d.id); // 센서 이벤트 시작 블록(버튼·흔들림·색 감지 등)
  if (d.shape !== 'boolean' && d.shape !== 'value') return false;
  if (SENSOR_CATS.has(d.cat)) return d.id !== 'running_time';
  if (d.group === '센서') return true;
  return !!d.hw; // 하드웨어 값/판단 블록(hamster_value, drone_value 등)
};

/** 트리를 훑어 특성 집계 */
export function profileTree(platformKey, blocks) {
  const p = { total: countBlocks(blocks), ai: 0, cond: 0, loop: 0, vars: 0, sensors: 0, sensorKinds: new Set(), hats: (blocks || []).length };
  const walk = (list) => {
    for (const b of list || []) {
      const d = getBlockDef(platformKey, b.type);
      if (d) {
        if (isAI(d)) p.ai++;
        if (isCondition(d)) p.cond++;
        if (isLoop(d)) p.loop++;
        if (isVariable(d)) p.vars++;
        if (isSensor(d)) { p.sensors++; p.sensorKinds.add(b.type + ':' + JSON.stringify(Object.values(b.params || {}).filter((v) => typeof v !== 'object'))); }
      }
      for (const v of Object.values(b.params || {})) if (v && typeof v === 'object' && v.type) walk([v]);
      walk(b.children); walk(b.elseChildren);
    }
  };
  walk(blocks);
  p.sensorKinds = p.sensorKinds.size;
  return p;
}

const platformHasAI = (platformKey) => PLATFORMS[platformKey].blocks.some((b) => b.aiOnly || b.cat === 'ai');

/**
 * 단계별 규칙 검사. 반환: { ok, hard: [..], soft: [..], profile }
 * levels: { basic:{blocks}, standard:{blocks}, advanced:{blocks} }
 */
export function checkLevels(platformKey, levels) {
  const hasAI = platformHasAI(platformKey);
  const P = {}; for (const k of ['basic', 'standard', 'advanced']) P[k] = profileTree(platformKey, levels[k]?.blocks || []);
  const out = { basic: { hard: [], soft: [] }, standard: { hard: [], soft: [] }, advanced: { hard: [], soft: [] } };

  // 🌱 기초: 순차 구조. 조건·AI 금지, 4~10블록
  const b = P.basic;
  if (b.total < 4) out.basic.hard.push('블록이 4개 미만입니다. 움직임·출력 블록을 더 넣어 5~9개로 구성하세요.');
  if (b.total > 12) out.basic.hard.push(`블록이 ${b.total}개로 너무 많습니다. 기초 단계는 9개 이내의 순차 구조로 줄이세요.`);
  if (b.cond > 0) out.basic.hard.push('기초 단계에 조건(만일~) 블록이 들어갔습니다. 조건 없이 순차 구조로만 작성하세요.');
  if (b.ai > 0) out.basic.hard.push('기초 단계에 인공지능 블록이 들어갔습니다. 기초에서는 사용하지 않습니다.');
  if (b.sensors > 0) out.basic.soft.push('기초 단계에 센서 값이 사용되었습니다(허용되지만 기본 단계와 차이가 줄어듭니다).');
  if (b.hats > 2) out.basic.soft.push('시작 블록이 3개 이상입니다. 기초는 시작 블록 1개가 이해하기 쉽습니다.');

  // 🚀 기본: 센서 + 조건 + (반복). AI 금지
  const s = P.standard;
  if (s.sensors < 1) out.standard.hard.push('기본 단계에 센서 값/판단 블록이 없습니다. 센서 값을 읽어 조건에 사용하세요.');
  if (s.cond < 1) out.standard.hard.push('기본 단계에 조건(만일~) 블록이 없습니다. 센서 값에 따라 분기하는 조건을 넣으세요.');
  if (s.ai > 0) out.standard.hard.push('기본 단계에 인공지능 블록이 들어갔습니다. 인공지능은 심화 단계에서만 사용합니다.');
  if (s.loop < 1) out.standard.soft.push('반복 블록이 없습니다. 센서를 계속 확인하려면 반복 구조가 필요합니다.');
  if (s.vars < 1) out.standard.soft.push('변수를 사용하지 않았습니다(권장: 기준값·횟수 등을 변수로).');
  if (s.total < b.total) out.standard.hard.push(`기본 단계 블록 수(${s.total})가 기초(${b.total})보다 적습니다. 기본은 8~16개로 더 풍부하게 구성하세요.`);
  else if (s.total < 7) out.standard.soft.push('기본 단계 블록이 7개 미만으로 단순합니다.');

  // 🔥 심화: AI 블록(있는 플랫폼) + 조건, 기본보다 풍부
  const a = P.advanced;
  if (hasAI) {
    if (a.ai < 1) out.advanced.hard.push('심화 단계에 인공지능 블록이 없습니다. 인식/분류 블록을 넣고 그 결과로 분기하세요.');
    if (a.cond < 1) out.advanced.hard.push('심화 단계에 조건 블록이 없습니다. AI 인식 결과에 따라 동작을 나누세요.');
  } else {
    if (a.sensorKinds < 2 && a.vars < 1) out.advanced.hard.push('심화 단계는 두 가지 이상의 센서 또는 변수·통신을 결합해야 합니다.');
    if (a.cond < 1) out.advanced.hard.push('심화 단계에 조건 블록이 없습니다.');
  }
  if (a.total < s.total - 3) out.advanced.hard.push(`심화 단계 블록 수(${a.total})가 기본(${s.total})보다 눈에 띄게 적습니다. 12~24개로 확장하세요.`);
  else if (a.total < 10) out.advanced.soft.push('심화 단계 블록이 10개 미만으로 단순합니다.');
  if (a.loop < 1) out.advanced.soft.push('반복 블록이 없습니다.');

  for (const k of Object.keys(out)) { out[k].profile = P[k]; out[k].ok = out[k].hard.length === 0; }
  out.ok = out.basic.ok && out.standard.ok && out.advanced.ok;
  out.hardCount = out.basic.hard.length + out.standard.hard.length + out.advanced.hard.length;
  return out;
}

/** 재요청 프롬프트에 넣을 위반 요약 */
export function describeViolations(check) {
  const name = { basic: '기초(basic)', standard: '기본(standard)', advanced: '심화(advanced)' };
  const lines = [];
  for (const k of ['basic', 'standard', 'advanced']) for (const h of check[k].hard) lines.push(`- ${name[k]}: ${h}`);
  return lines.join('\n');
}

/** 단계 하나만 검사(단계 재생성 시) — 다른 단계 프로필과 비교 */
export function checkOneLevel(platformKey, levels, key) {
  const c = checkLevels(platformKey, levels);
  return c[key];
}
