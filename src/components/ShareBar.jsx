import React, { useEffect, useState } from 'react';
import { Link2, Check, Copy, Download, Printer, Share2, MessageCircle, Save, FolderOpen, LogIn } from 'lucide-react';
import { encodeShare, shareUrl, copyText, renderCard, downloadBlob, copyBlob } from '../lib/share.js';
import { isFirebaseEnabled, useAuth, signIn, saveDesign, shortShareUrl } from '../lib/firebase.js';
import { href } from '../lib/router.js';

/** 공유 패널 — 카드 미리보기를 바로 보여주고, 링크·이미지·인쇄 버튼을 큼직하게 */
export default function ShareBar({ result, level }) {
  const [state, setState] = useState({});
  const fb = isFirebaseEnabled(); const { user } = useAuth();
  const [savedId, setSavedId] = useState(result.savedId || null);
  useEffect(() => { setSavedId(result.savedId || null); }, [result.title, result.savedId]);
  const getUrl = async () => (savedId ? shortShareUrl(savedId) : shareUrl(await encodeShare(result)));
  const save = async () => {
    setState((s) => ({ ...s, save: 'busy' }));
    try {
      if (!user) await signIn();
      const id = await saveDesign(result); setSavedId(id);
      flash('save', '저장됨! 짧은 링크 사용 가능');
    } catch (e) { flash('save', e?.code === 'auth/popup-closed-by-user' ? '로그인 취소' : '저장 실패'); console.warn(e); }
  };
  const [card, setCard] = useState({ url: '', blob: null });
  const flash = (k, v) => { setState((s) => ({ ...s, [k]: v })); setTimeout(() => setState((s) => ({ ...s, [k]: null })), 2400); };

  // 결과·단계가 바뀔 때마다 카드를 미리 그려 둔다(사용자는 즉시 확인)
  useEffect(() => {
    let alive = true; let url = '';
    renderCard(result, level).then((blob) => { if (!alive || !blob) return; url = URL.createObjectURL(blob); setCard({ url, blob }); }).catch((e) => console.warn('카드 생성 실패', e));
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [result.title, result.platformKey, level, result.levels]);

  const copyLink = async () => {
    setState((s) => ({ ...s, link: 'busy' }));
    try {
      const url = await getUrl();
      const ok = await copyText(url);
      flash('link', ok ? '링크 복사됨!' : '복사 실패');
      if (!ok) window.prompt('아래 링크를 복사하세요', url);
    } catch (e) { flash('link', '실패'); console.warn(e); }
  };
  const getBlob = async () => card.blob || renderCard(result, level);
  const saveCard = async () => { try { downloadBlob(await getBlob(), `코드커넥트_${(result.title || '설계').replace(/[\\/:*?"<>|]/g, '')}.png`); flash('card', '저장됨!'); } catch (e) { flash('card', '실패'); console.warn(e); } };
  const copyCard = async () => { try { const ok = await copyBlob(await getBlob()); flash('cardCopy', ok ? '복사됨! 카톡에 붙여넣기' : '이 브라우저는 미지원 → 저장 이용'); } catch (e) { flash('cardCopy', '실패'); console.warn(e); } };
  const shareNative = async () => {
    try {
      const url = await getUrl();
      const blob = await getBlob(); const file = blob ? new File([blob], 'code-connect.png', { type: 'image/png' }) : null;
      const data = { title: `피지컬 AI 코드 커넥트 — ${result.title}`, text: `“${result.title}” 설계를 확인해 보세요`, url };
      if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ ...data, files: [file] }); else await navigator.share(data);
    } catch (e) { if (e?.name !== 'AbortError') console.warn(e); }
  };
  const canNative = typeof navigator !== 'undefined' && !!navigator.share;

  const Btn = ({ k, icon: I, label, sub, onClick, primary }) => {
    const st = state[k]; const done = st && st !== 'busy';
    return (
      <button onClick={onClick} disabled={st === 'busy'} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5 disabled:opacity-60 w-full"
        style={primary ? { background: 'linear-gradient(135deg,#8ad000,#22c55e)', color: '#06210b', boxShadow: '0 12px 30px -14px rgba(118,185,0,.9)' } : { background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.14)' }}>
        <span className="w-9 h-9 rounded-xl grid place-items-center shrink-0" style={{ background: primary ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.1)' }}>{done ? <Check className="w-5 h-5" /> : <I className="w-5 h-5" />}</span>
        <span className="min-w-0"><span className="block font-black leading-tight">{done ? st : label}</span>{sub && <span className="block text-[11px] font-semibold opacity-75 mt-0.5">{sub}</span>}</span>
      </button>
    );
  };

  return (
    <section className="rounded-[28px] bg-[#0b1220] text-white p-5 md:p-6 relative overflow-hidden no-print">
      <div className="aurora w-80 h-80 -right-24 -top-28" style={{ background: '#76b900', opacity: .3 }} />
      <div className="relative grid lg:grid-cols-[1.25fr_1fr] gap-5 items-center">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-lime-300 uppercase"><Share2 className="w-3.5 h-3.5" /> 공유 카드</div>
          <p className="mt-1 text-lg font-extrabold leading-snug">이 설계, 동학년 단톡방에 바로 보내세요.</p>
          <p className="text-sm text-slate-300 mt-1">카드 이미지 + 링크를 같이 보내면 받은 선생님은 <b className="text-white">가입 없이</b> 같은 결과를 보고, “나도 설계”를 누를 수 있어요.</p>
          <div className="mt-4 rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-2xl bg-black/30 aspect-[1200/630]">
            {card.url ? <img src={card.url} alt="공유 카드 미리보기" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-sm font-bold text-slate-400">카드 만드는 중…</div>}
          </div>
        </div>
        <div className="grid gap-2.5">
          <Btn k="link" icon={Link2} label="링크 복사" sub={savedId ? '짧은 링크 · 받은 사람은 바로 열림' : '설계 전체가 담긴 링크 · 받은 사람은 바로 열림'} onClick={copyLink} primary />
          {fb && !result.sample && !savedId && <Btn k="save" icon={user ? Save : LogIn} label={user ? '내 설계에 저장' : '구글 로그인 후 저장'} sub="저장하면 짧은 링크가 생기고 '내 설계'에서 다시 열 수 있어요" onClick={save} />}
          {fb && savedId && <a href={href('/mine')} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5 w-full" style={{ background: 'rgba(163,230,53,.12)', color: '#fff', border: '1px solid rgba(163,230,53,.35)' }}><span className="w-9 h-9 rounded-xl grid place-items-center shrink-0 bg-lime-400/20"><FolderOpen className="w-5 h-5 text-lime-300" /></span><span><span className="block font-black leading-tight">저장됨 · 내 설계 보기</span><span className="block text-[11px] font-semibold opacity-75 mt-0.5">{shortShareUrl(savedId).replace(/^https?:\/\//, '')}</span></span></a>}
          <Btn k="card" icon={Download} label="카드 이미지 저장" sub="PNG 1200×630 · 카톡·게시판용" onClick={saveCard} />
          <Btn k="cardCopy" icon={Copy} label="카드 이미지 복사" sub="클립보드에 복사 → 카톡 창에 Ctrl+V" onClick={copyCard} />
          {canNative && <Btn k="native" icon={MessageCircle} label="공유하기…" sub="카카오톡 등 앱으로 바로 보내기(모바일)" onClick={shareNative} />}
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition"><Printer className="w-4 h-4" /> 인쇄 · PDF로 저장</button>
        </div>
      </div>
    </section>
  );
}
