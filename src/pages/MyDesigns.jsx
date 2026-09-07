import React, { useEffect, useState } from 'react';
import { FolderOpen, LogIn, Trash2, Globe2, Lock, Link2, ExternalLink, Cpu, Check } from 'lucide-react';
import { isFirebaseEnabled, useAuth, signIn, listMyDesigns, deleteDesign, setDesignPublic, shortShareUrl } from '../lib/firebase.js';
import { copyText } from '../lib/share.js';
import { HARDWARE_MAP, LEVELS } from '../data/hardware.js';
import { href } from '../lib/router.js';

/** 내 설계 — 로그인한 사용자가 저장한 설계 목록 */
export default function MyDesigns() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState(null);
  const [copied, setCopied] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => { try { setItems(await listMyDesigns()); } catch (e) { setErr(e.message || String(e)); } };
  useEffect(() => { if (user) load(); else setItems(null); }, [user?.uid]);

  if (!isFirebaseEnabled()) return <div className="card p-10 text-center text-slate-500 font-bold">저장 기능이 아직 설정되지 않았습니다.</div>;
  if (loading) return <div className="card p-10 text-center text-slate-500 font-bold">확인 중…</div>;
  if (!user) return (
    <div className="card p-10 text-center space-y-4 max-w-xl mx-auto">
      <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
      <h2 className="text-2xl font-black">내 설계</h2>
      <p className="text-slate-500">구글 계정으로 로그인하면 저장한 설계를 어느 PC에서든 다시 열고, 짧은 링크로 공유할 수 있어요.</p>
      <button onClick={() => signIn().catch(() => {})} className="btn btn-dark"><LogIn className="w-5 h-5" /> 구글로 로그인</button>
      <p className="text-xs text-slate-400">로그인 없이도 설계·공유는 그대로 사용할 수 있습니다.</p>
    </div>
  );

  const copy = async (id) => { if (await copyText(shortShareUrl(id))) { setCopied(id); setTimeout(() => setCopied(null), 1800); } };
  const toggle = async (it) => { await setDesignPublic(it.id, !it.public); load(); };
  const remove = async (it) => { if (window.confirm(`“${it.title}” 설계를 삭제할까요? 공유 링크도 더 이상 열리지 않습니다.`)) { await deleteDesign(it.id); load(); } };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><span className="eyebrow">My Designs</span><h2 className="text-3xl md:text-4xl font-black tracking-tight mt-1">내 설계</h2><p className="text-slate-500 mt-1">{user.displayName || user.email} · {items ? `${items.length}개` : '불러오는 중…'}</p></div>
        <a href={href('/connect')} className="btn btn-primary"><Cpu className="w-5 h-5" /> 새 설계 만들기</a>
      </div>
      {err && <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">{err}</div>}
      {items && items.length === 0 && <div className="card p-10 text-center text-slate-500">아직 저장한 설계가 없어요. 설계 결과의 공유 카드에서 <b>내 설계에 저장</b>을 누르면 여기에 모입니다.</div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(items || []).map((it) => {
          const hw = HARDWARE_MAP[it.hwId] || HARDWARE_MAP.hamster; const when = it.createdAt?.toDate ? it.createdAt.toDate() : null;
          return (
            <div key={it.id} className="card overflow-hidden flex flex-col">
              <div className="h-2" style={{ background: hw.gradient }} />
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="text-lg">{hw.emoji}</span>{hw.name}<span className="ml-auto">{when ? when.toLocaleDateString('ko-KR') : ''}</span></div>
                <h3 className="font-black text-lg mt-2 leading-tight">“{it.title}”</h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{it.summary || it.idea}</p>
                <div className="flex gap-1.5 mt-3">{LEVELS.map((L) => <span key={L.key} className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: L.soft, color: L.color }}>{L.emoji} {it.blockCount?.[L.key] ?? '-'}</span>)}</div>
              </div>
              <div className="px-5 pb-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <a href={href('/d/' + it.id)} className="chip hover:bg-slate-200"><ExternalLink className="w-3.5 h-3.5" /> 열기</a>
                <button onClick={() => copy(it.id)} className="chip hover:bg-slate-200">{copied === it.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />} {copied === it.id ? '복사됨' : '링크'}</button>
                <button onClick={() => toggle(it)} className="chip hover:bg-slate-200" title={it.public ? '링크를 가진 사람은 누구나 볼 수 있음' : '나만 볼 수 있음'}>{it.public ? <Globe2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} {it.public ? '공개' : '비공개'}</button>
                <button onClick={() => remove(it)} className="chip hover:bg-rose-50 hover:text-rose-600 ml-auto"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
