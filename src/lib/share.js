// ============================================================
// 공유 — 설계 결과를 서버 없이 URL(압축) 과 이미지 카드(Canvas)로 내보낸다
//  - URL: JSON → deflate-raw(CompressionStream) → base64url → #/view?d=...
//  - 카드: 1200×630 PNG, 제목·교구·3단계·선택 단계 블록 미리보기·연구회 로고
// ============================================================
import { blockCaption, getBlockDef, PLATFORMS, countBlocks } from '../blocks/engine.js';
import { HARDWARE_MAP, LEVELS } from '../data/hardware.js';

const ORG = '서울특별시교육청 AI피지컬컴퓨팅융합교육연구회';
const SITE = 'physical-ai-code-connect.vercel.app';

// ---------- 압축 유틸 ----------
const b64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)), (c) => c.charCodeAt(0));

async function pipe(bytes, stream) {
  const ws = new Blob([bytes]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(ws).arrayBuffer());
}
export const canCompress = () => typeof CompressionStream !== 'undefined';

/** 공유에 필요한 필드만 남긴 결과 */
export function slimResult(result) {
  const lv = {};
  for (const k of ['basic', 'standard', 'advanced']) {
    const l = result.levels?.[k]; if (!l) continue;
    lv[k] = { goal: l.goal, blocks: l.blocks, explanation: l.explanation, ctConcepts: l.ctConcepts, tryThis: l.tryThis };
  }
  return { v: 1, hwId: result.hwId, platformKey: result.platformKey, idea: result.idea, title: result.title, summary: result.summary, edgeCase: result.edgeCase || null, levels: lv, variables: result.variables || [], realWorld: result.realWorld || '', lessonPlan: result.lessonPlan || null };
}

export async function encodeShare(result) {
  const json = JSON.stringify(slimResult(result));
  const bytes = new TextEncoder().encode(json);
  if (!canCompress()) return 'j' + b64url(bytes);
  const z = await pipe(bytes, new CompressionStream('deflate-raw'));
  return 'z' + b64url(z);
}

export async function decodeShare(s) {
  if (!s || s.length < 2) throw new Error('공유 데이터가 없습니다.');
  const kind = s[0]; const bytes = unb64url(s.slice(1));
  const raw = kind === 'z' ? await pipe(bytes, new DecompressionStream('deflate-raw')) : bytes;
  const obj = JSON.parse(new TextDecoder().decode(raw));
  if (!obj?.levels || !obj?.platformKey) throw new Error('공유 데이터 형식이 올바르지 않습니다.');
  return obj;
}

export function shareUrl(code) {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#/view?d=${code}`;
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fallback */ }
  try { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return true; } catch { return false; }
}

// ---------- 이미지 카드 ----------
function linearize(platformKey, blocks, depth = 0, out = []) {
  for (const b of blocks || []) {
    const def = getBlockDef(platformKey, b.type);
    const col = PLATFORMS[platformKey].colors[def?.cat];
    out.push({ depth, text: blockCaption(platformKey, b).replace(/▼/g, '▾'), fill: col?.fill || '#94a3b8', textColor: col?.text || '#fff' });
    if (b.children?.length) linearize(platformKey, b.children, depth + 1, out);
    if (def?.shape === 'c_else') { out.push({ depth, text: '아니면', fill: col?.fill || '#94a3b8', textColor: col?.text || '#fff' }); linearize(platformKey, b.elseChildren, depth + 1, out); }
  }
  return out;
}

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fitText(ctx, text, maxW) { let t = text; while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -2); return t === text ? t : t + '…'; }
function wrap(ctx, text, maxW, maxLines) {
  const words = String(text || '').split(/\s+/); const lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; if (lines.length === maxLines) break; }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) lines[maxLines - 1] = fitText(ctx, lines[maxLines - 1] + '…', maxW);
  return lines;
}
const FONT = "'Pretendard', -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif";

/** 결과 → PNG Blob (1200×630) */
export async function renderCard(result, levelKey = 'standard') {
  const W = 1200, H = 630, P = 56;
  const hw = HARDWARE_MAP[result.hwId]; const plat = PLATFORMS[result.platformKey]; const L = LEVELS.find((l) => l.key === levelKey) || LEVELS[1];
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  try { await document.fonts?.ready; } catch { /* ignore */ }

  // 배경
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#070b14'); g.addColorStop(1, '#101a33'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.85, H * 0.1, 10, W * 0.85, H * 0.1, 520); glow.addColorStop(0, (hw?.color || '#76b900') + '66'); glow.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  const glow2 = ctx.createRadialGradient(W * 0.1, H * 1.0, 10, W * 0.1, H * 1.0, 480); glow2.addColorStop(0, 'rgba(118,185,0,.35)'); glow2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = glow2; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // 브랜드
  rr(ctx, P, P - 8, 40, 40, 12); const bg = ctx.createLinearGradient(P, P, P + 40, P + 40); bg.addColorStop(0, '#76b900'); bg.addColorStop(1, '#22c55e'); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `900 22px ${FONT}`; ctx.textBaseline = 'middle'; ctx.fillText('🤖', P + 8, P + 13);
  ctx.font = `900 26px ${FONT}`; ctx.fillStyle = '#fff'; ctx.fillText('피지컬 AI', P + 52, P + 12);
  const w1 = ctx.measureText('피지컬 AI ').width; ctx.fillStyle = '#a3e635'; ctx.fillText('코드 커넥트', P + 52 + w1, P + 12);
  ctx.font = `700 15px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.textAlign = 'right'; ctx.fillText(ORG, W - P, P + 12); ctx.textAlign = 'left';

  // 교구 칩
  const chipY = P + 62; ctx.font = `800 18px ${FONT}`;
  const chipText = `${hw?.emoji || ''} ${hw?.name || ''} · ${plat.tool}`; const cw = ctx.measureText(chipText).width + 36;
  rr(ctx, P, chipY, cw, 40, 20); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.fillText(chipText, P + 18, chipY + 21);

  // 제목·요약
  ctx.font = `900 54px ${FONT}`; ctx.fillStyle = '#fff'; ctx.fillText(fitText(ctx, `“${result.title}”`, 640), P, chipY + 92);
  ctx.font = `600 22px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.8)';
  wrap(ctx, result.summary, 620, 2).forEach((ln, i) => ctx.fillText(ln, P, chipY + 140 + i * 32));

  // 3단계 칩
  let lx = P; const ly = chipY + 210;
  for (const lv of LEVELS) {
    const n = countBlocks(result.levels?.[lv.key]?.blocks || []); const on = lv.key === levelKey;
    ctx.font = `800 17px ${FONT}`; const t = `${lv.emoji} ${lv.name} · ${n}블록`; const tw = ctx.measureText(t).width + 30;
    rr(ctx, lx, ly, tw, 38, 19); ctx.fillStyle = on ? lv.color : 'rgba(255,255,255,.1)'; ctx.fill();
    ctx.fillStyle = on ? '#fff' : 'rgba(255,255,255,.75)'; ctx.fillText(t, lx + 15, ly + 20); lx += tw + 10;
  }
  // 목표 문장
  ctx.font = `600 18px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.7)';
  wrap(ctx, `${L.name} 단계 목표 · ${result.levels?.[levelKey]?.goal || ''}`, 640, 2).forEach((ln, i) => ctx.fillText(ln, P, ly + 68 + i * 26));

  // 블록 미리보기 패널 (오른쪽)
  const px = 740, py = chipY + 62, pw = W - P - px, ph = H - py - P - 40;
  rr(ctx, px, py, pw, ph, 24); ctx.fillStyle = 'rgba(255,255,255,.96)'; ctx.fill();
  const lines = linearize(result.platformKey, result.levels?.[levelKey]?.blocks || []);
  const maxLines = Math.floor((ph - 36) / 34); let y = py + 18;
  ctx.font = `700 15px ${FONT}`;
  for (const ln of lines.slice(0, maxLines)) {
    const x = px + 16 + ln.depth * 22; const maxW = pw - 32 - ln.depth * 22;
    const text = fitText(ctx, ln.text, maxW - 24); const bw = Math.min(maxW, ctx.measureText(text).width + 24);
    rr(ctx, x, y, bw, 28, 8); ctx.fillStyle = ln.fill; ctx.fill();
    ctx.fillStyle = ln.textColor || '#fff'; ctx.fillText(text, x + 12, y + 14); y += 34;
  }
  if (lines.length > maxLines) { ctx.fillStyle = '#64748b'; ctx.font = `700 14px ${FONT}`; ctx.fillText(`… 외 ${lines.length - maxLines}개 블록`, px + 16, y + 10); }

  // 푸터
  ctx.font = `800 17px ${FONT}`; ctx.fillStyle = '#a3e635'; ctx.fillText(`▶ ${SITE}`, P, H - P + 6);
  ctx.font = `600 15px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.textAlign = 'right'; ctx.fillText('학생 말 한 줄 → 진짜 교구 블록 3단계 · 무료 · 가입 없음', W - P, H - P + 6); ctx.textAlign = 'left';

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

export function downloadBlob(blob, filename) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
export async function copyBlob(blob) {
  try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); return true; } catch { return false; }
}
