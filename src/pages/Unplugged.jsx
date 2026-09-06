import React, { useEffect, useState } from 'react';
import { Puzzle, ChevronLeft, Clock, Users, Package, Cpu, ArrowRight, BookOpen, ListChecks } from 'lucide-react';
import { href } from '../lib/router.js';
import { HARDWARE_MAP } from '../data/hardware.js';

// 언플러그드 활동 → 이어지는 피지컬 AI 활동 추천(연구회 설계)
const BRIDGE = {
  1: { hw: 'microbit', idea: '버튼(입력)→LED(출력)로 컴퓨터의 입력-처리-출력을 보여주는 신호기', why: '대장(CPU)의 명령 흐름을 실제 보드의 입력·처리·출력으로 재현' },
  2: { hw: 'microbit', idea: '빛·소리·온도 센서 값을 LED 그래프로 보여주는 센서 히어로 워치', why: '내가 맡았던 센서 역할을 진짜 센서 값으로 확인' },
  3: { hw: 'hamster', idea: '근접 센서(입력)로 장애물을 감지하면 LED와 바퀴(출력)로 반응하는 로봇', why: '센서-프로세서-액추에이터 협력을 로봇 한 대로 체험' },
  4: { hw: 'microbit', idea: '라디오로 0/1 신호를 보내 암호를 전달하는 비밀 통신기', why: '약속된 신호(디지털화)를 무선 통신으로 실현' },
  5: { hw: 'microbit', idea: '숫자·문자·아이콘을 LED 매트릭스로 표현하는 데이터 표현기', why: '같은 데이터를 다른 방식으로 표현하는 경험' },
  6: { hw: 'hamster', idea: '동작 카드를 순서대로 실행하는 릴레이 로봇(앞으로·돌기·소리)', why: '몸동작 릴레이의 추상화된 명령을 로봇 명령으로' },
  7: { hw: 'spike', idea: '컬러 센서로 물체의 특징(색)을 추상화해 분류하는 로봇', why: '핵심 특징만 뽑아 판단하는 추상화' },
  8: { hw: 'hamster', idea: '동화 속 인물의 핵심 행동만 남긴 로봇 연극', why: '추상화한 행동을 순차 블록으로' },
  9: { hw: 'hamster', idea: '말판 위에서 그림을 따라 이동하는 그리기 로봇(말판 이동 블록)', why: '명확한 절차 설명 → 로봇 명령 순서' },
  10: { hw: 'spike', idea: '레시피처럼 정확한 순서·수치로 움직이는 샌드위치 배달 로봇', why: '모호한 표현 대신 정확한 수치(cm, 도)' },
  11: { hw: 'tory', idea: '한 명령씩 정확히 절차대로 비행하는 어둠 속 구조 드론', why: '절차적 사고를 비행 순서로' },
  12: { hw: 'hamster', idea: '선 따라가기·교차로 판단으로 경로를 달리는 알고리즘 로봇', why: '알고리즘 표현을 실제 경로 주행으로' },
  13: { hw: 'microbit', idea: '변수를 순서대로 계산해 결과를 보여주는 릴레이 계산기', why: '순차 구조와 변수' },
  14: { hw: 'spike', idea: 'AI 이거다 이미지 분류 모델로 물건을 나누는 분류왕 로봇', why: '내가 세운 분류 기준 vs AI가 찾은 규칙' },
  15: { hw: 'hamster', idea: '질문(센서 조건)에 따라 갈라지는 의사결정 트리 로봇', why: '마음 읽기 게임의 예/아니오 분기를 조건 블록으로' },
  16: { hw: 'hamster', idea: '음성 인식으로 대답하고 움직이는 나만의 챗봇 로봇', why: '챗봇의 입력-판단-응답을 로봇으로' },
};

export default function Unplugged({ route }) {
  const [data, setData] = useState(null);
  useEffect(() => { import('../data/unplugged/unplugged.json').then((m) => setData(m.default || m)); }, []);
  if (!data) return <div className="card p-10 text-center text-slate-400">언플러그드 자료를 불러오는 중…</div>;
  const no = Number(route.segs[1]);
  const act = data.activities.find((a) => a.no === no);
  if (act) return <Detail data={data} act={act} />;
  return <List data={data} />;
}

function List({ data }) {
  const [area, setArea] = useState('all');
  const [showIntro, setShowIntro] = useState(false);
  const list = data.activities.filter((a) => area === 'all' || a.area === area);
  const areaColor = { 'computing-system': '#0ea5e9', data: '#f59e0b', algorithm: '#22c55e', ai: '#8b5cf6' };
  return (
    <div className="space-y-8">
      <div>
        <span className="chip bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700"><Puzzle className="w-3.5 h-3.5" /> 언플러그드 활동</span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">『{data.source.book}』</h1>
        <p className="text-slate-500 mt-2 max-w-3xl">{data.source.publisher}. 16개 활동을 브리핑–두잉–디브리핑 구조로 정리했습니다. 각 활동 아래에는 연구회가 설계한 <b>“이어지는 피지컬 AI 활동”</b>이 있어, 언플러그드로 개념을 몸으로 익힌 뒤 바로 교구 수업으로 연결할 수 있습니다.</p>
        <button onClick={() => setShowIntro(!showIntro)} className="mt-3 text-sm font-bold text-fuchsia-700 underline">자료 활용 방향 · BDD 구조 · 학교자율시간 운영 계획서(안) {showIntro ? '접기' : '보기'}</button>
        {showIntro && (
          <div className="card p-6 mt-3 grid lg:grid-cols-2 gap-6 fade-up text-sm">
            <div className="space-y-4">
              <div><b>머리말 요약</b><p className="text-slate-600 mt-1 leading-relaxed">{data.intro.foreword}</p></div>
              <div><b>자료 활용 방향</b><ul className="mt-1 space-y-1 text-slate-600">{data.intro.usageGuide.map((u, i) => <li key={i}>• {u}</li>)}</ul></div>
              <div className="grid sm:grid-cols-3 gap-2">{['briefing', 'doing', 'debriefing'].map((k) => <div key={k} className="rounded-xl bg-fuchsia-50 border border-fuchsia-100 p-3 text-xs text-slate-700 leading-relaxed">{data.intro.bdd[k]}</div>)}</div>
            </div>
            <div>
              <b>{data.intro.schoolAutonomyPlan?.title}</b>
              <p className="text-slate-600 mt-1 leading-relaxed">{data.intro.schoolAutonomyPlan?.summary}</p>
              {data.intro.schoolAutonomyPlan?.sessions?.length ? <div className="mt-3 max-h-64 overflow-auto scrollbar-thin rounded-xl border border-slate-200"><table className="w-full text-xs"><tbody>{data.intro.schoolAutonomyPlan.sessions.map((s, i) => <tr key={i} className="border-b border-slate-100 odd:bg-slate-50"><td className="px-2 py-1.5 font-black text-fuchsia-700 whitespace-nowrap">{s.no ?? s.session ?? i + 1}</td><td className="px-2 py-1.5 font-bold">{s.topic || s.area || ''}</td><td className="px-2 py-1.5 text-slate-600">{s.activity || s.content || ''}</td></tr>)}</tbody></table></div> : null}
            </div>
          </div>
        )}
      </div>
      <div className="seg flex-wrap">
        <button className={area === 'all' ? 'on' : ''} onClick={() => setArea('all')}>전체 16</button>
        {data.areas.map((a) => <button key={a.id} className={area === a.id ? 'on' : ''} onClick={() => setArea(a.id)}>{a.no}. {a.name} {a.activities.length}</button>)}
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((a) => { const b = BRIDGE[a.no]; const hw = b ? HARDWARE_MAP[b.hw] : null; return (
          <a key={a.no} href={href('/unplugged/' + a.no)} className="card p-6 flex flex-col hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-2 text-xs"><span className="w-8 h-8 rounded-xl text-white grid place-items-center font-black" style={{ background: areaColor[a.area] }}>{String(a.no).padStart(2, '0')}</span><span className="chip">{a.concept}</span></div>
            <h3 className="font-black text-lg mt-3 leading-snug">{a.title}</h3>
            <p className="text-xs text-slate-400 font-bold">{a.author} · p.{a.page}</p>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">{a.overview}</p>
            <div className="text-xs text-slate-500 mt-3 flex gap-3"><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{(a.time || '').split('(')[0]}</span><span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{(a.groupSize || '').split('(')[0]}</span></div>
            {hw && <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center gap-2 text-slate-700"><span>{hw.emoji}</span><span className="font-bold">이어서 →</span><span className="truncate">{b.idea}</span></div>}
          </a>
        ); })}
      </div>
    </div>
  );
}

const Box = ({ title, items, color = '#e2e8f0', icon }) => (
  <section className="rounded-2xl border p-5" style={{ borderColor: color }}>
    <h4 className="font-black text-slate-800 flex items-center gap-2 mb-2">{icon}{title}</h4>
    <ul className="space-y-2 text-sm text-slate-700">{(items || []).map((d, i) => <li key={i} className="flex gap-2 leading-relaxed"><span className="font-black text-slate-400 shrink-0">{i + 1}.</span><span>{d}</span></li>)}</ul>
  </section>
);

function Detail({ data, act: a }) {
  const b = BRIDGE[a.no]; const hw = b ? HARDWARE_MAP[b.hw] : null;
  const area = data.areas.find((x) => x.id === a.area);
  return (
    <div className="space-y-6">
      <a href={href('/unplugged')} className="text-sm font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> 언플러그드 활동 목록</a>
      <div className="card p-6 md:p-8">
        <div className="flex items-center gap-2 flex-wrap text-xs"><span className="chip bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700">{area?.no}. {area?.name}</span><span className="chip">{a.concept}</span><span className="chip">{a.author}</span><span className="chip">p.{a.page}{a.guidePages ? ` (${a.guidePages})` : ''}</span></div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">{String(a.no).padStart(2, '0')} {a.title}</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">{a.overview}</p>
        {a.inquiryQuestion && <p className="mt-3 text-sm font-bold text-fuchsia-800 bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-3">❓ 탐구 질문 · {a.inquiryQuestion}</p>}
        <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3"><span className="text-[11px] font-black text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 시간</span>{a.time}</div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3"><span className="text-[11px] font-black text-slate-400 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 대상·모둠</span>{a.grade}<br />{a.groupSize}</div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3"><span className="text-[11px] font-black text-slate-400 flex items-center gap-1"><Package className="w-3.5 h-3.5" /> 준비물</span>{(a.materials || []).join(', ')}</div>
        </div>
      </div>

      {hw && (
        <div className="card p-6 border-2" style={{ borderColor: hw.color + '88' }}>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="text-4xl">{hw.emoji}</div>
            <div className="flex-1 min-w-[16rem]"><span className="text-[11px] font-black text-slate-400">연구회 추천 · 이어지는 피지컬 AI 활동</span><h3 className="font-black text-xl">{b.idea}</h3><p className="text-sm text-slate-600 mt-1">{hw.name} · {b.why}</p></div>
            <a href={href('/connect', { hw: hw.id, idea: b.idea })} className="btn btn-dark shrink-0"><Cpu className="w-5 h-5" /> 이 아이디어로 블록 설계 <ArrowRight className="w-4 h-4" /></a>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <Box title="브리핑 (Briefing)" items={a.briefing} color="#bae6fd" icon={<span>🎬</span>} />
        <Box title="두잉 (Doing)" items={a.doing} color="#bbf7d0" icon={<span>🏃</span>} />
        <Box title="디브리핑 (Debriefing)" items={a.debriefing} color="#fde68a" icon={<span>💬</span>} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-6 space-y-4 text-sm">
          <div><b className="text-slate-800">학습 목표</b><ul className="mt-1 space-y-1 text-slate-700">{(a.objectives || []).map((o, i) => <li key={i}>{o}</li>)}</ul></div>
          <div><b className="text-slate-800">컴퓨터과학 개념</b><div className="mt-1 flex flex-wrap gap-1.5">{(a.csConcepts || []).map((c, i) => <span key={i} className="chip">{c}</span>)}</div></div>
          {a.standards?.length ? <div><b className="text-slate-800">성취기준</b><ul className="mt-1 space-y-1 text-slate-600 text-xs">{a.standards.map((s, i) => <li key={i}>{s}</li>)}</ul></div> : null}
          {a.physicalComputingLink ? <div className="rounded-xl bg-sky-50 border border-sky-100 p-3 text-slate-700"><b className="text-sky-800">피지컬 컴퓨팅·AI와의 연결</b><p className="mt-1 leading-relaxed">{a.physicalComputingLink}</p></div> : null}
        </div>
        <div className="card p-6 space-y-4 text-sm">
          {a.variations?.length ? <div><b className="text-slate-800">수준별 변형·확장</b><ul className="mt-1 space-y-1 text-slate-700">{a.variations.map((v, i) => <li key={i}>• {v}</li>)}</ul></div> : null}
          {a.tips?.length ? <div><b className="text-slate-800">지도 팁</b><ul className="mt-1 space-y-1 text-slate-700">{a.tips.map((v, i) => <li key={i}>💡 {v}</li>)}</ul></div> : null}
          {a.assessment?.length ? <div><b className="text-slate-800 flex items-center gap-1"><ListChecks className="w-4 h-4" /> 평가</b><ul className="mt-1 space-y-1 text-slate-700">{a.assessment.map((v, i) => <li key={i}>{v}</li>)}</ul></div> : null}
        </div>
      </div>
      {a.rubric?.length ? (
        <div className="card p-6 overflow-x-auto"><h4 className="font-black mb-3">평가 루브릭</h4><table className="w-full text-xs min-w-[720px]"><thead><tr className="bg-slate-900 text-white">{['범주', '평가 요소', '상', '중', '하', '피드백'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead><tbody>{a.rubric.map((r, i) => <tr key={i} className="border-b border-slate-100 align-top odd:bg-slate-50"><td className="px-3 py-2 font-bold">{r.category}</td><td className="px-3 py-2">{r.element}</td><td className="px-3 py-2">{r.high}</td><td className="px-3 py-2">{r.mid}</td><td className="px-3 py-2">{r.low}</td><td className="px-3 py-2 text-slate-600">{r.feedback}</td></tr>)}</tbody></table></div>
      ) : null}
      {a.conceptNotes?.length ? <div className="grid md:grid-cols-2 gap-4">{a.conceptNotes.map((c, i) => <div key={i} className="card-flat p-5 text-sm"><b className="flex items-center gap-1 text-slate-800"><BookOpen className="w-4 h-4" /> 개념 알아보기 · {c.title}</b><p className="text-slate-700 mt-2 leading-relaxed whitespace-pre-line">{c.content}</p></div>)}</div> : null}
      {a.worksheets?.length ? <div className="card-flat p-5 text-sm"><b>부록·활동지</b><ul className="mt-1 space-y-1 text-slate-600">{a.worksheets.map((w, i) => <li key={i}>• {w}</li>)}</ul></div> : null}
    </div>
  );
}
