// Vercel Serverless Function — Gemini API 프록시 (모델 자동 승계 포함)
// - 서버 환경 변수 GEMINI_API_KEY 사용 → 브라우저에 키가 노출되지 않는다.
// - 선호 모델(GEMINI_MODEL 또는 요청 body.model)이 사라졌거나(404) 지원되지 않으면
//   models 목록 API에서 현재 사용 가능한 최신 Flash 계열 모델을 자동 선택해 재시도한다.
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const API = 'https://generativelanguage.googleapis.com/v1beta';

let resolvedModel = null;      // 함수 인스턴스 내 캐시
let resolvedAt = 0;
const CACHE_MS = 6 * 60 * 60 * 1000;

/** 사용 가능한 모델 중 수업용으로 가장 적합한(빠르고 저렴한 최신 Flash) 모델을 고른다 */
export function pickBestModel(models) {
  const cand = (models || [])
    .map((m) => (m.name || '').replace(/^models\//, ''))
    .filter((n) => /^gemini-\d/.test(n))
    .filter((n) => !/(embedding|tts|image|audio|live|vision|thinking|exp|preview|latest|robotics|computer-use)/i.test(n))
    .filter((n) => { const m = (models || []).find((x) => (x.name || '').endsWith(n)); return !m?.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent'); });
  const score = (n) => {
    const v = n.match(/gemini-(\d+)(?:\.(\d+))?/); const ver = v ? Number(v[1]) * 100 + Number(v[2] || 0) : 0;
    const tier = /flash-lite/.test(n) ? 3 : /flash/.test(n) ? 2 : /pro/.test(n) ? 1 : 0;
    const dated = /-\d{3,}$/.test(n) ? -1 : 0; // 날짜/버전 스냅샷보다 기본 별칭 우선
    return ver * 10 + tier + dated * 0.5;
  };
  return cand.sort((a, b) => score(b) - score(a))[0] || null;
}

async function listModels(apiKey) {
  const r = await fetch(`${API}/models?key=${apiKey}&pageSize=200`);
  if (!r.ok) return [];
  const d = await r.json();
  return d.models || [];
}

function looksLikeModelGone(status, text) {
  return status === 404 || (status === 400 && /model|not found|not supported|deprecated/i.test(text));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY가 서버에 설정되지 않았습니다. Vercel 환경 변수를 확인하세요.' });

  // GET /api/gemini → 현재 사용 중인 모델 상태 확인용
  if (req.method === 'GET') {
    return res.status(200).json({ preferred: DEFAULT_MODEL, active: resolvedModel || DEFAULT_MODEL, autoUpgraded: !!resolvedModel && resolvedModel !== DEFAULT_MODEL });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const requested = (body.model && /^[a-z0-9.\-]+$/i.test(body.model)) ? body.model : DEFAULT_MODEL;
    const payload = JSON.stringify({ contents: body.contents, generationConfig: body.generationConfig, safetySettings: body.safetySettings, systemInstruction: body.systemInstruction });
    const call = (model) => fetch(`${API}/models/${model}:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload });

    // 이미 승계된 모델이 캐시되어 있으면 그것을 먼저 사용
    const first = (resolvedModel && Date.now() - resolvedAt < CACHE_MS) ? resolvedModel : requested;
    let r = await call(first);
    let text = await r.text();

    if (!r.ok && looksLikeModelGone(r.status, text)) {
      const best = pickBestModel(await listModels(apiKey));
      if (best && best !== first) {
        const r2 = await call(best);
        const t2 = await r2.text();
        if (r2.ok) { resolvedModel = best; resolvedAt = Date.now(); console.warn(`[gemini] 모델 자동 승계: ${first} → ${best}`); }
        r = r2; text = t2;
      }
    }
    res.status(r.status);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Gemini-Model', resolvedModel || first);
    return res.send(text);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
