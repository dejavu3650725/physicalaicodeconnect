// Vercel Serverless Function — Gemini API 프록시
// 서버 환경 변수 GEMINI_API_KEY 를 사용하므로 브라우저에 키가 노출되지 않는다.
// (Vercel 프로젝트 설정 → Environment Variables 에 GEMINI_API_KEY 등록)
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY가 서버에 설정되지 않았습니다. Vercel 환경 변수를 확인하세요.' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const model = (body.model && /^[a-z0-9.\-]+$/i.test(body.model)) ? body.model : DEFAULT_MODEL;
    const payload = { contents: body.contents, generationConfig: body.generationConfig, safetySettings: body.safetySettings, systemInstruction: body.systemInstruction };
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const text = await r.text();
    res.status(r.status).setHeader('Content-Type', 'application/json').send(text);
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
