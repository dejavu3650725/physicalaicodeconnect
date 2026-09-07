import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, RotateCcw, Trophy, Wrench, Clock, Plug, Cpu } from 'lucide-react';
import { TUTORIALS } from '../data/tutorials.js';
import { HARDWARE } from '../data/hardware.js';
import Visual from '../components/Visuals.jsx';
import { href } from '../lib/router.js';

const KEY = (id) => `pacc.tut.${id}`;
function load(id) { try { return JSON.parse(localStorage.getItem(KEY(id)) || '{}'); } catch { return {}; } }
function save(id, v) { try { localStorage.setItem(KEY(id), JSON.stringify(v)); } catch { /* ignore */ } }

function Rich({ text }) { return <>{String(text).split('**').map((t, i) => (i % 2 === 1 ? <b key={i} className="text-slate-900">{t}</b> : t))}</>; }

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 0.8, color: ['#76b900', '#22c55e', '#f59e0b', '#0ea5e9', '#e11d48', '#8b5cf6'][i % 6], dur: 2 + Math.random() * 1.5 })), []);
  return <div className="confetti">{pieces.map((p, i) => <i key={i} style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />)}</div>;
}

export default function Tutorial({ route }) {
  const id = route.segs[1];
  if (!id || !TUTORIALS[id]) return <Picker />;
  return <Runner key={id} tut={TUTORIALS[id]} />;
}

function Picker() {
  return (
    <div className="space-y-8">
      <div><span className="chip bg-lime-50 border-lime-200 text-lime-800"><Plug className="w-3.5 h-3.5" /> 인터랙티브 연결 튜토리얼</span><h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">게임 튜토리얼처럼, 5분 만에 교구 연결</h1><p className="text-slate-500 mt-2 max-w-2xl">각 단계마다 체크포인트(퀴즈·체크리스트)를 통과하며 진행합니다. "잘 안 되나요?"를 열면 현장에서 자주 생기는 문제의 해결법이 나옵니다. 진행 상황은 이 브라우저에 저장돼요.</p></div>
      <div className="grid sm:grid-cols-2 gap-5">
        {HARDWARE.map((h) => { const t = TUTORIALS[h.tutorial]; const st = load(t.id); const done = Object.values(st.done || {}).filter(Boolean).length; return (
          <a key={h.id} href={href('/tutorial/' + t.id)} className="card p-6 flex gap-5 hover:-translate-y-0.5 transition-transform relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full opacity-20" style={{ background: h.gradient }} />
            <div className="text-5xl">{h.emoji}</div>
            <div className="flex-1 min-w-0"><h3 className="font-black text-lg leading-snug">{t.title}</h3><p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{t.intro}</p>
              <div className="mt-3 flex items-center gap-3 text-xs font-bold text-slate-500"><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 약 {t.minutes}분</span><span>{t.steps.length}단계</span><span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-amber-500" /> {t.badge}</span></div>
              <div className="progress-bar mt-3"><div style={{ width: `${(done / t.steps.length) * 100}%` }} /></div>
            </div>
          </a>
        ); })}
      </div>
    </div>
  );
}

function Runner({ tut }) {
  const hw = HARDWARE.find((h) => h.tutorial === tut.id);
  const [state, setState] = useState(() => load(tut.id));
  const [idx, setIdx] = useState(() => { const s = load(tut.id); const firstUndone = tut.steps.findIndex((_, i) => !s.done?.[i]); return firstUndone < 0 ? 0 : firstUndone; });
  const [answer, setAnswer] = useState(null);
  const [checks, setChecks] = useState({});
  const [showTrouble, setShowTrouble] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const step = tut.steps[idx];
  const doneCount = Object.values(state.done || {}).filter(Boolean).length;
  const allDone = doneCount === tut.steps.length;

  useEffect(() => { setAnswer(null); setChecks({}); setShowTrouble(false); }, [idx]);
  useEffect(() => { save(tut.id, state); }, [state, tut.id]);

  const passed = (() => {
    if (state.done?.[idx]) return true;
    const c = step.check;
    if (!c) return true;
    if (c.type === 'quiz') return answer === c.answer;
    if (c.type === 'checklist') return c.items.every((_, i) => checks[i]);
    if (c.type === 'confirm') return !!checks.confirm;
    return true;
  })();

  const complete = () => {
    const next = { ...state, done: { ...(state.done || {}), [idx]: true } };
    setState(next);
    if (idx < tut.steps.length - 1) setIdx(idx + 1);
    else { setCelebrate(true); setTimeout(() => setCelebrate(false), 3500); }
  };
  const reset = () => { setState({}); setIdx(0); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {celebrate && <Confetti />}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <a href={href('/tutorial')} className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> 튜토리얼 목록</a>
        <button onClick={reset} className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> 처음부터</button>
      </div>
      <div className="card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-15 blur-2xl" style={{ background: hw?.gradient }} />
        <div className="relative flex items-start gap-4">
          <div className="text-5xl">{tut.emoji}</div>
          <div className="flex-1"><h1 className="text-2xl md:text-3xl font-black tracking-tight">{tut.title}</h1><p className="text-slate-600 mt-1.5 leading-relaxed">{tut.intro}</p>
            <div className="mt-4 flex items-center gap-3"><div className="progress-bar flex-1"><div style={{ width: `${(doneCount / tut.steps.length) * 100}%` }} /></div><span className="text-sm font-black text-slate-700 shrink-0">{doneCount}/{tut.steps.length}</span></div>
          </div>
        </div>
        {/* 단계 네비 */}
        <div className="relative mt-6 flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {tut.steps.map((s, i) => { const d = state.done?.[i]; return (
            <button key={i} onClick={() => setIdx(i)} className={`shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold border transition ${i === idx ? 'bg-slate-900 text-white border-slate-900' : d ? 'bg-lime-50 text-lime-800 border-lime-200' : 'bg-white text-slate-500 border-slate-200'}`}>
              <span className={`w-5 h-5 rounded-full grid place-items-center text-[10px] font-black ${d ? 'bg-lime-500 text-white' : i === idx ? 'bg-white text-slate-900' : 'bg-slate-100'}`}>{d ? '✓' : i + 1}</span>{s.title}
            </button>
          ); })}
        </div>
      </div>

      {allDone && idx === tut.steps.length - 1 && state.done?.[idx] ? (
        <div className="card p-10 text-center pop border-lime-300 bg-gradient-to-br from-lime-50 to-white">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-3xl font-black mt-3">🏅 "{tut.badge}" 배지 획득!</h2>
          <p className="text-slate-600 mt-2">모든 연결 단계를 통과했어요. 이제 진짜 수업 설계로 넘어가 볼까요?</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap"><a href={href('/connect', { hw: hw?.id })} className="btn btn-primary"><Cpu className="w-5 h-5" /> {hw?.short} 코드 커넥트로 가기</a><a href={href('/tutorial')} className="btn btn-ghost">다른 교구 튜토리얼</a></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6 fade-up" key={idx}>
          <div className="lg:col-span-3 card p-6 md:p-7 space-y-5">
            <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-black">{idx + 1}</span><h2 className="text-xl md:text-2xl font-black">{step.title}</h2></div>
            <Visual id={step.visual} />
            <ul className="space-y-2.5">{step.body.map((b, i) => <li key={i} className="text-[15px] leading-relaxed text-slate-700 flex gap-2"><span className="text-lime-600 font-black shrink-0">▸</span><span><Rich text={b} /></span></li>)}</ul>
            {step.trouble?.length ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70">
                <button onClick={() => setShowTrouble(!showTrouble)} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-extrabold text-amber-800"><Wrench className="w-4 h-4" /> 잘 안 되나요? 현장 해결법 {showTrouble ? '▲' : '▼'}</button>
                {showTrouble && <div className="px-4 pb-4 space-y-2">{step.trouble.map((t, i) => <div key={i} className="bg-white rounded-xl p-3 text-sm border border-amber-100"><b className="text-amber-900">😵 {t.symptom}</b><p className="text-slate-700 mt-1">👉 {t.fix}</p></div>)}</div>}
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6 border-2" style={{ borderColor: passed ? '#a3e635' : '#e2e8f0' }}>
              <h3 className="font-extrabold flex items-center gap-2 text-slate-800"><HelpCircle className="w-5 h-5 text-sky-500" /> 체크포인트</h3>
              {step.check?.type === 'quiz' && (
                <div className="mt-3 space-y-2">
                  <p className="font-bold text-slate-800">{step.check.q}</p>
                  {step.check.options.map((o, i) => { const chosen = answer === i; const correct = i === step.check.answer; return (
                    <button key={i} onClick={() => setAnswer(i)} className={`w-full text-left rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${chosen ? (correct ? 'bg-lime-50 border-lime-400 text-lime-900' : 'bg-rose-50 border-rose-300 text-rose-800') : 'bg-white border-slate-200 hover:border-slate-300'}`}>{String.fromCharCode(9312 + i)} {o}</button>
                  ); })}
                  {answer != null && <p className={`text-sm font-semibold rounded-xl p-3 ${answer === step.check.answer ? 'bg-lime-100 text-lime-900' : 'bg-rose-100 text-rose-900'}`}>{answer === step.check.answer ? '정답! ' : '다시 생각해 볼까요? '} {step.check.why}</p>}
                </div>
              )}
              {step.check?.type === 'checklist' && (
                <div className="mt-3 space-y-2">{step.check.items.map((it, i) => <label key={i} className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-semibold cursor-pointer transition ${checks[i] ? 'bg-lime-50 border-lime-300' : 'bg-white border-slate-200'}`}><input type="checkbox" className="w-4 h-4 accent-lime-600" checked={!!checks[i]} onChange={(e) => setChecks({ ...checks, [i]: e.target.checked })} />{it}</label>)}</div>
              )}
              {step.check?.type === 'confirm' && (
                <label className={`mt-3 flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-bold cursor-pointer ${checks.confirm ? 'bg-lime-50 border-lime-300' : 'bg-white border-slate-200'}`}><input type="checkbox" className="w-4 h-4 accent-lime-600" checked={!!checks.confirm} onChange={(e) => setChecks({ confirm: e.target.checked })} />{step.check.label}</label>
              )}
              {state.done?.[idx] && <p className="mt-3 text-xs font-bold text-lime-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 이미 통과한 단계예요</p>}
              <button onClick={complete} disabled={!passed} className="btn btn-primary w-full mt-4">{idx === tut.steps.length - 1 ? '튜토리얼 완료!' : '다음 단계'} <ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="card-flat p-4 text-xs text-slate-500 leading-relaxed">💡 교사 팀 티칭 팁: 모둠에서 이 화면을 함께 보며 "체크포인트 통과 → 다음 단계"를 학생이 직접 누르게 하면, 연결 과정 자체가 하나의 학습 활동이 됩니다.</div>
          </div>
        </div>
      )}
      {tut.tips && (
        <section className="card p-6 md:p-7 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <h3 className="text-lg font-black">{tut.tips.title}</h3>
          <ul className="mt-3 grid md:grid-cols-2 gap-x-6 gap-y-2">{tut.tips.items.map((t, i) => <li key={i} className="text-sm leading-relaxed text-slate-700 flex gap-2"><span className="text-amber-500 font-black shrink-0">✓</span><span><Rich text={t} /></span></li>)}</ul>
        </section>
      )}
    </div>
  );
}
