// ============================================================
// AI 설계 엔진 (Gemini)
//  - 카탈로그 기반 구조화 블록 트리 생성 → 정규화/검증 → (필요 시) 수정 재요청
//  - 코드는 AI가 쓰지 않고 engine.compileTree 가 결정적으로 생성 (할루시네이션 원천 차단)
// ============================================================
import { catalogReference, normalizeTree, PLATFORMS, countBlocks } from '../blocks/engine.js';
import { HARDWARE_MAP } from '../data/hardware.js';
import { designPrinciples } from './knowledge.js';
import { SAMPLES } from '../data/samples.js';
import { checkLevels, describeViolations } from './levelRules.js';

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

const API = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL_CACHE = 'pacc.geminiModel';
export function getActiveModel() { try { return localStorage.getItem(MODEL_CACHE) || MODEL; } catch { return MODEL; } }

/** models 목록에서 수업용으로 가장 적합한(빠르고 저렴한 최신 Flash) 모델을 고른다 — api/gemini.js 와 동일 규칙 */
export function pickBestModel(models) {
  const cand = (models || [])
    .map((m) => (m.name || '').replace(/^models\//, ''))
    .filter((n) => /^gemini-\d/.test(n))
    .filter((n) => !/(embedding|tts|image|audio|live|vision|thinking|exp|preview|latest|robotics|computer-use)/i.test(n))
    .filter((n) => { const m = (models || []).find((x) => (x.name || '').endsWith(n)); return !m?.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent'); });
  const score = (n) => {
    const v = n.match(/gemini-(\d+)(?:\.(\d+))?/); const ver = v ? Number(v[1]) * 100 + Number(v[2] || 0) : 0;
    const tier = /flash-lite/.test(n) ? 3 : /flash/.test(n) ? 2 : /pro/.test(n) ? 1 : 0;
    const dated = /-\d{3,}$/.test(n) ? -1 : 0;
    return ver * 10 + tier + dated * 0.5;
  };
  return cand.sort((a, b) => score(b) - score(a))[0] || null;
}
const modelGone = (status, text) => status === 404 || (status === 400 && /model|not found|not supported|deprecated/i.test(text));

async function callGemini({ system, prompt, temperature = 0.6, maxOutputTokens = 8192 }) {
  // thinkingBudget: 0 → Flash 계열의 내부 사고 단계를 끄고 즉시 생성(속도 우선). 거부하는 모델이면 서버/클라이언트가 설정을 빼고 재시도.
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    generationConfig: { responseMimeType: 'application/json', temperature, maxOutputTokens, thinkingConfig: { thinkingBudget: 0 } },
    safetySettings: SAFETY_SETTINGS,
  };
  const localKey = getLocalApiKey() || import.meta.env.VITE_GEMINI_API_KEY;
  let res, text;
  if (localKey) {
    // 개인 키 직접 호출 — 모델이 사라졌으면(404) 목록 API로 최신 Flash 모델을 찾아 자동 승계
    const model = getActiveModel();
    const call = (m, b = body) => fetch(`${API}/models/${m}:generateContent?key=${localKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
    res = await call(model); text = await res.text();
    if (res.status === 400 && /thinking/i.test(text)) { const { thinkingConfig, ...gc } = body.generationConfig; void thinkingConfig; res = await call(model, { ...body, generationConfig: gc }); text = await res.text(); }
    if (!res.ok && modelGone(res.status, text)) {
      try {
        const lr = await fetch(`${API}/models?key=${localKey}&pageSize=200`);
        const best = lr.ok ? pickBestModel((await lr.json()).models) : null;
        if (best && best !== model) {
          const r2 = await call(best); const t2 = await r2.text();
          if (r2.ok) { try { localStorage.setItem(MODEL_CACHE, best); } catch { /* ignore */ } console.warn(`[gemini] 모델 자동 승계: ${model} → ${best}`); }
          res = r2; text = t2;
        }
      } catch (e) { console.warn('모델 목록 조회 실패', e); }
    }
  } else {
    res = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, model: MODEL }) });
    text = await res.text();
    const used = res.headers.get('X-Gemini-Model'); if (used) { try { sessionStorage.setItem('pacc.serverModel', used); } catch { /* ignore */ } }
  }
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text)?.error?.message || JSON.parse(text)?.error || text; } catch { /* raw */ }
    throw new Error(`AI 호출 실패 (${res.status}): ${String(msg).slice(0, 300)}`);
  }
  const data = JSON.parse(text);
  const out = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  return parseJSON(out);
}

/** AI 설정 화면용: 서버/로컬에서 현재 사용 중인 모델 조회 */
export async function fetchModelStatus() {
  if (getLocalApiKey() || import.meta.env.VITE_GEMINI_API_KEY) return { preferred: MODEL, active: getActiveModel(), autoUpgraded: getActiveModel() !== MODEL, where: '브라우저' };
  try { const r = await fetch('/api/gemini'); if (r.ok) return { ...(await r.json()), where: '서버' }; } catch { /* ignore */ }
  return { preferred: MODEL, active: MODEL, autoUpgraded: false, where: '서버(확인 불가)' };
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
  return `당신은 서울특별시교육청 AI피지컬컴퓨팅융합교육연구회의 베테랑 초등 교사이자 피지컬 컴퓨팅 전문가 '선생님'입니다.
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

${designPrinciples(hw.id)}

# 블록 카탈로그 (${plat.tool} / ${variant?.label})
${catalogReference(platformKey, { includeAI })}`;
}

function levelGuide(hw, platformKey) {
  const hasAI = PLATFORMS[platformKey].blocks.some((b) => b.aiOnly || b.cat === 'ai');
  return `세 단계는 **반드시 서로 다른 난이도**여야 하며 시스템이 아래 규칙을 자동 검사합니다(위반 시 재작성 요청).
- basic(🌱 기초): 순차 구조. 시작 블록 1개, 블록 5~9개. **조건(만일) 블록 금지, 인공지능 블록 금지.** 센서 없이 움직임·출력·소리·짧은 반복만.
- standard(🚀 기본): **센서 값 블록 1개 이상 + 조건 블록 1개 이상 + 반복 구조.** 변수 1개 이상 권장. 블록 8~16개(기초보다 많아야 함). 인공지능 블록 금지.
- advanced(🔥 심화): ${hasAI ? '**인공지능 블록 1개 이상**(인식/분류 시작 + 결과 판단) + 조건 분기.' : `AI 블록이 없는 도구이므로 **두 가지 이상의 센서 또는 변수·통신을 결합**한 융합 프로젝트. AI 확장 방법(${hw.aiHow.split('.')[0]})은 explanation에 말로만 안내.`} 블록 12~24개(기본보다 많아야 함). 기본 단계의 구조를 확장하는 방식으로 연결감 있게.`;
}

/** 검증된 예시 구조를 few-shot으로 제공 — 같은 플랫폼의 내장 샘플 */
function fewShot(hw, platformKey) {
  const s = SAMPLES[hw.id];
  if (!s || s.platformKey !== platformKey) return '';
  const pick = (k) => JSON.stringify(s.levels[k].blocks);
  return `# 참고: 검증된 3단계 예시 (아이디어 "${s.idea}") — 구조와 난이도 차이를 참고하되 내용은 학생 아이디어에 맞게 새로 설계
basic: ${pick('basic')}
standard: ${pick('standard')}
advanced: ${pick('advanced')}`;
}

// ---------- 설계 생성 ----------
const RESULT_CACHE = 'pacc.resultCache.v1';
function cacheKey(o) { return JSON.stringify(o); }
function cacheGet(k) { try { const m = JSON.parse(sessionStorage.getItem(RESULT_CACHE) || '{}'); return m[k] || null; } catch { return null; } }
function cachePut(k, v) { try { const m = JSON.parse(sessionStorage.getItem(RESULT_CACHE) || '{}'); const keys = Object.keys(m); if (keys.length > 12) delete m[keys[0]]; m[k] = v; sessionStorage.setItem(RESULT_CACHE, JSON.stringify(m)); } catch { /* ignore */ } }

/**
 * 속도 전략: ① 블록 설계(핵심)와 ② 수업 흐름(lessonPlan)을 **동시에** 요청하고, 핵심이 오면 바로 화면에 보여준다.
 * onLessonPlan(plan) 은 ②가 도착하면 호출된다(같은 세션에서 같은 입력이면 캐시로 즉시).
 */
export async function designProject({ hardwareId, platformKey, idea, extra, onLessonPlan }) {
  const hw = HARDWARE_MAP[hardwareId];
  const key = cacheKey({ hardwareId, platformKey, idea, extra });
  const cached = cacheGet(key);
  if (cached) { if (onLessonPlan && cached.lessonPlan) queueMicrotask(() => onLessonPlan(cached.lessonPlan)); return { ...cached, fromCache: true }; }

  const system = systemPrompt(hw, platformKey, { includeAI: true });
  const head = `학생의 프로젝트 아이디어: "${idea}"${extra ? `\n학급 조건: ${extra}` : ''}`;
  const corePrompt = `${head}

아래 JSON 형식으로만 응답하세요(수업 차시 계획은 별도 요청이므로 여기서는 쓰지 않습니다).
{
  "title": "프로젝트 제목(재치 있게, 15자 이내)",
  "summary": "이 프로젝트가 무엇을 하는지 한 문장",
  "edgeCase": null 또는 {"wish":"학생이 원한 것","workaround":"실제 부품으로 표현하는 방법"},
  "levels": {
    "basic":    {"goal":"이 단계에서 배우는 것 한 문장","blocks":[...블록 트리...],"explanation":"선생님 해설(3~4문장, 핵심 용어는 **굵게**)","ctConcepts":["순차","반복"],"tryThis":"학생이 바꿔볼 값/도전 과제 한 문장"},
    "standard": {...},
    "advanced": {...}
  },
  "variables": [{"name":"변수명","value":30,"desc":"무엇을 조절하는지"}],
  "realWorld": "이 원리가 쓰이는 실생활 예 한 문장"
}
# 단계 가이드
${levelGuide(hw, platformKey)}
${fewShot(hw, platformKey)}`;

  const planPrompt = `${head}
이 아이디어로 ${hw.name}(${PLATFORMS[platformKey].tool}) 피지컬 AI 융합 수업을 학교자율시간 4~6차시로 설계합니다. 위 '수업 설계 원리'의 4단계 흐름·알고리즘 패턴·평가 관점을 이 프로젝트에 맞게 구체화하세요. 블록 코드는 쓰지 않습니다.
JSON 형식으로만 응답:
{
  "stages": [
    {"key":"tinkering","title":"차시 제목","minutes":40,"activities":["활동1","활동2","활동3"],"teacherTip":"교사 유의점 한 문장"},
    {"key":"making","title":"...","minutes":80,"activities":[...],"teacherTip":"..."},
    {"key":"sharing","title":"...","minutes":40,"activities":[...],"teacherTip":"..."},
    {"key":"improving","title":"...","minutes":40,"activities":[...],"teacherTip":"..."}
  ],
  "algorithmFlow": ["① 센서 입력: ...", "② AI 인식: ...", "③ 판단: ...", "④ 출력: ..."],
  "assessment": ["평가 관점 1(관찰/자기/동료 중 표기)", "평가 관점 2", "평가 관점 3"],
  "safety": ["안전 지도 1", "안전 지도 2"],
  "extensions": ["확장 아이디어 1", "확장 아이디어 2"]
}
각 문장은 짧게(활동은 15자 내외). 간결할수록 좋습니다.`;

  // 수업 흐름은 카탈로그가 필요 없어 짧은 시스템 프롬프트로 병렬 요청
  const planSystem = `당신은 서울특별시교육청 AI피지컬컴퓨팅융합교육연구회의 베테랑 초등 교사입니다. 초등 눈높이의 구체적인 활동으로 씁니다.\n${designPrinciples(hw.id)}`;
  let planState; // undefined = 진행 중, null = 실패, object = 완료
  const planPromise = callGemini({ system: planSystem, prompt: planPrompt, temperature: 0.6, maxOutputTokens: 2200 })
    .catch((e) => { console.warn('수업 흐름 생성 실패', e); return null; })
    .then((plan) => { planState = plan; if (onLessonPlan) onLessonPlan(plan); return plan; });

  const raw = await callGemini({ system, prompt: corePrompt, temperature: 0.7, maxOutputTokens: 9000 });
  const result = await finalize(platformKey, raw, { system, idea });
  // 수업 흐름이 먼저 도착해 있으면 바로 합친다(실패했으면 null → 기본 틀 사용)
  if (planState !== undefined) { result.lessonPlan = planState; result.planFailed = planState === null; }
  // 캐시는 수업 흐름까지 도착한 뒤 저장(백그라운드)
  planPromise.then((plan) => { if (plan) cachePut(key, { ...result, lessonPlan: plan }); });
  return result;
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
  // 1) 카탈로그 밖 블록  2) 단계 규칙 위반  → 사유를 구체적으로 적어 1회 수정 요청
  const unknown = allIssues.filter((i) => i.kind === 'unknown_block' || i.kind === 'unknown_value');
  let check = checkLevels(platformKey, result.levels);
  if ((unknown.length || !check.ok) && ctx?.system) {
    try {
      const reasons = [];
      if (unknown.length) reasons.push(`- 카탈로그에 없는 블록 사용: ${[...new Set(unknown.map((u) => u.type))].join(', ')} → 카탈로그의 블록으로 대체`);
      if (!check.ok) reasons.push(describeViolations(check));
      const badLevels = ['basic', 'standard', 'advanced'].filter((k) => !check[k].ok || unknown.some((u) => u.level === k));
      const fixPrompt = `이전 설계를 검사한 결과 다음 문제가 있습니다:
${reasons.join('\n')}

프로젝트 "${ctx.idea}"에서 문제가 있는 단계 [${badLevels.join(', ')}] 만 다시 작성하세요(다른 단계는 유지됩니다). 각 단계는 {"goal","blocks","explanation","ctConcepts","tryThis"} 를 포함합니다.
현재 설계(참고):\n${JSON.stringify({ levels: Object.fromEntries(['basic', 'standard', 'advanced'].map((k) => [k, { blocks: raw.levels?.[k]?.blocks }])) }).slice(0, 6000)}
JSON 형식으로만 응답: {"levels":{${badLevels.map((k) => `"${k}":{...}`).join(',')}}}`;
      const fixed = await callGemini({ system: ctx.system, prompt: fixPrompt, temperature: 0.4, maxOutputTokens: 6000 });
      const cand = { ...result.levels };
      for (const key of ['basic', 'standard', 'advanced']) {
        const lv = fixed.levels?.[key];
        if (!lv?.blocks) continue;
        const issues = [];
        const tree = normalizeTree(platformKey, lv.blocks, issues);
        cand[key] = { ...result.levels[key], ...lv, blocks: tree, issues, repaired: true };
      }
      const check2 = checkLevels(platformKey, cand);
      const unk = (lvls) => Object.values(lvls).reduce((n, l) => n + (l.issues || []).filter((i) => i.kind === 'unknown_block').length, 0);
      // 규칙 위반과 미지 블록이 모두 늘지 않았을 때만 수정본 채택
      if (check2.hardCount <= check.hardCount && unk(cand) <= unk(result.levels)) { result.levels = cand; check = check2; result.repaired = true; }
    } catch (e) { console.warn('수정 재요청 실패', e); }
  }
  result.issues = allIssues;
  result.check = serializeCheck(check);
  return result;
}

function serializeCheck(check) {
  const o = { ok: check.ok, hardCount: check.hardCount };
  for (const k of ['basic', 'standard', 'advanced']) o[k] = { ok: check[k].ok, hard: check[k].hard, soft: check[k].soft, profile: { ...check[k].profile } };
  return o;
}

/** 단계 하나만 다시 설계 — 다른 단계는 유지, 규칙 위반 시 1회 재요청 */
export async function regenerateLevel({ hardwareId, platformKey, idea, extra, levelKey, result }) {
  const hw = HARDWARE_MAP[hardwareId];
  const system = systemPrompt(hw, platformKey, { includeAI: true });
  const name = { basic: '기초(basic)', standard: '기본(standard)', advanced: '심화(advanced)' }[levelKey];
  const others = ['basic', 'standard', 'advanced'].filter((k) => k !== levelKey);
  const prev = result.levels[levelKey];
  const violations = result.check?.[levelKey]?.hard || [];
  const ask = (note) => `프로젝트 "${result.title}" (아이디어: "${idea}")${extra ? `\n학급 조건: ${extra}` : ''}
${name} 단계만 새로 설계합니다. 다른 두 단계는 그대로 유지되므로 이들과 난이도가 뚜렷히 구분되어야 합니다.
${others.map((k) => `${k} (유지, 블록 ${countBlocksSafe(result.levels[k].blocks)}개): ${JSON.stringify(result.levels[k].blocks).slice(0, 2500)}`).join('\n')}
이전 ${name} 설계: ${JSON.stringify(prev.blocks).slice(0, 3000)}
${violations.length ? `이전 설계의 문제: ${violations.join(' / ')}` : '이전과 다른 접근으로, 더 교육적으로 좋은 구성을 제안하세요.'}
${note || ''}
# 단계 가이드
${levelGuide(hw, platformKey)}
JSON 형식으로만 응답: {"goal":"...","blocks":[...],"explanation":"...","ctConcepts":[...],"tryThis":"..."}`;
  const build = (raw) => { const issues = []; const tree = normalizeTree(platformKey, raw.blocks || [], issues); return { ...prev, ...raw, blocks: tree, issues, repaired: true }; };
  let lv = build(await callGemini({ system, prompt: ask(), temperature: 0.8 }));
  let levels = { ...result.levels, [levelKey]: lv };
  let check = checkLevels(platformKey, levels);
  if (!check[levelKey].ok) {
    try {
      const lv2 = build(await callGemini({ system, prompt: ask(`다시 검사한 결과 문제가 남아 있습니다: ${check[levelKey].hard.join(' / ')} — 반드시 해결하세요.`), temperature: 0.5 }));
      const levels2 = { ...result.levels, [levelKey]: lv2 };
      const check2 = checkLevels(platformKey, levels2);
      if (check2[levelKey].hard.length <= check[levelKey].hard.length) { lv = lv2; levels = levels2; check = check2; }
    } catch (e) { console.warn('단계 재요청 실패', e); }
  }
  return { level: lv, check: serializeCheck(check) };
}
const countBlocksSafe = (b) => { try { return countBlocks(b); } catch { return 0; } };

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
