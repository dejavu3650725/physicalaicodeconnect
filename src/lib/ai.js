// ============================================================
// AI 설계 엔진 (Gemini)
//  - 카탈로그 기반 구조화 블록 트리 생성 → 정규화/검증 → (필요 시) 수정 재요청
//  - 코드는 AI가 쓰지 않고 engine.compileTree 가 결정적으로 생성 (할루시네이션 원천 차단)
// ============================================================
import { catalogReference, normalizeTree, PLATFORMS } from '../blocks/engine.js';
import { HARDWARE_MAP } from '../data/hardware.js';

const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.1-flash-lite';
const KEY_STORAGE = 'pacc.geminiKey';

export function getLocalApiKey() { try { return localStorage.getItem(KEY_STORAGE) || ''; } catch { return ''; } }
export function setLocalApiKey(k) { try { if (k) localStorage.setItem(KEY_STORAGE, k.trim()); else localStorage.removeItem(KEY_STORAGE); } catch { /* ignore */ } }
export function aiMode() {
  if (getLocalApiKey()) return { mode: 'local', label: '내 API 키(브라우저 저장)' };
  if (import.meta.env.VITE_GEMINI_API_KEY) return { mode: 'env', label: '개발용 환경 변수 키' };
  return { mode: 'server', label: '서버 프록시(/api/gemini)' };
}

async function callGemini({ system, prompt, temperature = 0.6, maxOutputTokens = 8192 }) {
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    generationConfig: { responseMimeType: 'application/json', temperature, maxOutputTokens },
    safetySettings: SAFETY_SETTINGS,
  };
  const localKey = getLocalApiKey() || import.meta.env.VITE_GEMINI_API_KEY;
  const url = localKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${localKey}`
    : '/api/gemini';
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(localKey ? body : { ...body, model: MODEL }) });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text)?.error?.message || JSON.parse(text)?.error || text; } catch { /* raw */ }
    throw new Error(`AI 호출 실패 (${res.status}): ${String(msg).slice(0, 300)}`);
  }
  const data = JSON.parse(text);
  const out = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  return parseJSON(out);
}

function parseJSON(raw) {
  let s = String(raw).trim();
  if (s.startsWith('```')) s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { return JSON.parse(s); } catch { /* try to salvage */ }
  const a = s.indexOf('{'); const b = s.lastIndexOf('}');
  if (a >= 0 && b > a) return JSON.parse(s.slice(a, b + 1));
  throw new Error('AI 응답을 JSON으로 해석할 수 없습니다.');
}

// ---------- 시스템 프롬프트 ----------
function systemPrompt(hw, platformKey, { includeAI }) {
  const plat = PLATFORMS[platformKey];
  const variant = hw.variants.find((v) => v.key === platformKey);
  return `당신은 서울시교육청 AI·피지컬컴퓨팅 융합교육연구회의 베테랑 초등 교사이자 피지컬 컴퓨팅 전문가 '선생님'입니다.
학생의 아이디어를 실제 교구 **${hw.name}(${variant?.label})** 로 구현하는 ${plat.tool} 블록 프로그램을 설계합니다.

# 절대 규칙
1. 블록은 아래 [블록 카탈로그]에 있는 id만 사용합니다. 카탈로그에 없는 블록·센서·기능을 지어내지 마세요.
2. 출력은 "블록 트리" JSON입니다. 텍스트 코드는 쓰지 않습니다(코드는 시스템이 블록에서 자동 생성).
   블록 노드: {"type":"<id>","params":{...},"children":[...],"elseChildren":[...]}
   - params 키는 카탈로그의 파라미터 이름을 그대로 사용. 드롭다운은 값(코드) 또는 화면 라벨 중 하나.
   - 숫자 파라미터에는 숫자 리터럴 또는 값 블록({"type":..., "params":...})을 넣을 수 있음.
   - 조건 파라미터(조건블록)에는 boolean 블록 노드를 넣습니다. 예: {"type":"boolean_basic_operator","params":{"A":{"type":"hamster_value","params":{"V":"leftProximity"}},"OP":"LESS","B":30}}
   - children 은 C블록/시작(hat) 블록 안쪽, elseChildren 은 아니면 쪽.
   - 최상위 배열의 각 원소는 반드시 시작(hat) 블록이어야 합니다. 프로그램은 보통 시작 블록 1~3개.
3. 하드웨어 실제 사양: 센서 = ${hw.sensors.join(', ')} / 출력 = ${hw.actuators.join(', ')} / 한계 = ${hw.limits}
4. 학생이 하드웨어 한계를 넘는 요청(예: 하늘을 나는 햄스터, 물속 로봇, 레이저)을 하면 거부하지 말고 실제 부품으로 표현하는 창의적 우회안을 제시하고 edgeCase 필드에 기록합니다.
5. 초등학생 눈높이의 친절하고 유머러스한 구어체로 설명합니다. 존재하지 않는 기능을 있다고 말하지 않습니다.
${includeAI ? `6. 심화 단계에서는 AI 융합 방법을 사용합니다: ${hw.aiHow}` : '6. 인공지능 블록은 사용하지 않습니다.'}

# 블록 카탈로그 (${plat.tool} / ${variant?.label})
${catalogReference(platformKey, { includeAI })}`;
}

function levelGuide(hw, platformKey) {
  const hasAI = PLATFORMS[platformKey].blocks.some((b) => b.aiOnly);
  return `- basic(🌱 기초): 순차 구조 중심. 시작 블록 1개, 블록 5~9개. 센서 없이 움직임/출력만.
- standard(🚀 기본): 반복 + 조건(센서 값 판단) 구조. 블록 8~16개. 변수 1개 이상 활용 권장.
- advanced(🔥 심화): ${hasAI ? `인공지능 블록(카탈로그의 인공지능 카테고리)과 결합. 인식/분류 결과에 따라 분기. 블록 12~24개.` : `여러 센서 데이터 + 라디오/통신/변수를 결합한 융합 프로젝트. 블록 12~24개. 이 도구에는 AI 블록이 없으므로 AI 확장 방법(${hw.aiHow.split('.')[0]})은 explanation에 말로만 안내하고 블록은 카탈로그 안에서만 사용.`}`;
}

// ---------- 설계 생성 ----------
export async function designProject({ hardwareId, platformKey, idea, curriculum, extra }) {
  const hw = HARDWARE_MAP[hardwareId];
  const system = systemPrompt(hw, platformKey, { includeAI: true });
  const curriculumCtx = curriculum ? `\n# 연결할 교육청 자료(서울시교육청 『피지컬 AI 원리를 활용한 문제해결 프로젝트』)
- 챕터: [${curriculum.level}] ${curriculum.title} (${curriculum.subtitle || ''})
- 학습 목표: ${(curriculum.goals || []).join(' / ')}
- 알고리즘 흐름: ${(curriculum.algorithm || []).map((a) => `${a.step} ${a.process}: ${a.detail}`).join(' → ')}
- 자료에 나온 핵심 블록: ${(curriculum.keyBlocks || []).slice(0, 25).join(' | ')}
이 자료의 알고리즘 흐름과 학습 목표에 부합하도록 설계하고, lessonLink 필드에 어느 단계/차시와 연결되는지 한 문장으로 적으세요.\n` : '';
  const prompt = `학생의 프로젝트 아이디어: "${idea}"${extra ? `\n추가 조건: ${extra}` : ''}
${curriculumCtx}
아래 JSON 형식으로만 응답하세요.
{
  "title": "프로젝트 제목(재치 있게, 15자 이내)",
  "summary": "이 프로젝트가 무엇을 하는지 한 문장",
  "edgeCase": null 또는 {"wish":"학생이 원한 것","workaround":"실제 부품으로 표현하는 방법"},
  "levels": {
    "basic":    {"goal":"이 단계에서 배우는 것 한 문장","blocks":[...블록 트리...],"explanation":"선생님 해설(3~5문장, 핵심 용어는 **굵게**)","ctConcepts":["순차","반복"],"tryThis":"학생이 바꿔볼 값/도전 과제 한 문장"},
    "standard": {...},
    "advanced": {...}
  },
  "variables": [{"name":"변수명","value":30,"desc":"무엇을 조절하는지"}],
  "realWorld": "이 원리가 쓰이는 실생활 예 한 문장",
  "lessonLink": "교육청 자료와의 연결(없으면 빈 문자열)"
}
# 단계 가이드
${levelGuide(hw, platformKey)}`;
  const raw = await callGemini({ system, prompt, temperature: 0.7 });
  return finalize(platformKey, raw, { system, idea });
}

async function finalize(platformKey, raw, ctx) {
  const result = { ...raw, levels: {} };
  const allIssues = [];
  for (const key of ['basic', 'standard', 'advanced']) {
    const lv = raw.levels?.[key] || {};
    const issues = [];
    const tree = normalizeTree(platformKey, lv.blocks || [], issues);
    allIssues.push(...issues.map((i) => ({ ...i, level: key })));
    result.levels[key] = { ...lv, blocks: tree, issues };
  }
  // 알 수 없는 블록이 있으면 1회 수정 요청 (프롬프트 체이닝)
  const unknown = allIssues.filter((i) => i.kind === 'unknown_block' || i.kind === 'unknown_value');
  if (unknown.length && ctx?.system) {
    try {
      const fixPrompt = `이전 설계에서 카탈로그에 없는 블록이 사용되었습니다: ${[...new Set(unknown.map((u) => u.type))].join(', ')}.
프로젝트 "${ctx.idea}"의 세 단계(basic/standard/advanced) blocks 를 카탈로그에 있는 블록만 사용해 다시 작성하세요. 나머지 필드는 동일하게 유지하세요. 이전 설계(참고):\n${JSON.stringify(raw).slice(0, 6000)}\n같은 JSON 형식으로만 응답하세요.`;
      const fixed = await callGemini({ system: ctx.system, prompt: fixPrompt, temperature: 0.4 });
      for (const key of ['basic', 'standard', 'advanced']) {
        const lv = fixed.levels?.[key];
        if (!lv?.blocks) continue;
        const issues = [];
        const tree = normalizeTree(platformKey, lv.blocks, issues);
        if (issues.filter((i) => i.kind === 'unknown_block').length <= (result.levels[key].issues || []).filter((i) => i.kind === 'unknown_block').length) {
          result.levels[key] = { ...result.levels[key], ...lv, blocks: tree, issues, repaired: true };
        }
      }
    } catch (e) { console.warn('수정 재요청 실패', e); }
  }
  result.issues = allIssues;
  return result;
}

// ---------- 피드백 + 아이디어 반영 업데이트 ----------
export async function feedbackAndUpdate({ hardwareId, platformKey, idea, levelKey, currentBlocks, userIdea }) {
  const hw = HARDWARE_MAP[hardwareId];
  const system = systemPrompt(hw, platformKey, { includeAI: true });
  const prompt = `학생 프로젝트: "${idea}" (현재 단계: ${levelKey})
현재 블록 트리:
${JSON.stringify(currentBlocks).slice(0, 7000)}

학생이 추가하고 싶어하는 아이디어: "${userIdea}"

이 아이디어를 교육적으로 검토하고, 아이디어가 실제로 반영된 **업데이트된 전체 블록 트리**를 만들어 주세요.
JSON 형식:
{
  "strengths": "아이디어의 좋은 점 폭풍 칭찬(초등학생 눈높이 구어체, 2~3문장)",
  "improvements": "더 발전시킬 점 또는 ${hw.short}로 구현할 때 주의할 점(2~3문장)",
  "changes": ["바뀐 블록/추가된 블록을 학생 말로 설명 1", "..."],
  "blocks": [ ...업데이트된 전체 블록 트리(시작 블록부터)... ],
  "edgeCase": null 또는 {"wish":"...","workaround":"..."}
}`;
  const raw = await callGemini({ system, prompt, temperature: 0.6 });
  const issues = [];
  const tree = normalizeTree(platformKey, raw.blocks || [], issues);
  return { ...raw, blocks: tree, issues };
}

// ---------- 교육청 자료 기반 수업(차시) 설계 ----------
export async function designLessonFromCurriculum({ hardwareId, platformKey, chapter, classContext }) {
  const hw = HARDWARE_MAP[hardwareId];
  const system = systemPrompt(hw, platformKey, { includeAI: true });
  const prompt = `서울시교육청 배포 자료 『피지컬 AI 원리를 활용한 문제해결 프로젝트』의 다음 챕터를 우리 학급(학교자율시간)에 맞게 재구성하려 합니다.
챕터: [${chapter.level}] ${chapter.title} — ${chapter.subtitle || ''}
설계 의도: ${(chapter.designIntent || []).join(' / ')}
학습 목표: ${(chapter.goals || []).join(' / ')}
차시 흐름: ${(chapter.sessions || []).map((s) => `${s.no}차시 ${s.stage}: ${(s.contents || []).map((c) => c.title).join(', ')}`).join(' | ')}
알고리즘 흐름: ${(chapter.algorithm || []).map((a) => `${a.step} ${a.process}(${a.example || ''})`).join(' → ')}
학급 상황/요청: ${classContext || '특별한 조건 없음'}

이 챕터의 최종 산출물(로봇 프로그램)을 우리가 사용하는 교구 **${hw.name}** 와 ${PLATFORMS[platformKey].tool} 로 구현한 '완성 예시 프로그램'과, 교사용 수업 흐름 재구성안을 만들어 주세요.
JSON:
{
  "title": "재구성 수업 제목",
  "summary": "한 문장 요약",
  "sessionPlan": [{"no":"1","title":"차시 제목","activities":["활동1","활동2"],"assessment":"평가 관점 한 문장"}],
  "levels": {
    "basic": {"goal":"...","blocks":[...],"explanation":"...","ctConcepts":[...],"tryThis":"..."},
    "standard": {"goal":"...","blocks":[...],"explanation":"...","ctConcepts":[...],"tryThis":"..."},
    "advanced": {"goal":"...","blocks":[...],"explanation":"...","ctConcepts":[...],"tryThis":"..."}
  },
  "variables": [{"name":"...","value":0,"desc":"..."}],
  "realWorld": "...",
  "lessonLink": "원 자료의 어느 차시/단계를 어떻게 바꾼 것인지 한 문장",
  "edgeCase": null
}
# 단계 가이드
${levelGuide(hw, platformKey)}`;
  const raw = await callGemini({ system, prompt, temperature: 0.6, maxOutputTokens: 12000 });
  return finalize(platformKey, raw, { system, idea: chapter.title });
}
