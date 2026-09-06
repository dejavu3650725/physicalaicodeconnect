import React, { useState } from 'react';
import { Plug, Radar, Zap, BrainCircuit, Info, Ban, ChevronDown, ChevronUp } from 'lucide-react';
import { href } from '../lib/router.js';

/** 하드웨어 사양 카드 — 센서/출력은 칩, AI 융합 방법은 번호 카드로 구조화 */
export default function SpecCard({ hw, compact = false, collapsible = false }) {
  const [open, setOpen] = useState(!collapsible);
  const Row = ({ icon: I, label, tone, children }) => (
    <div className="flex gap-3">
      <span className="w-8 h-8 rounded-xl grid place-items-center shrink-0 text-white shadow-sm" style={{ background: tone }}><I className="w-4 h-4" /></span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-black tracking-wider text-slate-400 uppercase">{label}</div>
        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  );
  const chips = (arr, cls) => <div className="flex flex-wrap gap-1.5">{arr.map((t) => <span key={t} className={`inline-block rounded-lg px-2 py-1 text-[12px] font-bold leading-tight ${cls}`}>{t}</span>)}</div>;

  return (
    <aside className="rounded-3xl bg-white border border-slate-200 shadow-[0_10px_30px_-20px_rgba(11,18,32,.35)] overflow-hidden">
      <div className="px-5 py-3.5 flex items-center justify-between gap-3" style={{ background: `linear-gradient(90deg, ${hw.color}22, transparent)` }}>
        <div className="flex items-center gap-2 min-w-0"><span className="text-xl">{hw.emoji}</span><div className="min-w-0"><b className="text-slate-900 block leading-tight">{hw.name}</b><span className="text-[11px] font-bold text-slate-500">{hw.tool} · 사양 카드</span></div></div>
        <a href={href('/tutorial/' + hw.tutorial)} className="chip bg-white hover:bg-slate-100 shrink-0"><Plug className="w-3.5 h-3.5" /> 연결 튜토리얼</a>
      </div>
      <div className={`px-5 pb-4 pt-4 space-y-4 ${compact ? 'text-sm' : ''}`}>
        <Row icon={Radar} label="센서 · 입력" tone="#0ea5e9">{chips(hw.sensors, 'bg-sky-50 text-sky-900 border border-sky-100')}</Row>
        <Row icon={Zap} label="출력 · 동작" tone="#f59e0b">{chips(hw.actuators, 'bg-amber-50 text-amber-900 border border-amber-100')}</Row>
        {open && (
          <>
            <Row icon={BrainCircuit} label="AI 융합 방법" tone="#8b5cf6">
              <ol className="space-y-2">
                {(hw.aiMethods || []).map((m, i) => (
                  <li key={m.name} className="flex gap-2.5 rounded-xl bg-violet-50/70 border border-violet-100 p-2.5">
                    <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-[11px] font-black grid place-items-center shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5"><b className="text-slate-900 text-[13px]">{m.name}</b><span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white text-violet-700 border border-violet-200">{m.tag}</span></div>
                      <p className="text-[12px] text-slate-600 leading-snug mt-0.5">{m.how}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Row>
            {hw.limits && <Row icon={Ban} label="없는 기능 · 한계" tone="#64748b"><p className="text-[12px] text-slate-600 leading-snug">{hw.limits}</p></Row>}
            {hw.caution && <div className="text-[12px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2"><Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />{hw.caution}</div>}
          </>
        )}
        {collapsible && (
          <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 hover:bg-violet-50 text-violet-700 text-[12px] font-extrabold py-2 transition">
            <BrainCircuit className="w-3.5 h-3.5" /> {open ? '접기' : `AI 융합 방법 ${(hw.aiMethods || []).length}가지 · 한계 보기`} {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </aside>
  );
}
