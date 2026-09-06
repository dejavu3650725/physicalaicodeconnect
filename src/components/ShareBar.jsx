import React, { useState } from 'react';
import { Link2, Image as ImageIcon, Check, Copy, Download, Printer } from 'lucide-react';
import { encodeShare, shareUrl, copyText, renderCard, downloadBlob, copyBlob } from '../lib/share.js';

/** 결과 공유 도구 — 링크 복사 / 이미지 카드 저장·복사 / 인쇄 */
export default function ShareBar({ result, level }) {
  const [state, setState] = useState({});
  const flash = (k, v) => { setState((s) => ({ ...s, [k]: v })); setTimeout(() => setState((s) => ({ ...s, [k]: null })), 2200); };

  const copyLink = async () => {
    setState((s) => ({ ...s, link: 'busy' }));
    try {
      const code = await encodeShare(result); const url = shareUrl(code);
      const ok = await copyText(url);
      flash('link', ok ? `복사됨 · ${Math.round(url.length / 1000)}KB` : '복사 실패');
      if (!ok) window.prompt('아래 링크를 복사하세요', url);
    } catch (e) { flash('link', '실패'); console.warn(e); }
  };
  const saveCard = async () => {
    setState((s) => ({ ...s, card: 'busy' }));
    try { const blob = await renderCard(result, level); downloadBlob(blob, `코드커넥트_${(result.title || '설계').replace(/[\\/:*?"<>|]/g, '')}.png`); flash('card', '저장됨'); }
    catch (e) { flash('card', '실패'); console.warn(e); }
  };
  const copyCard = async () => {
    setState((s) => ({ ...s, cardCopy: 'busy' }));
    try { const blob = await renderCard(result, level); const ok = await copyBlob(blob); flash('cardCopy', ok ? '복사됨 · 카톡에 붙이기' : '이 브라우저는 복사 미지원'); }
    catch (e) { flash('cardCopy', '실패'); console.warn(e); }
  };
  const Btn = ({ k, icon: I, label, onClick, primary }) => {
    const st = state[k]; const busy = st === 'busy';
    return (
      <button onClick={onClick} disabled={busy} className="chip hover:brightness-110 disabled:opacity-60 !py-1.5 !px-3" style={primary ? { background: '#0b1220', color: '#fff', borderColor: 'transparent' } : { background: '#fff' }}>
        {st && !busy ? <Check className="w-3.5 h-3.5" style={{ color: primary ? '#a3e635' : '#10b981' }} /> : <I className={`w-3.5 h-3.5 ${busy ? 'animate-pulse' : ''}`} />}
        {st && !busy ? st : busy ? '만드는 중…' : label}
      </button>
    );
  };
  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase mr-1">공유</span>
      <Btn k="link" icon={Link2} label="링크 복사" onClick={copyLink} primary />
      <Btn k="card" icon={Download} label="이미지 카드 저장" onClick={saveCard} />
      <Btn k="cardCopy" icon={Copy} label="이미지 복사" onClick={copyCard} />
      <button onClick={() => window.print()} className="chip bg-white hover:bg-slate-100 !py-1.5 !px-3"><Printer className="w-3.5 h-3.5" /> 인쇄 · PDF</button>
      <span className="text-[11px] text-slate-400 hidden md:inline">링크에는 설계 내용이 담겨 있어 받은 사람은 가입 없이 바로 봅니다.</span>
    </div>
  );
}
