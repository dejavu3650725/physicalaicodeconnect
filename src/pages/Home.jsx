import React, { useEffect, useState } from 'react';
import { ArrowRight, Cpu, Plug, ShieldCheck, Blocks, Wand2, Sparkles, Route, Users, ClipboardCheck, Play } from 'lucide-react';
import { HARDWARE } from '../data/hardware.js';
import { href } from '../lib/router.js';
import { SAMPLES } from '../data/samples.js';
import { normalizeTree, PLATFORMS } from '../blocks/engine.js';
import BlockCanvas from '../components/BlockCanvas.jsx';
import { STAGES, ALGORITHM_PATTERN, ROLES } from '../lib/knowledge.js';

const SHOWCASE = ['hamster', 'microbit', 'spike', 'tory'];

function Showcase() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % SHOWCASE.length), 4200); return () => clearInterval(t); }, []);
  const hwId = SHOWCASE[i]; const s = SAMPLES[hwId]; const hw = HARDWARE.find((h) => h.id === hwId);
  const level = hwId === 'microbit' ? 'standard' : 'advanced';
  const blocks = normalizeTree(s.platformKey, s.levels[level].blocks, []);
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[36px] opacity-60 blur-2xl" style={{ background: hw.gradient }} />
      <div className="relative glass-dark rounded-[28px] p-4 shadow-2xl ring">
        <div className="flex items-center justify-between px-2 pb-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-white"><span className="text-xl">{hw.emoji}</span>{hw.name}<span className="text-white/50 font-bold">· {PLATFORMS[s.platformKey].tool}</span></div>
          <div className="flex gap-1.5">{SHOWCASE.map((k, j) => <button key={k} onClick={() => setI(j)} className={`h-1.5 rounded-full transition-all ${j === i ? 'w-6 bg-lime-300' : 'w-2 bg-white/30'}`} />)}</div>
        </div>
        <div key={hwId} className="rounded-2xl overflow-hidden fade-up showcase-canvas">
          <BlockCanvas platformKey={s.platformKey} blocks={blocks} showCategory={false} />
        </div>
        <div className="flex items-center justify-between px-2 pt-3 text-xs text-white/70 font-semibold">
          <span>“{s.title}” · {level === 'advanced' ? '🔥 심화(AI 융합)' : '🚀 기본(센서·변수)'}</span>
          <a href={href('/connect', { hw: hwId })} className="text-lime-300 hover:text-lime-200 inline-flex items-center gap-1">이 교구로 설계 <ArrowRight className="w-3.5 h-3.5" /></a>
        </div>
      </div>
      <div className="absolute -left-10 -top-5 float d1 hidden lg:block"><span className="chip bg-[#00b6b1] text-white border-transparent shadow-xl">하드웨어 · 앞으로 1 초 이동하기</span></div>
      <div className="absolute -right-8 top-[58%] float d2 hidden lg:block"><span className="chip bg-[#8222ff] text-white border-transparent shadow-xl">인공지능 · 1번째 손의 모양이 편 손인가?</span></div>
      <div className="absolute -left-4 -bottom-5 float hidden lg:block"><span className="chip bg-[#1E90FF] text-white border-transparent shadow-xl">기본 · 아이콘 출력 ♥</span></div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-24 pb-10">
      {/* HERO */}
      <section className="hero rounded-[36px] -mt-4 px-6 md:px-14 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="aurora w-[38rem] h-[38rem] -left-40 -top-56" style={{ background: '#76b900' }} />
        <div className="aurora w-[34rem] h-[34rem] right-[-8rem] top-[-6rem]" style={{ background: '#38bdf8', animationDelay: '-5s' }} />
        <div className="aurora w-[30rem] h-[30rem] left-1/2 bottom-[-14rem]" style={{ background: '#a855f7', animationDelay: '-9s' }} />
        <div className="relative grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-center">
          <div className="fade-up">
            <span className="chip glass-dark text-lime-200 border-white/15"><Sparkles className="w-3.5 h-3.5" /> 서울특별시교육청 AI피지컬컴퓨팅융합교육연구회 · 학교자율시간 프로그램</span>
            <h1 className="mt-6 text-[2.5rem] sm:text-5xl lg:text-[3.9rem] xl:text-[4.3rem] font-black leading-[1.06] tracking-tight [word-break:keep-all]">
              아이디어를 말하면,<br /><span className="gradient-text">진짜 교구 블록</span>으로<br />수업이 설계됩니다.
            </h1>
            <p className="mt-7 text-slate-300 text-lg md:text-xl leading-relaxed max-w-xl [word-break:keep-all]">햄스터 · 마이크로비트 v2 스마트워치 · 토리 드론 · 레고 스파이크. 엔트리/메이크코드/스파이크 앱에 <b className="text-white">실제로 있는 블록만</b>으로 조립도를 만들고, 블록에서 코드를 자동 생성하고, 교육청 피지컬 AI 설계 원리로 <b className="text-white">4단계 수업 흐름</b>까지 뽑아냅니다.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={href('/connect')} className="btn btn-primary text-base !px-6 !py-4"><Cpu className="w-5 h-5" /> 코드 커넥트 시작</a>
              <a href={href('/tutorial')} className="btn btn-glass text-base !px-6 !py-4"><Plug className="w-5 h-5" /> 교구 연결 튜토리얼</a>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[['4', '교구 · 5개 도구 프로필'], ['368', '검증된 블록 카탈로그'], ['3', '기초·기본·심화 단계'], ['4', '단계 수업 흐름 자동 설계']].map(([n, l]) => (
                <div key={l} className="glass-dark rounded-2xl p-4"><div className="stat text-3xl font-black text-white">{n}</div><div className="text-xs font-bold text-slate-300 mt-1">{l}</div></div>
              ))}
            </div>
          </div>
          <div className="fade-up" style={{ animationDelay: '.15s' }}><Showcase /></div>
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
            <div key={h.id} className="hw-card tilt fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="hw-top flex items-end justify-between p-5" style={{ background: h.gradient }}>
                <span className="hw-emoji">{h.emoji}</span>
                <span className="chip bg-white/85 border-transparent text-slate-800 relative z-10">{h.tool}</span>
              </div>
              <div className="p-6">
                <h3 className="font-black text-xl">{h.name}</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">{h.vendor}</p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed min-h-[4.5rem]">{h.tagline}</p>
                <div className="mt-5 flex gap-2">
                  <a href={href('/connect', { hw: h.id })} className="btn btn-dark !py-2.5 !px-4 text-sm flex-1">설계하기</a>
                  <a href={href('/tutorial/' + h.tutorial)} className="btn btn-ghost !py-2.5 !px-3.5 text-sm" title="연결 튜토리얼"><Plug className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
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
            <a href={href('/connect')} className="btn btn-primary mt-8"><Play className="w-5 h-5" /> 설계 시작하기</a>
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
