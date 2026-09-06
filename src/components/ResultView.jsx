import React, { useMemo, useState } from 'react';
import { Layers, Code2, ListOrdered, Settings2, Sparkles, Lightbulb, Send, CheckCircle2, AlertTriangle, Wand2, BookOpen, Globe2, ArrowRightLeft, Printer, RefreshCw, ShieldCheck } from 'lucide-react';
import BlockCanvas from './BlockCanvas.jsx';
import CodePanel from './CodePanel.jsx';
import { blockCaption, countBlocks, getBlockDef, PLATFORMS } from '../blocks/engine.js';
import { LEVELS } from '../data/hardware.js';
import { STAGES, hintsFor, warmupFor, ALGORITHM_PATTERN, ROLES } from '../lib/knowledge.js';
import { Route, ShieldAlert, ClipboardCheck, Puzzle, Users, Clock } from 'lucide-react';

function Rich({ text }) {
  if (!text) return null;
  return <>{String(text).split('**').map((t, i) => (i % 2 === 1 ? <strong key={i} className="bg-lime-100 text-lime-900 px-1 rounded">{t}</strong> : t))}</>;
}

function linearize(platformKey, blocks, depth = 0, out = []) {
  for (const b of blocks || []) {
    const def = getBlockDef(platformKey, b.type);
    out.push({ depth, text: blockCaption(platformKey, b).replace(/▼/g, ' ▾'), cat: PLATFORMS[platformKey].colors[def?.cat]?.label, color: PLATFORMS[platformKey].colors[def?.cat]?.fill });
    if (b.children?.length) linearize(platformKey, b.children, depth + 1, out);
    if (def?.shape === 'c_else') { out.push({ depth, text: '아니면', color: PLATFORMS[platformKey].colors[def?.cat]?.fill, cat: '' }); linearize(platformKey, b.elseChildren, depth + 1, out); }
  }
  return out;
}

export default function ResultView({ hardware, platformKey, result, onFeedback, onApplyFeedback, onSwapVariant, variantOptions, busyFeedback, onRegenerateLevel, busyLevel }) {
  const [level, setLevel] = useState('standard');
  const [view, setView] = useState('block');
  const [userIdea, setUserIdea] = useState('');
  const [fb, setFb] = useState(null);
  const [fbView, setFbView] = useState('block');
  const lv = result.levels[level] || result.levels.basic;
  const steps = useMemo(() => linearize(platformKey, lv.blocks), [platformKey, lv.blocks]);
  const unknown = (lv.issues || []).filter((i) => i.kind === 'unknown_block' || i.kind === 'unknown_value');
  const check = result.check?.[level];
  const L = LEVELS.find((l) => l.key === level);

  const askFeedback = async () => {
    if (!userIdea.trim() || !onFeedback) return;
    setFb(null);
    const r = await onFeedback({ levelKey: level, currentBlocks: lv.blocks, userIdea });
    if (r) setFb(r);
  };

  return (
    <section className="space-y-6 fade-up">
      {/* 헤더 */}
      <div className="card p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full blur-3xl opacity-25" style={{ background: hardware.gradient }} />
        <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="chip" style={{ background: hardware.color + '22', borderColor: hardware.color + '55', color: '#0f172a' }}>{hardware.emoji} {hardware.name}</span>
              <span className="chip">{PLATFORMS[platformKey].tool}</span>
              {variantOptions?.length > 1 && (
                <button onClick={onSwapVariant} className="chip hover:bg-slate-200 transition" title="햄스터 ↔ 햄스터S 블록으로 다시 설계"><ArrowRightLeft className="w-3.5 h-3.5" /> {variantOptions.find((v) => v.key === platformKey)?.label} 전환</button>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">“{result.title}”</h2>
            <p className="text-slate-600 mt-2 font-medium leading-relaxed">{result.summary}</p>
          </div>
        </div>
        {/* 수준별 단계 선택 — 수준별 수업의 핵심 */}
        <div className="relative mt-6">
          <div className="flex items-center gap-2 mb-2"><span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">수준별 단계 선택</span><span className="text-[11px] font-bold text-slate-400">· 학생 수준에 맞는 단계를 고르면 블록·코드·수업 흐름이 함께 바뀝니다</span></div>
          <div className="grid grid-cols-3 gap-2 md:gap-3" role="tablist">
            {LEVELS.map((L, i) => {
              const on = level === L.key; const n = countBlocks(result.levels[L.key]?.blocks || []);
              return (
                <button key={L.key} role="tab" aria-selected={on} onClick={() => setLevel(L.key)}
                  className={`level-tab text-left ${on ? 'on' : ''}`}
                  style={on
                    ? { borderColor: L.color, background: `linear-gradient(135deg, ${L.color}, ${L.color}cc)`, boxShadow: `0 18px 34px -16px ${L.color}`, color: '#fff' }
                    : { borderColor: L.color + '55', background: `linear-gradient(135deg, ${L.soft}, #fff 75%)` }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-black" style={{ color: on ? 'rgba(255,255,255,.9)' : L.color }}><span className="w-5 h-5 rounded-full grid place-items-center text-[10px] font-black" style={{ background: on ? '#fff' : L.color, color: on ? L.color : '#fff' }}>{i + 1}</span>STEP {i + 1}</span>
                    <span className="text-[11px] font-bold hidden sm:inline-flex items-center gap-1" style={{ color: on ? 'rgba(255,255,255,.85)' : '#64748b' }}>{result.check && (result.check[L.key]?.ok ? <ShieldCheck className="w-3.5 h-3.5" title="단계 규칙 통과" /> : <AlertTriangle className="w-3.5 h-3.5" title="단계 규칙 미충족" />)}{n} 블록</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-lg md:text-xl font-black" style={{ color: on ? '#fff' : '#0f172a' }}><span>{L.emoji}</span>{L.name}<span className="text-xs md:text-sm font-bold" style={{ color: on ? 'rgba(255,255,255,.85)' : L.color }}>· {L.sub}</span></div>
                  <p className="text-[12px] mt-1 leading-snug hidden md:block" style={{ color: on ? 'rgba(255,255,255,.85)' : '#64748b' }}>{L.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
        {result.edgeCase && (
          <div className="relative mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <Wand2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div><b className="text-amber-800">하드웨어 한계 돌파!</b> <span className="text-amber-900">"{result.edgeCase.wish}" → {result.edgeCase.workaround}</span></div>
          </div>
        )}
        <div className="relative mt-3 rounded-xl px-4 py-2.5 text-sm" style={{ background: L?.soft }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold" style={{ color: L?.color }}>{L?.full} 목표</span>
            <span className="text-slate-700">{lv.goal}</span>
            <span className="ml-auto flex items-center gap-2">
              {check && (check.ok
                ? <span className="chip bg-white text-emerald-700 border-emerald-200"><ShieldCheck className="w-3.5 h-3.5" /> 단계 규칙 통과</span>
                : <span className="chip bg-white text-amber-700 border-amber-200"><AlertTriangle className="w-3.5 h-3.5" /> 규칙 미충족 {check.hard.length}</span>)}
              <span className="chip bg-white">{countBlocks(lv.blocks)} 블록</span>
              {onRegenerateLevel && !result.sample && (
                <button onClick={() => onRegenerateLevel(level)} disabled={!!busyLevel} className="chip bg-white hover:bg-slate-100 disabled:opacity-60 no-print" title="이 단계만 다른 구성으로 다시 설계">
                  <RefreshCw className={`w-3.5 h-3.5 ${busyLevel === level ? 'animate-spin' : ''}`} /> {busyLevel === level ? '다시 설계 중…' : '이 단계 다시 설계'}
                </button>
              )}
            </span>
          </div>
          {check && (check.hard.length > 0 || check.soft.length > 0) && (
            <ul className="mt-2 space-y-0.5 text-[12px] text-slate-600 no-print">
              {check.hard.map((t, i) => <li key={'h' + i} className="flex gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /><span>{t}</span></li>)}
              {check.soft.map((t, i) => <li key={'s' + i} className="flex gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /><span>{t}</span></li>)}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 블록/코드 */}
        <div className="lg:col-span-3 card p-5 md:p-6 flex flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4 flex-wrap">
            <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-500" /> {PLATFORMS[platformKey].tool} 블록 조립도</h3>
            <div className="seg">
              <button className={view === 'block' ? 'on' : ''} onClick={() => setView('block')}>🧱 블록</button>
              <button className={view === 'steps' ? 'on' : ''} onClick={() => setView('steps')}><ListOrdered className="w-4 h-4 inline -mt-0.5" /> 조립 순서</button>
              <button className={view === 'code' ? 'on' : ''} onClick={() => setView('code')}><Code2 className="w-4 h-4 inline -mt-0.5" /> 텍스트 코드</button>
            </div>
          </div>
          {unknown.length > 0 && (
            <div className="mb-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> 실제 {PLATFORMS[platformKey].tool}에 없는 블록 {unknown.length}개를 자동으로 제외했습니다: {[...new Set(unknown.map((u) => u.type))].join(', ')}</div>
          )}
          {view === 'block' && <BlockCanvas key={level} platformKey={platformKey} blocks={lv.blocks} />}
          {view === 'steps' && (
            <ol className="space-y-1.5">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ paddingLeft: s.depth * 22 }}>
                  <span className="w-6 h-6 rounded-full text-white text-[11px] font-black grid place-items-center shrink-0" style={{ background: s.color }}>{i + 1}</span>
                  <span className="font-semibold text-slate-800 leading-6">{s.text}</span>
                  {s.cat ? <span className="ml-auto text-[10px] font-bold text-slate-400 shrink-0 mt-1">{s.cat}</span> : null}
                </li>
              ))}
            </ol>
          )}
          {view === 'code' && <CodePanel key={level} platformKey={platformKey} blocks={lv.blocks} />}
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-2 no-print"><Printer className="w-4 h-4" /> 블록 조립도는 브라우저 인쇄(Ctrl+P)로 학생 활동지처럼 출력할 수 있어요.</div>
        </div>

        {/* 우측: 해설·변수 */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 md:p-6 bg-gradient-to-br from-[#f3fbe6] to-white border-lime-200">
            <h3 className="font-extrabold text-lime-900 flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-lime-600" /> 선생님의 사고력 쏙쏙 해설</h3>
            <p key={level} className="text-[15px] leading-relaxed text-lime-950 fade-up"><Rich text={lv.explanation} /></p>
            {lv.ctConcepts?.length ? <div className="mt-3 flex flex-wrap gap-1.5">{lv.ctConcepts.map((c, i) => <span key={i} className="chip bg-white border-lime-300 text-lime-800">CT · {c}</span>)}</div> : null}
            {lv.tryThis ? <div className="mt-4 flex gap-2 items-start text-sm bg-white/80 rounded-xl p-3 border border-lime-200"><Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /><span><b>도전!</b> {lv.tryThis}</span></div> : null}
          </div>
          {result.variables?.length ? (
            <div className="card p-5 md:p-6">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2 mb-3"><Settings2 className="w-5 h-5 text-sky-500" /> 내 맘대로 변수 조작하기</h3>
              <div className="space-y-3">
                {result.variables.map((v, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex justify-between items-center mb-1"><span className="font-extrabold text-slate-800">{v.name}</span><span className="chip bg-sky-100 border-sky-200 text-sky-800">기본값 {String(v.value)}</span></div>
                    <p className="text-sm text-slate-600">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {result.realWorld ? <div className="card-flat p-4 text-sm text-slate-700 flex gap-2"><Globe2 className="w-5 h-5 text-emerald-500 shrink-0" /><span><b>실생활 연결</b> · {result.realWorld}</span></div> : null}
        </div>
      </div>

      {/* 수업 흐름 — 교육청 피지컬 AI 설계 원리 기반 */}
      <LessonPlan hardware={hardware} level={level} plan={result.lessonPlan} pending={result.planPending} />

      {/* 피드백 */}
      {onFeedback && (
        <div className="card overflow-hidden">
          <div className="bg-[#0b1220] text-white p-5 md:p-6 flex items-center gap-3 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-400/10 rounded-full blur-2xl" />
            <div className="bg-white/10 p-2.5 rounded-2xl"><Send className="w-6 h-6 text-lime-300" /></div>
            <div><h3 className="text-lg font-extrabold">나만의 번뜩이는 아이디어 더하기 💡</h3><p className="text-slate-300 text-sm">현재 단계({LEVELS.find((l) => l.key === level)?.name}) 코드에 어떤 기능을 더할까요? 선생님 피드백과 함께 블록이 즉시 업데이트돼요.</p></div>
          </div>
          <div className="p-5 md:p-6 bg-slate-50/60 space-y-4">
            <textarea value={userIdea} onChange={(e) => setUserIdea(e.target.value)} className="input h-28 resize-none" placeholder={`예: ${hardware.id === 'microbit' ? '목표 걸음 수에 도달하면 친구에게 라디오로 알려주고 싶어요.' : hardware.id === 'tory' ? '착륙하기 전에 LED를 세 번 깜빡이며 소리도 나게 하고 싶어요.' : '장애물을 발견하면 멈추는 것뿐 아니라 LED를 빨갛게 켜고 경고음도 내고 싶어요.'}`} />
            <div className="flex justify-end"><button onClick={askFeedback} disabled={busyFeedback || !userIdea.trim()} className="btn btn-dark">{busyFeedback ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 쌤이 읽어보는 중…</> : <><Send className="w-4 h-4" /> 선생님에게 피드백 받기</>}</button></div>
            {fb && (
              <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-5 space-y-4 pop">
                <h4 className="font-extrabold text-emerald-800 flex items-center gap-2 text-lg"><CheckCircle2 className="w-6 h-6 text-emerald-600" /> 선생님의 특급 피드백 도착! 💌</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-emerald-100"><span className="chip bg-emerald-100 border-emerald-200 text-emerald-800 mb-2">폭풍 칭찬해요 👍</span><p className="text-slate-700 leading-relaxed text-sm">{fb.strengths}</p></div>
                  <div className="bg-white rounded-2xl p-4 border border-amber-100"><span className="chip bg-amber-100 border-amber-200 text-amber-800 mb-2">이렇게 해볼까요? 💡</span><p className="text-slate-700 leading-relaxed text-sm">{fb.improvements}</p></div>
                </div>
                {fb.edgeCase ? <div className="text-sm bg-amber-50 border border-amber-200 rounded-xl p-3"><b>우회 아이디어</b> · {fb.edgeCase.workaround}</div> : null}
                {fb.changes?.length ? <ul className="text-sm text-emerald-900 list-disc pl-5 space-y-1">{fb.changes.map((c, i) => <li key={i}>{c}</li>)}</ul> : null}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h4 className="font-extrabold text-slate-800 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400" /> 아이디어가 더해진 알고리즘 🚀</h4>
                    <div className="flex gap-2 items-center">
                      <div className="seg"><button className={fbView === 'block' ? 'on' : ''} onClick={() => setFbView('block')}>🧱 블록</button><button className={fbView === 'code' ? 'on' : ''} onClick={() => setFbView('code')}>💻 코드</button></div>
                      {onApplyFeedback && <button className="btn btn-primary !py-2 !px-3 text-xs" onClick={() => { onApplyFeedback(level, fb.blocks); setFb(null); setUserIdea(''); }}>이 버전을 {LEVELS.find((l) => l.key === level)?.name} 단계에 적용</button>}
                    </div>
                  </div>
                  {fbView === 'block' ? <BlockCanvas platformKey={platformKey} blocks={fb.blocks} /> : <CodePanel platformKey={platformKey} blocks={fb.blocks} />}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


function LessonPlan({ hardware, level, plan, pending }) {
  const hints = hintsFor(hardware.id);
  const warm = warmupFor(hardware.id, level);
  const stages = (plan?.stages?.length ? plan.stages : STAGES.map((s) => ({ key: s.key, title: s.name, minutes: s.key === 'making' ? 80 : 40, activities: [s.desc], teacherTip: '' }))).map((st) => ({ ...st, meta: STAGES.find((x) => x.key === st.key) || STAGES[1] }));
  const total = stages.reduce((a, s) => a + (Number(s.minutes) || 0), 0);
  return (
    <section className="card overflow-hidden">
      <div className="p-6 md:p-7 border-b border-slate-100 flex flex-wrap items-start gap-4 justify-between">
        <div>
          <span className="eyebrow">Lesson Flow</span>
          <h3 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2"><Route className="w-6 h-6 text-violet-500" /> 학교자율시간 수업 흐름</h3>
          <p className="text-sm text-slate-500 mt-1">교육청 피지컬 AI 교육자료의 교수학습 설계 구조(4단계 · 센서→AI→판단→출력)를 이 프로젝트에 맞게 구체화했습니다.</p>
          {pending && <p className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-3 py-1"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> 이 프로젝트에 맞는 차시 계획을 작성하고 있어요… (아래는 기본 4단계 틀)</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="chip"><Clock className="w-3.5 h-3.5" /> 총 {total}분 · {Math.round(total / 40)}차시</span>
          <span className="chip"><Users className="w-3.5 h-3.5" /> 3인 1모둠 · {ROLES.length}역할</span>
        </div>
      </div>
      <div className="p-6 md:p-7 grid lg:grid-cols-4 gap-4">
        {stages.map((st, i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 flex flex-col">
            <div className="flex items-center gap-3"><span className="step-num">{i + 1}</span><div><div className="font-black text-slate-800 leading-tight">{st.meta.name}</div><div className="text-[11px] font-bold text-violet-600">{st.meta.en} · {st.minutes}분</div></div></div>
            <h4 className="font-extrabold mt-4 text-slate-900">{st.title}</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700 flex-1">{(st.activities || []).map((a, j) => <li key={j} className="flex gap-2"><span className="text-violet-500 font-black">▸</span><span>{a}</span></li>)}</ul>
            {st.teacherTip ? <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-2.5">💡 {st.teacherTip}</p> : null}
          </div>
        ))}
      </div>
      <div className="px-6 md:px-7 pb-7 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-fuchsia-50 border border-fuchsia-100 p-4 text-sm"><b className="text-fuchsia-800 flex items-center gap-1.5"><Puzzle className="w-4 h-4" /> 언플러그드 도입 · {warm.title}</b><p className="text-slate-700 mt-1.5 leading-relaxed">{warm.summary}</p></div>
        <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4 text-sm"><b className="text-sky-800 flex items-center gap-1.5"><Route className="w-4 h-4" /> 알고리즘 흐름</b><ul className="mt-1.5 space-y-1 text-slate-700">{(plan?.algorithmFlow?.length ? plan.algorithmFlow : ALGORITHM_PATTERN).map((a, i) => <li key={i}>{a}</li>)}</ul></div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm"><b className="text-emerald-800 flex items-center gap-1.5"><ClipboardCheck className="w-4 h-4" /> 평가 관점</b><ul className="mt-1.5 space-y-1 text-slate-700">{(plan?.assessment?.length ? plan.assessment : hints.assessment).slice(0, 5).map((a, i) => <li key={i}>• {a}</li>)}</ul></div>
        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-sm"><b className="text-rose-800 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> 안전 지도</b><ul className="mt-1.5 space-y-1 text-slate-700">{(plan?.safety?.length ? plan.safety : hints.safety.length ? hints.safety : ['교구 충전·전원 상태 확인', '활동 공간 정리 및 안전 거리 확보']).slice(0, 5).map((a, i) => <li key={i}>• {a}</li>)}</ul>{(plan?.extensions?.length ? plan.extensions : hints.extensions).length ? <p className="mt-2 text-xs text-slate-500"><b>확장</b> · {(plan?.extensions?.length ? plan.extensions : hints.extensions).slice(0, 2).join(' / ')}</p> : null}</div>
      </div>
    </section>
  );
}
