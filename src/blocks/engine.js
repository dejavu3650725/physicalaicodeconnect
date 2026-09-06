// ============================================================
// 블록 엔진: 카탈로그 조회 · 블록 트리 검증/정규화 · 결정적(Deterministic) 코드 컴파일 · AI 프롬프트용 레퍼런스 생성
//
// 블록 트리 형식 (AI 출력 = 렌더링 = 코드 생성의 단일 소스):
//   { type: 'hamster_move_forward_for_secs', params: { SEC: 1 } }
//   { type: 'repeat_inf', children: [ ... ] }
//   { type: 'if_else', params: { COND: { type: 'boolean_basic_operator', params: { A: {type:'hamster_value', params:{V:'leftProximity'}}, OP: 'LESS', B: 20 } } }, children: [...], elseChildren: [...] }
// 파라미터 값: 숫자/문자열 리터럴 또는 중첩 값 블록 { type, params }
// ============================================================
import { ENTRY_COMMON_BLOCKS, ENTRY_COLORS } from './entryCommon.js';
import { HAMSTER_BLOCKS, HAMSTER_S_BLOCKS, HAMSTER_PY_HEADER, HAMSTER_PY_FOOTER } from './hamster.js';
import { MICROBIT_BLOCKS, MAKECODE_COLORS } from './microbit.js';
import { TORY_BLOCKS, TORY_PY_HEADER, TORY_PY_FOOTER } from './tory.js';
import { SPIKE_BLOCKS, SPIKE_COLORS, SPIKE_PY_HEADER, SPIKE_PY_FOOTER } from './spike.js';

// 플랫폼(도구) 정의 — 하드웨어 프로필이 platform 키로 참조
export const PLATFORMS = {
  'entry-hamster': {
    tool: '엔트리', theme: 'entry', colors: ENTRY_COLORS,
    blocks: [...ENTRY_COMMON_BLOCKS, ...HAMSTER_BLOCKS],
    langs: [
      { key: 'entryPy', label: '엔트리 파이썬', hint: '엔트리 [파이썬] 모드에 붙여넣기 → [블록] 모드로 전환하면 블록으로 변환됩니다. (인공지능 블록은 엔트리 파이썬 미지원)', header: '', footer: '', indent: '    ' },
      { key: 'py', label: '파이썬(roboid)', hint: 'PC에서 pip install roboid 후 실행. 햄스터 USB 동글을 연결해 두세요.', header: HAMSTER_PY_HEADER(''), footer: HAMSTER_PY_FOOTER, indent: '    ' },
    ],
  },
  'entry-hamster-s': {
    tool: '엔트리', theme: 'entry', colors: ENTRY_COLORS,
    blocks: [...ENTRY_COMMON_BLOCKS, ...HAMSTER_S_BLOCKS],
    langs: [
      { key: 'entryPy', label: '엔트리 파이썬', hint: '엔트리 [파이썬] 모드에 붙여넣기 → [블록] 모드로 전환하면 블록으로 변환됩니다. (인공지능 블록은 엔트리 파이썬 미지원)', header: '', footer: '', indent: '    ' },
      { key: 'py', label: '파이썬(roboid)', hint: 'PC에서 pip install roboid 후 실행. 햄스터S USB 동글을 연결해 두세요.', header: HAMSTER_PY_HEADER('S'), footer: HAMSTER_PY_FOOTER, indent: '    ' },
    ],
  },
  'makecode-microbit': {
    tool: '메이크코드', theme: 'makecode', colors: MAKECODE_COLORS,
    blocks: MICROBIT_BLOCKS,
    langs: [
      { key: 'js', label: 'JavaScript', hint: 'makecode.microbit.org → [JavaScript] 탭에 붙여넣기 → [블록] 탭으로 바꾸면 블록이 자동 조립됩니다.', header: '', footer: '', indent: '    ' },
      { key: 'py', label: 'Python', hint: 'makecode.microbit.org → [Python] 탭에 붙여넣기. (MakeCode Python 문법)', header: '', footer: '', indent: '    ' },
    ],
  },
  'entry-tory': {
    tool: '엔트리', theme: 'entry', colors: ENTRY_COLORS,
    blocks: [...ENTRY_COMMON_BLOCKS, ...TORY_BLOCKS],
    langs: [
      { key: 'py', label: '파이썬(CodingRider)', hint: 'PC에서 pip install CodingRider 후 실행. 조종기를 USB로 연결(LINK 모드)하고 드론과 페어링해 두세요.', header: TORY_PY_HEADER, footer: TORY_PY_FOOTER, indent: '    ' },
      { key: 'entryPy', label: '엔트리 파이썬(참고)', hint: '드론 블록의 엔트리 파이썬 문법은 모듈에 따라 다를 수 있어 참고용입니다.', header: '', footer: '', indent: '    ' },
    ],
  },
  'spike-prime': {
    tool: '스파이크 앱', theme: 'spike', colors: SPIKE_COLORS,
    blocks: SPIKE_BLOCKS,
    langs: [
      { key: 'py', label: 'SPIKE Python', hint: 'SPIKE 앱 → 새 프로젝트 → Python 선택 후 붙여넣기. 허브 OS 3.x 기준.', header: SPIKE_PY_HEADER, footer: SPIKE_PY_FOOTER, indent: '    ' },
    ],
  },
};

const _index = {};
export function getCatalog(platformKey) {
  const p = PLATFORMS[platformKey];
  if (!p) throw new Error(`unknown platform ${platformKey}`);
  if (!_index[platformKey]) {
    const map = new Map();
    p.blocks.forEach((b) => map.set(b.id, b));
    _index[platformKey] = map;
  }
  return _index[platformKey];
}
export function getBlockDef(platformKey, type) { return getCatalog(platformKey).get(type); }

// ---------- 정규화/검증 ----------
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)) ? Number(v) : null));

function pickOption(def, val) {
  const opts = def.options || [];
  if (val == null) return def.def;
  const s = String(val).trim();
  let o = opts.find((x) => x[1] === s) || opts.find((x) => x[0] === s) || opts.find((x) => String(x[1]).toLowerCase() === s.toLowerCase()) || opts.find((x) => x[0].replace(/\s/g, '') === s.replace(/\s/g, ''));
  if (!o) o = opts.find((x) => s.includes(x[0]) || x[0].includes(s));
  return o ? o[1] : def.def;
}

/**
 * AI가 만든 트리를 카탈로그에 맞게 정규화. 알 수 없는 블록은 제거하고 issues에 기록.
 */
export function normalizeTree(platformKey, blocks, issues = [], depth = 0) {
  const cat = getCatalog(platformKey);
  const out = [];
  for (const raw of Array.isArray(blocks) ? blocks : []) {
    if (!raw || typeof raw !== 'object') continue;
    const type = String(raw.type || raw.id || '').trim();
    let def = cat.get(type);
    if (!def) {
      // 관용적 별칭 복구
      const alias = resolveAlias(platformKey, type, raw);
      if (alias) def = cat.get(alias);
    }
    if (!def) { issues.push({ kind: 'unknown_block', type, text: raw.text || '' }); continue; }
    if (depth === 0 && def.shape !== 'hat' && out.length === 0 && (platformKey.startsWith('entry') || platformKey === 'spike-prime' || platformKey === 'makecode-microbit')) {
      // 최상위는 시작(hat) 블록부터 시작해야 함 — 없으면 기본 시작 블록으로 감싼다
      const starter = platformKey.startsWith('entry') ? 'when_run_button_click' : platformKey === 'spike-prime' ? 'when_program_starts' : 'on_start';
      issues.push({ kind: 'auto_start', type: starter });
      const rest = normalizeTree(platformKey, blocks, issues, 1);
      return [{ type: starter, params: {}, children: rest }];
    }
    const params = {};
    for (const [key, pdef] of Object.entries(def.params || {})) {
      let v = raw.params ? raw.params[key] : undefined;
      if (v === undefined && raw.params) { // 대소문자/유사 키 허용
        const k2 = Object.keys(raw.params).find((k) => k.toLowerCase() === key.toLowerCase());
        if (k2) v = raw.params[k2];
      }
      if (pdef.kind === 'dropdown') params[key] = pickOption(pdef, v);
      else if (pdef.kind === 'boolean') {
        params[key] = normalizeValue(platformKey, v, 'boolean', issues);
      } else if (pdef.kind === 'value') {
        params[key] = normalizeValue(platformKey, v ?? pdef.def, 'value', issues);
      } else if (pdef.kind === 'variable') {
        params[key] = sanitizeVar(v ?? pdef.def);
      } else { // text
        params[key] = v == null ? pdef.def : String(typeof v === 'object' ? (v.text || v.value || pdef.def) : v);
      }
    }
    const node = { type: def.id, params };
    if (def.shape === 'c' || def.shape === 'c_else' || def.shape === 'hat') node.children = normalizeTree(platformKey, raw.children || raw.body || [], issues, depth + 1);
    if (def.shape === 'c_else') node.elseChildren = normalizeTree(platformKey, raw.elseChildren || raw.else || [], issues, depth + 1);
    if (def.shape === 'value' || def.shape === 'boolean') { if (depth === 0) { issues.push({ kind: 'orphan_value', type }); continue; } }
    out.push(node);
  }
  return out;
}

function normalizeValue(platformKey, v, expect, issues) {
  const cat = getCatalog(platformKey);
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const type = String(v.type || v.id || '');
    let def = cat.get(type) || cat.get(resolveAlias(platformKey, type, v) || '');
    if (def && (def.shape === 'value' || def.shape === 'boolean')) {
      const [node] = normalizeTree(platformKey, [v], issues, 2);
      if (node) return node;
    }
    issues.push({ kind: 'unknown_value', type });
    return expect === 'boolean' ? { type: platformKey.startsWith('entry') ? 'True' : 'true', params: {} } : 0;
  }
  if (expect === 'boolean') {
    if (v === true || v === 'true' || v === '참') return { type: platformKey.startsWith('entry') ? 'True' : 'true', params: {} };
    // 문자열 조건식 "A < 20" 형태 간이 파서
    if (typeof v === 'string') { const parsed = parseCondition(platformKey, v); if (parsed) return parsed; }
    return { type: platformKey.startsWith('entry') ? 'True' : 'true', params: {} };
  }
  const n = num(v);
  if (n !== null) return n;
  return v == null ? 0 : String(v);
}

function parseCondition(platformKey, s) {
  const m = s.match(/^(.+?)\s*(<=|>=|==|!=|=|<|>|≥|≤|≠)\s*(.+)$/);
  if (!m) return null;
  const opMap = { '=': 'EQUAL', '==': 'EQUAL', '>': 'GREATER', '<': 'LESS', '>=': 'GREATER_OR_EQUAL', '≥': 'GREATER_OR_EQUAL', '<=': 'LESS_OR_EQUAL', '≤': 'LESS_OR_EQUAL', '!=': 'NOT_EQUAL', '≠': 'NOT_EQUAL' };
  const isEntry = platformKey.startsWith('entry');
  const opts = isEntry ? opMap : { '=': '==', '==': '==', '>': '>', '<': '<', '>=': '>=', '≥': '>=', '<=': '<=', '≤': '<=', '!=': '!=', '≠': '!=' };
  const side = (t) => { const n = num(t.trim()); if (n !== null) return n; return { type: isEntry ? 'get_variable' : 'get_variable', params: { VAR: sanitizeVar(t.trim()) } }; };
  return { type: isEntry ? 'boolean_basic_operator' : 'compare', params: { A: side(m[1]), OP: opts[m[2]], B: side(m[3]) } };
}

function sanitizeVar(v) { return String(v ?? '변수').replace(/[^\w가-힣]/g, '_').replace(/^(\d)/, '_$1') || '변수'; }

// 흔한 잘못된 id → 올바른 id
const ALIASES = {
  'entry': { when_start: 'when_run_button_click', start: 'when_run_button_click', repeat_forever: 'repeat_inf', forever: 'repeat_inf', repeat: 'repeat_basic', if: '_if', wait: 'wait_second', wait_seconds: 'wait_second', compare: 'boolean_basic_operator', and_or: 'boolean_and_or', not: 'boolean_not', say: 'dialog', say_for: 'dialog_time', true: 'True' },
  'makecode-microbit': { when_start: 'on_start', start: 'on_start', repeat_inf: 'forever', repeat_basic: 'repeat', _if: 'if', wait: 'pause', wait_second: 'pause', boolean_basic_operator: 'compare', boolean_and_or: 'and_or', boolean_not: 'not', True: 'true', show_text: 'show_string' },
  'spike-prime': { when_start: 'when_program_starts', start: 'when_program_starts', repeat_inf: 'forever', repeat_basic: 'repeat', _if: 'if', wait: 'wait_seconds', wait_second: 'wait_seconds', boolean_basic_operator: 'compare', boolean_and_or: 'and_or', boolean_not: 'not', True: 'true' },
};
function resolveAlias(platformKey, type, raw) {
  const table = platformKey.startsWith('entry') ? ALIASES.entry : ALIASES[platformKey] || {};
  if (table[type]) return table[type];
  const cat = getCatalog(platformKey);
  // 접두어 누락(hamster_ 등) 보정
  for (const pre of ['hamster_', 'hamster_s_']) if (cat.has(pre + type)) return pre + type;
  // hamster_ ↔ hamster_s_ 상호 보정
  if (type.startsWith('hamster_s_') && cat.has(type.replace('hamster_s_', 'hamster_'))) return type.replace('hamster_s_', 'hamster_');
  if (type.startsWith('hamster_') && cat.has(type.replace('hamster_', 'hamster_s_'))) return type.replace('hamster_', 'hamster_s_');
  // 텍스트로 매칭 시도
  if (raw && raw.text) { const t = String(raw.text).replace(/\s|▼/g, ''); for (const b of cat.values()) { if (t && b.tpl.replace(/%\w+|\s/g, '') && t.includes(b.tpl.replace(/%\w+/g, '').replace(/\s/g, '').slice(0, 6)) && b.tpl.replace(/%\w+/g, '').replace(/\s/g, '').length > 3) return b.id; } }
  return null;
}

// ---------- 캡션(표시 텍스트) ----------
export function blockCaption(platformKey, node) {
  const def = getBlockDef(platformKey, node.type);
  if (!def) return node.type;
  return def.tpl.replace(/%([A-Z_0-9]+)/g, (_, key) => {
    const pdef = def.params[key];
    const v = node.params?.[key];
    if (!pdef) return '';
    if (pdef.kind === 'dropdown') return (pdef.options.find((o) => o[1] === v) || [v])[0] + '▼';
    if (v && typeof v === 'object') return `(${blockCaption(platformKey, v)})`;
    return `(${v})`;
  });
}

// ---------- 컴파일 ----------
function indentLines(code, indent) { return code.split('\n').map((l) => (l.length ? indent + l : l)).join('\n'); }

function optionMeta(pdef, v) { const o = (pdef.options || []).find((x) => x[1] === v); return { label: o ? o[0] : String(v), code: o ? (o[2] !== undefined ? o[2] : o[1]) : String(v) }; }

function fillTemplate(tpl, ctx) {
  return tpl.replace(/\$\{([A-Za-z_0-9]+)(?::([a-z_]+))?\}/g, (m, name, mod) => {
    if (name === 'BODY' || name === 'ELSE' || name === 'BODY_FLAT') return m; // 나중에 채움
    let v = ctx[name];
    if (v === undefined) return m;
    if (mod === 'q') return JSON.stringify(String(v));
    if (mod === 'code') return ctx[name + '_code'] ?? v;
    if (mod === 'label') return ctx[name + '_label'] ?? v;
    if (mod === 'lower') return String(v).toLowerCase();
    return String(v);
  });
}

export function compileTree(platformKey, blocks, langKey) {
  const plat = PLATFORMS[platformKey];
  const lang = plat.langs.find((l) => l.key === langKey) || plat.langs[0];
  const body = blocks.map((b) => compileNode(platformKey, b, lang)).filter(Boolean).join('\n\n');
  const hasAI = treeHas(platformKey, blocks, (d) => d.aiOnly);
  const notes = [];
  if (hasAI && langKey === 'entryPy') notes.push('⚠ 이 코드에는 인공지능 블록이 포함되어 있습니다. 엔트리 파이썬 모드는 인공지능 블록을 지원하지 않으므로, 인공지능 부분(# [AI 블록])은 블록 모드에서 직접 조립하세요.');
  if (hasAI && langKey === 'py') notes.push('⚠ 인공지능 블록(# [AI])은 엔트리/앱의 AI 기능이므로 독립 파이썬에서는 카메라·음성 라이브러리로 별도 구현이 필요합니다.');
  return { code: [lang.header, body, lang.footer].filter((s) => s && s.trim().length).join('\n').trim() + '\n', notes, lang };
}

function treeHas(platformKey, blocks, pred) {
  for (const b of blocks || []) {
    const d = getBlockDef(platformKey, b.type);
    if (d && pred(d)) return true;
    for (const v of Object.values(b.params || {})) if (v && typeof v === 'object' && treeHas(platformKey, [v], pred)) return true;
    if (treeHas(platformKey, b.children, pred) || treeHas(platformKey, b.elseChildren, pred)) return true;
  }
  return false;
}

function compileNode(platformKey, node, lang) {
  const def = getBlockDef(platformKey, node.type);
  if (!def) return `# (알 수 없는 블록: ${node.type})`;
  const ctx = {};
  for (const [key, pdef] of Object.entries(def.params || {})) {
    const v = node.params?.[key];
    if (pdef.kind === 'dropdown') { const m = optionMeta(pdef, v); ctx[key] = v; ctx[key + '_code'] = m.code; ctx[key + '_label'] = m.label; }
    else if (v && typeof v === 'object') ctx[key] = compileNode(platformKey, v, lang);
    else ctx[key] = pdef.kind === 'text' || pdef.kind === 'variable' ? String(v ?? '') : (v ?? 0);
  }
  let tpl = def.code?.[lang.key];
  if (tpl === undefined) { // 언어 미지원 블록 → 주석
    return `# ${blockCaption(platformKey, node).replace(/▼/g, '')}  (이 블록은 ${lang.label}로 변환되지 않습니다)`;
  }
  let code = typeof tpl === 'function' ? tpl(ctx) : fillTemplate(tpl, ctx);
  const passBody = (children) => {
    const inner = (children || []).map((c) => compileNode(platformKey, c, lang)).filter(Boolean).join('\n');
    return inner.trim().length ? inner : (lang.key === 'js' ? '' : 'pass');
  };
  if (code.includes('${BODY_FLAT}')) code = code.replace('${BODY_FLAT}', (node.children || []).map((c) => compileNode(platformKey, c, lang)).filter(Boolean).join('\n') || (lang.key === 'js' ? '' : 'pass'));
  if (code.includes('${BODY}')) {
    let bodyCode = passBody(node.children);
    if (lang.key === 'py' && platformKey === 'makecode-microbit' && def.shape === 'hat' && node.type !== 'on_start') {
      const vars = [...collectAssignedVars(node.children)];
      if (vars.length) bodyCode = `global ${vars.join(', ')}\n` + bodyCode;
    }
    code = code.replace('${BODY}', indentLines(bodyCode, lang.indent));
  }
  if (code.includes('${ELSE}')) code = code.replace('${ELSE}', indentLines(passBody(node.elseChildren), lang.indent));
  return code;
}

function collectAssignedVars(blocks, acc = new Set()) {
  for (const b of blocks || []) {
    if ((b.type === 'set_variable' || b.type === 'change_variable') && b.params?.VAR) acc.add(b.params.VAR);
    collectAssignedVars(b.children, acc); collectAssignedVars(b.elseChildren, acc);
  }
  return acc;
}

// ---------- AI 프롬프트용 카탈로그 레퍼런스 ----------
export function catalogReference(platformKey, { includeAI = true } = {}) {
  const plat = PLATFORMS[platformKey];
  const lines = [];
  const groups = {};
  for (const b of plat.blocks) {
    if (!includeAI && b.aiOnly) continue;
    const catLabel = (plat.colors[b.cat]?.label || b.cat) + (b.group ? `/${b.group}` : '');
    (groups[catLabel] ||= []).push(b);
  }
  for (const [g, list] of Object.entries(groups)) {
    lines.push(`## ${g}`);
    for (const b of list) {
      const ps = Object.entries(b.params || {}).map(([k, p]) => {
        if (p.kind === 'dropdown') return `${k}=드롭다운{${p.options.map((o) => `${o[1]}:"${o[0]}"`).join(', ')}}`;
        if (p.kind === 'boolean') return `${k}=조건블록`;
        if (p.kind === 'value') return `${k}=숫자 또는 값블록(기본 ${p.def})`;
        if (p.kind === 'variable') return `${k}=변수이름`;
        return `${k}=문자열`;
      });
      lines.push(`- ${b.id} [${b.shape}] "${b.tpl}"${ps.length ? ' — ' + ps.join('; ') : ''}${b.help ? ` (${b.help})` : ''}`);
    }
  }
  return lines.join('\n');
}

export function platformColors(platformKey) { return PLATFORMS[platformKey].colors; }
export function collectVariables(blocks, acc = new Set()) {
  for (const b of blocks || []) {
    for (const v of Object.values(b.params || {})) {
      if (v && typeof v === 'object') collectVariables([v], acc);
    }
    if (b.type && /variable/.test(b.type) && b.params?.VAR) acc.add(b.params.VAR);
    collectVariables(b.children, acc); collectVariables(b.elseChildren, acc);
  }
  return acc;
}
export function countBlocks(blocks) { let n = 0; for (const b of blocks || []) { n += 1 + countBlocks(b.children) + countBlocks(b.elseChildren); for (const v of Object.values(b.params || {})) if (v && typeof v === 'object') n += countBlocks([v]); } return n; }
