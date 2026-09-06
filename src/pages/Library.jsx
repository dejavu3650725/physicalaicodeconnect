import React, { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, Link2, ListChecks, Route, Paperclip, ClipboardCheck, Sparkles, Cpu, AlertTriangle, ExternalLink, Bot } from 'lucide-react';
import { CURRICULUM, CURRICULUM_MAP, BOOK } from '../data/curriculumIndex.js';
import { HARDWARE, HARDWARE_MAP } from '../data/hardware.js';
import { href } from '../lib/router.js';
import { designLessonFromCurriculum, feedbackAndUpdate } from '../lib/ai.js';
import ResultView from '../components/ResultView.jsx';

export default function Library({ route }) {
  const id = route.segs[1];
  if (id && CURRICULUM_MAP[id]) return <Detail chapter={CURRICULUM_MAP[id]} />;
  return <List />;
}

function List() {
  const [hw, setHw] = useState('all');
  const list = CURRICULUM.filter((c) => hw === 'all' || c.hardware === hw);
  return (
    <div className="space-y-8">
      <div>
        <span className="chip bg-violet-50 border-violet-200 text-violet-700"><BookOpen className="w-3.5 h-3.5" /> 교육청 자료실</span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">『{BOOK.title}』</h1>
        <p className="text-slate-500 mt-2 max-w-3xl">{BOOK.publisher} 배포. 9개 챕터(마이크로비트 3 · 햄스터 2 · 레고 스파이크 4)를 설계 의도 → 교육과정 분석 → 차시 흐름 → 알고리즘 → 차시별 활동 → 붙임 자료 → 평가로 구조화(JSON)했습니다. 각 챕터에서 <b>AI 수업 재구성</b>을 실행하면 우리 교구·학급에 맞는 완성 예시 프로그램과 차시 계획을 만들어 줍니다.</p>
      </div>
      <div className="seg flex-wrap">
        <button className={hw === 'all' ? 'on' : ''} onClick={() => setHw('all')}>전체 {CURRICULUM.length}</button>
        {HARDWARE.filter((h) => h.curriculum.length).map((h) => <button key={h.id} className={hw === h.id ? 'on' : ''} onClick={() => setHw(h.id)}>{h.emoji} {h.short} {h.curriculum.length}</button>)}
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((c) => (
          <a key={c.id} href={href('/library/' + c.id)} className="card p-6 flex flex-col hover:-translate-y-0.5 transition-transform relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-15" style={{ background: HARDWARE_MAP[c.hardware]?.gradient }} />
            <div className="flex items-center gap-2 text-xs flex-wrap"><span className="chip" style={{ background: c.hwColor + '22', borderColor: c.hwColor + '55' }}>{c.hwEmoji} {c.hwName}</span><span className="chip bg-violet-50 border-violet-200 text-violet-700">{c.level}</span><span className="chip">{c.software}</span></div>
            <p className="text-xs font-bold text-slate-400 mt-3">{c.chapter} · {c.subtitle}</p>
            <h3 className="font-black text-lg leading-snug mt-1">{c.title}</h3>
            {c.tagline && <p className="text-sm text-slate-500">{c.tagline}</p>}
            <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3">{c.designIntent?.[0]}</p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex gap-3"><span>{c.sessionCount}차시</span><span>센서 {c.sensorsUsed?.length || 0}</span><span>AI {c.aiUsed?.length || 0}</span><span className="ml-auto">PDF p.{c.pages}</span></div>
          </a>
        ))}
      </div>
    </div>
  );
}

const TABS = [['overview', '개요', BookOpen], ['sessions', '차시 흐름', Route], ['algorithm', '알고리즘', ListChecks], ['lessons', '차시별 활동', ClipboardCheck], ['attachments', '붙임·링크', Paperclip], ['assessment', '평가', ClipboardCheck]];

function Detail({ chapter: c }) {
  const hw = HARDWARE_MAP[c.hardware];
  const [tab, setTab] = useState('overview');
  const [busy, setBusy] = useState(false);
  const [busyFb, setBusyFb] = useState(false);
  const [ctx, setCtx] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const platformKey = hw.defaultPlatform;
  const links = useMemo(() => (c.attachments || []).flatMap((a) => (a.links || []).map((l) => ({ ...(typeof l === 'string' ? { url: l } : l), from: a.title }))), [c]);

  const run = async () => {
    setBusy(true); setError(''); setResult(null);
    try { const r = await designLessonFromCurriculum({ hardwareId: hw.id, platformKey, chapter: c, classContext: ctx }); setResult({ ...r, platformKey, idea: c.title }); }
    catch (e) { setError(e.message || String(e)); } finally { setBusy(false); }
  };
  const onFeedback = async ({ levelKey, currentBlocks, userIdea }) => { setBusyFb(true); try { return await feedbackAndUpdate({ hardwareId: hw.id, platformKey, idea: c.title, levelKey, currentBlocks, userIdea }); } catch (e) { setError(e.message); return null; } finally { setBusyFb(false); } };
  const applyFeedback = (levelKey, blocks) => setResult((r) => ({ ...r, levels: { ...r.levels, [levelKey]: { ...r.levels[levelKey], blocks, issues: [] } } }));

  return (
    <div className="space-y-6">
      <a href={href('/library')} className="text-sm font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> 자료실</a>
      <div className="card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-15 blur-2xl" style={{ background: hw.gradient }} />
        <div className="relative">
          <div className="flex items-center gap-2 flex-wrap text-xs"><span className="chip" style={{ background: hw.color + '22', borderColor: hw.color + '55' }}>{hw.emoji} {hw.name}</span><span className="chip bg-violet-50 border-violet-200 text-violet-700">{c.level}</span><span className="chip">{c.chapter}</span><span className="chip">주 도구: {c.software}</span><span className="chip">PDF p.{c.pages}</span></div>
          <p className="text-slate-500 font-bold mt-4">{c.subtitle}</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{c.title} <span className="text-slate-400 font-bold text-xl">{c.tagline}</span></h1>
          <div className="mt-5 grid md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4"><b className="text-slate-700">설계 의도</b><ul className="mt-1 space-y-1 text-slate-600">{c.designIntent?.map((d, i) => <li key={i}>• {d}</li>)}</ul></div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4"><b className="text-slate-700">학습 목표</b><ul className="mt-1 space-y-1 text-slate-600">{c.goals?.map((d, i) => <li key={i}>• {d}</li>)}</ul></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">{c.sensorsUsed?.map((s) => <span key={s} className="chip bg-sky-50 border-sky-200 text-sky-800">센서 · {s}</span>)}{c.aiUsed?.map((s) => <span key={s} className="chip bg-violet-50 border-violet-200 text-violet-800">AI · {s}</span>)}</div>
        </div>
      </div>

      {/* AI 재구성 */}
      <div className="card p-6 md:p-7 border-lime-200 bg-gradient-to-br from-lime-50/60 to-white">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#76b900] to-[#22c55e] text-white grid place-items-center shrink-0"><Sparkles className="w-6 h-6" /></div>
          <div className="flex-1 min-w-[16rem]">
            <h2 className="text-xl font-black">이 자료의 로직으로 우리 학급 수업 재구성 (AI)</h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">자료의 설계 의도·차시 흐름·알고리즘 단계를 근거로, <b>{hw.name}</b> + <b>{hw.tool}</b> 기준 완성 예시 프로그램(기초/기본/심화)과 차시 재구성안을 만듭니다.{c.software !== hw.tool && <> 원 자료는 <b>{c.software}</b> 기반이므로 {hw.tool} 블록으로 옮겨 설계합니다.</>}</p>
            <div className="mt-3 flex flex-col md:flex-row gap-2">
              <input className="input text-sm flex-1" value={ctx} onChange={(e) => setCtx(e.target.value)} placeholder="학급 상황 (예: 5학년 24명 3인 1조, 40분 4차시로 축소, 카메라 없는 교실, 초급 학생 위주)" />
              <button onClick={run} disabled={busy} className="btn btn-primary shrink-0">{busy ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 재구성 중…</> : <><Bot className="w-5 h-5" /> AI 수업 재구성</>}</button>
            </div>
            {error && <p className="mt-2 text-sm text-rose-700 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}</p>}
          </div>
        </div>
      </div>

      {result && !busy && (
        <div className="space-y-6">
          {result.sessionPlan?.length ? (
            <div className="card p-6">
              <h3 className="font-black text-lg flex items-center gap-2"><Route className="w-5 h-5 text-violet-500" /> 재구성 차시 계획</h3>
              <div className="mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-3">{result.sessionPlan.map((s, i) => <div key={i} className="rounded-2xl border border-slate-200 p-4 bg-slate-50"><div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-violet-600 text-white grid place-items-center text-xs font-black">{s.no}</span><b>{s.title}</b></div><ul className="mt-2 text-sm text-slate-700 space-y-1">{(s.activities || []).map((a, j) => <li key={j}>• {a}</li>)}</ul>{s.assessment && <p className="mt-2 text-xs text-violet-700 font-semibold">평가 · {s.assessment}</p>}</div>)}</div>
            </div>
          ) : null}
          <ResultView hardware={hw} platformKey={platformKey} result={result} onFeedback={onFeedback} onApplyFeedback={applyFeedback} busyFeedback={busyFb} />
        </div>
      )}

      {/* 탭 */}
      <div className="card overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-thin border-b border-slate-100 bg-slate-50/50">
          {TABS.map(([k, label, I]) => <button key={k} onClick={() => setTab(k)} className={`px-5 py-3.5 text-sm font-extrabold flex items-center gap-1.5 shrink-0 border-b-2 transition ${tab === k ? 'border-slate-900 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><I className="w-4 h-4" />{label}</button>)}
        </div>
        <div className="p-6 md:p-8 fade-up" key={tab}>
          {tab === 'overview' && <Overview c={c} />}
          {tab === 'sessions' && <Sessions c={c} />}
          {tab === 'algorithm' && <Algorithm c={c} />}
          {tab === 'lessons' && <Lessons c={c} />}
          {tab === 'attachments' && <Attachments c={c} links={links} />}
          {tab === 'assessment' && <Assessment c={c} />}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center no-print">
        <a href={href('/connect', { hw: hw.id, chapter: c.id })} className="btn btn-dark"><Cpu className="w-5 h-5" /> 이 자료를 연계해 학생 아이디어 설계하기</a>
        <a href={href('/tutorial/' + hw.tutorial)} className="btn btn-ghost">{hw.short} 연결 튜토리얼</a>
      </div>
      {c.notes && <p className="text-xs text-slate-400 leading-relaxed">※ 변환 메모: {c.notes}</p>}
    </div>
  );
}

const Sec = ({ title, children }) => <section><h4 className="font-black text-slate-800 mb-2">{title}</h4>{children}</section>;
const UL = ({ items }) => <ul className="space-y-1.5 text-sm text-slate-700">{(items || []).map((d, i) => <li key={i} className="flex gap-2"><span className="text-lime-600 font-black">▸</span><span>{typeof d === 'string' ? d : JSON.stringify(d)}</span></li>)}</ul>;

function Overview({ c }) {
  const cur = c.curriculum || {};
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Sec title="교육과정 분석">
          <div className="text-sm rounded-2xl border border-slate-200 overflow-hidden">
            {[['역량', cur.competencies], ['영역', cur.domain], ['핵심 아이디어', cur.coreIdea]].map(([k, v]) => v && <div key={k} className="grid grid-cols-[7rem_1fr] border-b border-slate-100 last:border-0"><div className="bg-violet-50 text-violet-900 font-bold px-3 py-2">{k}</div><div className="px-3 py-2 text-slate-700">{v}</div></div>)}
            {(cur.standards || []).map((s, i) => <div key={i} className="grid grid-cols-[7rem_1fr] border-b border-slate-100 last:border-0"><div className="bg-violet-50 text-violet-900 font-bold px-3 py-2">{i === 0 ? '성취기준' : ''}</div><div className="px-3 py-2 text-slate-700"><b className="text-violet-700">{s.code}</b> {s.text}</div></div>)}
          </div>
        </Sec>
        <Sec title="학습 주제"><UL items={c.topics} /></Sec>
        {c.prologue?.flow && (
          <Sec title="센서 – AI – 액추에이터 흐름">
            <div className="grid grid-cols-3 gap-2 text-sm">
              {[['센서', c.prologue.flow.sensors, '#0ea5e9'], ['AI', c.prologue.flow.ai, '#8b5cf6'], ['액추에이터', c.prologue.flow.actuators, '#f59e0b']].map(([k, arr, col]) => <div key={k} className="rounded-2xl border p-3" style={{ borderColor: col + '66', background: col + '11' }}><b style={{ color: col }}>{k}</b><ul className="mt-1 text-slate-700 space-y-0.5">{(arr || []).map((x, i) => <li key={i}>• {x}</li>)}</ul></div>)}
            </div>
          </Sec>
        )}
      </div>
      <div className="space-y-6">
        {c.prologue?.educationalValue?.length ? <Sec title="피지컬 AI 교육적 가치"><UL items={c.prologue.educationalValue} /></Sec> : null}
        {c.prologue?.differentiation?.length ? <Sec title="기존 메이커·STEAM 교육과의 차별성"><UL items={c.prologue.differentiation} /></Sec> : null}
        {c.preparation && <Sec title="수업 준비하기">{['classroom', 'grouping', 'materials'].map((k) => c.preparation[k]?.length ? <div key={k} className="mb-2"><span className="text-xs font-black text-slate-400">{{ classroom: '교실 구성', grouping: '모둠 구성', materials: '준비물' }[k]}</span><UL items={c.preparation[k]} /></div> : null)}</Sec>}
        {c.concepts && <Sec title="핵심 개념 정리">{c.concepts.basics?.length ? <><span className="text-xs font-black text-slate-400">기초 활동</span><UL items={c.concepts.basics} /></> : null}{c.concepts.principle?.length ? <><span className="text-xs font-black text-slate-400 mt-2 block">작동 원리</span><UL items={c.concepts.principle} /></> : null}</Sec>}
        {c.safety?.length ? <Sec title="안전 지도"><UL items={c.safety} /></Sec> : null}
        {c.extensions?.length ? <Sec title="확장·심화"><UL items={c.extensions} /></Sec> : null}
      </div>
    </div>
  );
}

function Sessions({ c }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[720px]">
        <thead><tr className="bg-violet-600 text-white">{['차시', '학습 요소', '내용', '적용 AI 및 도구'].map((h) => <th key={h} className="px-3 py-2.5 text-left font-extrabold">{h}</th>)}</tr></thead>
        <tbody>{(c.sessions || []).map((s, i) => (
          <tr key={i} className="border-b border-slate-100 align-top odd:bg-slate-50/50">
            <td className="px-3 py-3 font-black text-violet-700 whitespace-nowrap">{s.no}</td>
            <td className="px-3 py-3 font-bold text-slate-700 whitespace-pre-line">{s.stage}</td>
            <td className="px-3 py-3 text-slate-700">{(s.contents || []).map((ct, j) => <div key={j} className="mb-2 last:mb-0"><b>{ct.title}</b><ul className="ml-3 text-slate-600">{(ct.subs || []).map((sub, k) => <li key={k}>- {sub}</li>)}</ul></div>)}</td>
            <td className="px-3 py-3 text-slate-600">{(s.tools || []).map((t, j) => <div key={j}>• {t}</div>)}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function Algorithm({ c }) {
  return (
    <div className="space-y-3">
      {(c.algorithm || []).map((a, i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="flex flex-col items-center"><span className="w-10 h-10 rounded-2xl bg-slate-900 text-white grid place-items-center text-xs font-black shrink-0">{a.step}</span>{i < c.algorithm.length - 1 && <span className="w-0.5 h-8 bg-slate-200 my-1" />}</div>
          <div className="card-flat p-4 flex-1 grid md:grid-cols-[12rem_1fr_1fr] gap-3 text-sm"><b className="text-slate-800">{a.process}</b><p className="text-slate-700">{a.detail}</p><p className="text-violet-800 bg-violet-50 rounded-xl px-3 py-2"><span className="text-[10px] font-black text-violet-500 block">예시</span>{a.example}</p></div>
        </div>
      ))}
      {!c.algorithm?.length && <p className="text-slate-400 text-sm">알고리즘 흐름 표가 없는 챕터입니다.</p>}
    </div>
  );
}

function Lessons({ c }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {(c.lessons || []).map((l, i) => (
        <div key={i} className="card-flat overflow-hidden">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-slate-50"><span className="chip bg-slate-900 text-white border-slate-900">{l.session}</span><b className="text-slate-800 flex-1">{l.title}</b><span className="text-slate-400 text-xs">{open === i ? '접기 ▲' : '펼치기 ▼'}</span></button>
          {open === i && (
            <div className="px-5 pb-5 space-y-4 fade-up">
              {l.focus && <p className="text-sm bg-lime-50 border border-lime-200 rounded-xl p-3 text-lime-900"><b>수업의 주안점</b> · {l.focus}</p>}
              {l.inquiryQuestion && <p className="text-sm text-violet-800 font-bold">탐구 질문 · {l.inquiryQuestion}</p>}
              {(l.steps || []).length ? <div className="space-y-2">{l.steps.map((s, j) => <div key={j} className="rounded-xl border border-slate-200 p-3 text-sm"><b className="text-slate-800">{s.name}</b><p className="text-slate-700 mt-1 whitespace-pre-line">{s.description}</p>{s.teacherTips?.length ? <ul className="mt-2 text-xs text-amber-800 bg-amber-50 rounded-lg p-2 space-y-0.5">{s.teacherTips.map((t, k) => <li key={k}>💡 {t}</li>)}</ul> : null}</div>)}</div> : null}
              {(l.codeSnippets || []).length ? <div><h5 className="font-black text-sm text-slate-700 mb-2">자료에 실린 코드({l.codeSnippets[0]?.tool})</h5><div className="grid md:grid-cols-2 gap-3">{l.codeSnippets.map((cs, j) => <div key={j} className="rounded-xl bg-slate-900 text-slate-100 p-3 text-xs"><p className="text-lime-300 font-bold mb-1.5">{cs.description}</p><pre className="whitespace-pre-wrap font-mono leading-relaxed">{(cs.blocks || []).join('\n')}</pre></div>)}</div></div> : null}
              {l.worksheets?.length ? <p className="text-xs text-slate-500">활동지: {l.worksheets.join(' · ')}</p> : null}
              {l.assessment?.length ? <div className="text-sm"><b className="text-slate-700">평가 관점</b><UL items={l.assessment} /></div> : null}
            </div>
          )}
        </div>
      ))}
      {c.keyBlocks?.length ? <div className="card-flat p-5"><h5 className="font-black text-sm text-slate-700 mb-2">자료에 등장하는 핵심 블록 ({c.keyBlocks.length})</h5><div className="flex flex-wrap gap-1.5">{c.keyBlocks.map((k, i) => <span key={i} className="chip font-mono text-[11px]">{k}</span>)}</div></div> : null}
    </div>
  );
}

function Attachments({ c, links }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">{(c.attachments || []).map((a, i) => <div key={i} className="card-flat p-4 text-sm"><b className="text-slate-800">{a.title}</b><p className="text-slate-600 mt-1 whitespace-pre-line">{a.summary}</p></div>)}</div>
      <div><h4 className="font-black text-slate-800 mb-2 flex items-center gap-2"><Link2 className="w-4 h-4" /> 링크 모음 ({links.length})</h4><div className="space-y-1.5">{links.map((l, i) => <a key={i} href={l.url} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-sky-700 hover:underline break-all"><ExternalLink className="w-4 h-4 shrink-0 mt-0.5" /><span>{l.title ? <b>{l.title} · </b> : null}{l.url}<span className="text-slate-400 text-xs block">{l.from}</span></span></a>)}{!links.length && <p className="text-slate-400 text-sm">링크가 없습니다.</p>}</div></div>
    </div>
  );
}

function Assessment({ c }) {
  const a = c.assessment || {};
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {[['self', '자기 평가'], ['peer', '동료 평가'], ['teacher', '교사 평가']].map(([k, label]) => <div key={k} className="card-flat p-4"><b className="text-slate-800">{label}</b>{a[k]?.length ? <UL items={a[k]} /> : <p className="text-xs text-slate-400 mt-1">자료에 없음</p>}</div>)}
    </div>
  );
}
