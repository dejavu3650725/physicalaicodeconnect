import React, { useEffect, useState } from 'react';
import { Cpu, Sparkles, AlertTriangle, Share2 } from 'lucide-react';
import { decodeShare } from '../lib/share.js';
import { normalizeTree } from '../blocks/engine.js';
import { checkLevels } from '../lib/levelRules.js';
import { HARDWARE_MAP } from '../data/hardware.js';
import { href } from '../lib/router.js';
import ResultView from '../components/ResultView.jsx';

/** 공유 링크로 열린 설계 — 서버 없이 URL 안의 데이터를 복원해 보여준다 */
export default function View({ route }) {
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await decodeShare(route.query.d);
        const levels = {};
        for (const k of Object.keys(d.levels)) { const issues = []; levels[k] = { ...d.levels[k], blocks: normalizeTree(d.platformKey, d.levels[k].blocks || [], issues), issues }; }
        const check = checkLevels(d.platformKey, levels);
        if (alive) setState({ loading: false, result: { ...d, levels, check, shared: true } });
      } catch (e) { if (alive) setState({ loading: false, error: e.message || String(e) }); }
    })();
    return () => { alive = false; };
  }, [route.query.d]);

  if (state.loading) return <div className="card p-10 text-center text-slate-500 font-bold">공유된 설계를 여는 중…</div>;
  if (state.error) return (
    <div className="card p-10 text-center space-y-4">
      <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
      <p className="font-bold text-slate-700">공유 링크를 열 수 없습니다.</p>
      <p className="text-sm text-slate-500">{state.error} — 링크가 잘렸거나 오래된 형식일 수 있어요. 보낸 분께 다시 요청해 주세요.</p>
      <a href={href('/connect')} className="btn btn-primary"><Cpu className="w-5 h-5" /> 직접 설계해 보기</a>
    </div>
  );
  const r = state.result; const hw = HARDWARE_MAP[r.hwId] || HARDWARE_MAP.hamster;
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#0b1220] text-white p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between relative overflow-hidden">
        <div className="aurora w-72 h-72 -right-20 -top-24" style={{ background: hw.color, opacity: .35 }} />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-lime-300 uppercase"><Share2 className="w-3.5 h-3.5" /> 공유된 설계</div>
          <p className="mt-1 font-extrabold text-lg leading-snug">다른 선생님이 <span className="text-lime-300">피지컬 AI 코드 커넥트</span>로 만든 설계입니다.</p>
          <p className="text-sm text-slate-300 mt-1">아이디어: “{r.idea}” · {hw.emoji} {hw.name} · 가입 없이 아래 결과를 그대로 보고, 인쇄해 쓸 수 있어요.</p>
        </div>
        <div className="relative flex flex-wrap gap-2 shrink-0">
          <a href={href('/connect', { hw: r.hwId, idea: r.idea })} className="btn btn-primary !py-3"><Sparkles className="w-5 h-5" /> 이 아이디어로 나도 설계</a>
          <a href={href('/connect')} className="btn btn-glass !py-3"><Cpu className="w-5 h-5" /> 새 아이디어로 시작</a>
        </div>
      </div>
      <ResultView hardware={hw} platformKey={r.platformKey} result={r} readOnly />
    </div>
  );
}
