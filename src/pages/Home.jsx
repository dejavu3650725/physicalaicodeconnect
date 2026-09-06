import React, { useEffect, useState } from 'react';
import { ArrowRight, Cpu, Plug, ShieldCheck, Blocks, Wand2, Sparkles, Route, Users, ClipboardCheck, Compass, Bot } from 'lucide-react';
import { HARDWARE } from '../data/hardware.js';
import { href } from '../lib/router.js';
import { STAGES, ALGORITHM_PATTERN, ROLES } from '../lib/knowledge.js';

const NODE_POS = { hamster: [82, 14], microbit: [82, 38], tory: [82, 62], spike: [82, 86] };
const HUB = [44, 50]; const IDEA = [8, 50];
function curve([x1, y1], [x2, y2]) { const mx = (x1 + x2) / 2; return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`; }

/** 정체성 비주얼: 아이디어 → 코드 커넥트 허브 → 4개 교구로 흐르는 연결 다이어그램 */
function ConnectDiagram() {
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive((a) => (a + 1) % HARDWARE.length), 2600); return () => clearInterval(t); }, []);
  return (
    <div className="relative w-full aspect-[1.05] sm:aspect-[1.25] lg:aspect-[1.02] select-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="lineG" x1="0" x2="1"><stop offset="0" stopColor="#a3e635" /><stop offset="1" stopColor="#38bdf8" /></linearGradient>
        </defs>
        <path d={curve(IDEA, HUB)} fill="none" stroke="url(#lineG)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeOpacity=".9" strokeDasharray="3 3" className="dash-flow" />
        {HARDWARE.map((h, i) => (
          <g key={h.id}>
            <path id={`p-${h.id}`} d={curve(HUB, NODE_POS[h.id])} fill="none" stroke={i === active ? h.color : 'rgba(255,255,255,.22)'} strokeWidth={i === active ? 2 : 1} vectorEffect="non-scaling-stroke" style={{ transition: 'stroke .5s' }} />
            <circle r={i === active ? 1.6 : 0.9} fill={i === active ? '#fff' : h.color} style={{ filter: `drop-shadow(0 0 4px ${h.color})` }}>
              <animateMotion dur={i === active ? '1.6s' : '3.2s'} repeatCount="indefinite" begin={`${i * 0.4}s`}><mpath href={`#p-${h.id}`} /></animateMotion>
            </circle>
          </g>
        ))}
      </svg>
      {/* 아이디어 노드 */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${IDEA[0]}%`, top: `${IDEA[1]}%` }}>
        <div className="glass-dark rounded-2xl px-3.5 py-2.5 text-white text-xs font-extrabold whitespace-nowrap shadow-xl float">💬 “손으로 조종하는<br />배달 로봇 만들래요!”</div>
      </div>
      {/* 허브 */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${HUB[0]}%`, top: `${HUB[1]}%` }}>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-lime-400/40 blur-2xl animate-pulse" />
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full grid place-items-center bg-[#0b1220] ring shadow-2xl">
            <div className="text-center"><Bot className="w-9 h-9 sm:w-11 sm:h-11 text-lime-300 mx-auto" /><div className="text-[10px] sm:text-[11px] font-black tracking-widest text-white mt-1">CODE</div><div className="text-[10px] sm:text-[11px] font-black tracking-widest gradient-text -mt-0.5">CONNECT</div></div>
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 chip bg-white text-slate-900 border-transparent text-[10px] !py-0.5 whitespace-nowrap shadow">실제 블록 카탈로그 · AI 설계</span>
        </div>
      </div>
      {/* 하드웨어 노드 */}
      {HARDWARE.map((h, i) => (
        <a key={h.id} href={href('/connect', { hw: h.id })} onMouseEnter={() => setActive(i)} className={`absolute -translate-y-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl pl-2 pr-4 py-2 transition-all duration-500 ${i === active ? 'glass scale-105 shadow-2xl' : 'glass-dark hover:bg-white/10'}`} style={{ left: `${NODE_POS[h.id][0]}%`, top: `${NODE_POS[h.id][1]}%`, minWidth: '11.5rem' }}>
          <span className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0 shadow-lg" style={{ background: h.gradient }}>{h.emoji}</span>
          <span className="min-w-0"><span className={`block font-black text-sm leading-tight whitespace-nowrap ${i === active ? 'text-slate-900' : 'text-white'}`}>{h.name}</span><span className={`block text-[11px] font-bold whitespace-nowrap ${i === active ? 'text-slate-500' : 'text-slate-300'}`}>{h.tool} · {i === 0 ? '엔트리 파이썬·roboid' : i === 1 ? 'JS · Python' : i === 2 ? 'CodingRider' : 'SPIKE Python'}</span></span>
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-24 pb-10">
      {/* HERO */}
      <section className="hero rounded-[36px] -mt-4 px-6 md:px-14 pt-14 pb-16 md:pt-20 md:pb-20">
        <div className="aurora w-[38rem] h-[38rem] -left-40 -top-56" style={{ background: '#76b900' }} />
        <div className="aurora w-[34rem] h-[34rem] right-[-8rem] top-[-6rem]" style={{ background: '#38bdf8', animationDelay: '-5s' }} />
        <div className="aurora w-[30rem] h-[30rem] left-1/2 bottom-[-14rem]" style={{ background: '#a855f7', animationDelay: '-9s' }} />
        <div className="relative grid lg:grid-cols-[.9fr_1.1fr] gap-10 lg:gap-6 items-center">
          <div className="fade-up">
            <span className="chip glass-dark text-lime-200 border-white/15"><Sparkles className="w-3.5 h-3.5" /> 서울특별시교육청 AI피지컬컴퓨팅융합교육연구회 · 학교자율시간 프로그램</span>
            <div className="mt-7 flex items-center gap-4">
              <span className="w-16 h-16 rounded-[22px] grid place-items-center bg-gradient-to-tr from-[#76b900] to-[#22c55e] shadow-[0_20px_50px_-15px_rgba(118,185,0,.9)] ring"><Bot className="w-9 h-9 text-white" /></span>
              <div><div className="text-[11px] font-black tracking-[.2em] text-lime-300">PHYSICAL AI CODE CONNECT</div><h1 className="text-[2.1rem] sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-black leading-none tracking-tight whitespace-nowrap">피지컬 AI <span className="gradient-text">코드 커넥트</span></h1></div>
            </div>
            <p className="mt-7 text-2xl md:text-[1.75rem] font-extrabold leading-snug text-white [word-break:keep-all]">학생의 아이디어를 <span className="text-lime-300">진짜 교구 블록</span>으로<br className="hidden sm:block" /> 연결하는 피지컬 AI 융합 수업 설계 플랫폼</p>
            <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-xl [word-break:keep-all]">햄스터봇 · 마이크로비트 v2 · 토리드론 · 레고 스파이크 프라임. 각 교구의 도구(엔트리·메이크코드·스파이크 앱)에 실제로 있는 블록만으로 조립도를 만들고, 코드와 4단계 수업 흐름까지 한 번에 설계합니다.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={href('/connect')} className="btn btn-primary text-base !px-6 !py-4"><Cpu className="w-5 h-5" /> 코드 커넥트 시작</a>
              <a href={href('/tutorial')} className="btn btn-glass text-base !px-6 !py-4"><Plug className="w-5 h-5" /> 교구 연결 튜토리얼</a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              {[['368', '검증된 실제 블록'], ['3', '기초·기본·심화'], ['4', '단계 수업 흐름']].map(([n, l]) => (
                <div key={l} className="glass-dark rounded-2xl px-4 py-3"><div className="stat text-2xl font-black text-white">{n}</div><div className="text-[11px] font-bold text-slate-300 mt-0.5">{l}</div></div>
              ))}
            </div>
          </div>
          <div className="fade-up" style={{ animationDelay: '.15s' }}><ConnectDiagram /></div>
        </div>
      </section>

      {/* 마퀴 */}
      <div className="overflow-hidden -mt-12 opacity-80">
        <div className="marquee text-sm font-extrabold text-slate-400">
          {[...Array(2)].flatMap((_, k) => ['엔트리 햄스터 · 햄스터S', '메이크코드 micro:bit v2', '토리 드론 · CodingRider', 'LEGO SPIKE Prime · SPIKE Python', '엔트리 인공지능 블록', 'roboid Python', 'MakeCode JavaScript / Python', '학교자율시간 4~6차시 설계'].map((t, i) => <span key={k + '-' + i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-lime-500" />{t}</span>))}
        </div>
      </div>

      {/* 하드웨어 */}
      <section>
        <div className="max-w-2xl"><span className="eyebrow">Hardware</span><h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2">어떤 교구로 수업하나요?</h2><p className="text-slate-500 mt-3 text-lg">교구를 고르면 그 교구에 실제로 있는 블록·센서·출력만 사용해 설계합니다. 없는 기능은 창의적으로 우회합니다.</p></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {HARDWARE.map((h, i) => (
            <a key={h.id} href={href('/connect', { hw: h.id })} className="hw-card tilt fade-up block group" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="hw-top flex items-end justify-between p-5" style={{ background: h.gradient }}>
                <span className="hw-emoji">{h.emoji}</span>
                <span className="chip bg-white/85 border-transparent text-slate-800 relative z-10">{h.tool}</span>
              </div>
              <div className="p-6">
                <h3 className="font-black text-xl">{h.name}</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">{h.vendor}</p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed min-h-[4.5rem]">{h.tagline}</p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-extrabold text-[#5a8d00] group-hover:gap-2.5 transition-all">이 교구로 코드 커넥트 <ArrowRight className="w-4 h-4" /></div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 어떻게 다른가 */}
      <section className="grid lg:grid-cols-3 gap-6">
        {[
          { icon: Blocks, title: '블록 이름 1:1 일치', body: '엔트리(entryjs 소스), 메이크코드 한국어 UI, 스파이크 앱 표기를 카탈로그로 고정. AI는 카탈로그 안에서만 조립하고, 없는 블록은 자동 차단·수정 요청됩니다.', color: '#4562f5' },
          { icon: ShieldCheck, title: '코드는 블록에서 자동 생성', body: 'AI가 코드를 “쓰지” 않습니다. 조립도에서 엔트리 파이썬 · roboid · MakeCode JS/Python · SPIKE Python을 결정적으로 변환해 존재하지 않는 명령이 끼어들 수 없습니다.', color: '#00b6b1' },
          { icon: Wand2, title: '하드웨어 한계 돌파', body: '“하늘을 나는 햄스터”처럼 교구 한계를 넘는 상상도 거부하지 않고, 실제 센서·출력으로 표현하는 대안을 제시해 학생의 동기를 지켜줍니다.', color: '#f59e0b' },
        ].map((f, i) => { const I = f.icon; return (
          <div key={f.title} className="card p-8 tilt fade-up" style={{ animationDelay: `${i * 80}ms` }}><div className="w-12 h-12 rounded-2xl grid place-items-center text-white shadow-lg" style={{ background: f.color }}><I className="w-6 h-6" /></div><h3 className="font-black text-xl mt-5">{f.title}</h3><p className="text-[15px] text-slate-600 leading-relaxed mt-2">{f.body}</p></div>
        ); })}
      </section>

      {/* 설계 원리 */}
      <section className="rounded-[36px] bg-[#0b1220] text-white p-8 md:p-14 relative overflow-hidden">
        <div className="aurora w-[30rem] h-[30rem] -right-40 -top-40" style={{ background: '#76b900', opacity: .35 }} />
        <div className="relative grid lg:grid-cols-[1fr_1.2fr] gap-12">
          <div>
            <span className="eyebrow text-lime-300">Pedagogy Engine</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2">코드만 뽑는 게 아니라,<br />수업 흐름까지 설계합니다.</h2>
            <p className="text-slate-300 mt-5 text-lg leading-relaxed">서울특별시교육청 피지컬 AI 교육자료의 교수학습 설계 구조(4단계 흐름 · 센서→AI→판단→출력 알고리즘 패턴 · 모둠 역할 · 평가 관점)를 내부 지식으로 심어, 모든 설계 결과에 <b className="text-white">학교자율시간 차시 계획·평가·안전 지도</b>를 함께 제공합니다.</p>
            <div className="mt-6 flex flex-wrap gap-2">{ROLES.map((r) => <span key={r} className="chip glass-dark text-white border-white/15"><Users className="w-3.5 h-3.5" /> {r}</span>)}</div>
            <a href={href('/guide')} className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-lime-300 hover:text-lime-200 hover:gap-2.5 transition-all"><Compass className="w-4 h-4" /> 설계 원리 자세히 보기 <ArrowRight className="w-4 h-4" /></a>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {STAGES.map((s, i) => (
              <div key={s.key} className="glass-dark rounded-3xl p-5 fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-3"><span className="step-num">{i + 1}</span><div><div className="font-black">{s.name}</div><div className="text-[11px] text-lime-300 font-bold">{s.en}</div></div></div>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">{s.desc}</p>
              </div>
            ))}
            <div className="sm:col-span-2 glass-dark rounded-3xl p-5 flex flex-wrap items-center gap-2 text-sm font-bold">
              <Route className="w-5 h-5 text-lime-300" /> {ALGORITHM_PATTERN.map((a, i) => <React.Fragment key={a}><span className="text-white">{a}</span>{i < ALGORITHM_PATTERN.length - 1 && <ArrowRight className="w-4 h-4 text-slate-500" />}</React.Fragment>)}
            </div>
          </div>
        </div>
      </section>

      {/* 흐름 */}
      <section>
        <div className="max-w-2xl"><span className="eyebrow">How it works</span><h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2">수업은 이렇게 흘러가요</h2></div>
        <div className="grid md:grid-cols-4 gap-5 mt-10">
          {[[Plug, '교구 연결 튜토리얼', '게임처럼 체크포인트를 넘으며 5분 안에 연결. 현장 문제 해결법 포함.'], [Sparkles, '아이디어 → 블록 조립도', '학생 말 한 줄이 기초·기본·심화 3단계 실제 블록 조립도로.'], [Cpu, '텍스트 코드 & 조립 순서', '블록에서 자동 변환된 코드와 번호 매긴 조립 순서. 인쇄해 활동지로.'], [ClipboardCheck, '수업 흐름 · 평가 · 피드백', '4단계 차시 계획과 평가 관점, 아이디어를 더하면 블록이 즉시 업데이트.']].map(([I, t, d], i) => (
            <div key={t} className="card p-7 fade-up" style={{ animationDelay: `${i * 80}ms` }}><div className="flex items-center gap-3"><span className="step-num">{i + 1}</span><I className="w-5 h-5 text-slate-400" /></div><h3 className="font-black text-lg mt-4">{t}</h3><p className="text-sm text-slate-600 mt-2 leading-relaxed">{d}</p></div>
          ))}
        </div>
      </section>
    </div>
  );
}
