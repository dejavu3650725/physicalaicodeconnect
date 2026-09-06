import React from 'react';
import { ArrowRight, Cpu, Plug, BookOpen, Puzzle, ShieldCheck, Blocks, Wand2, GraduationCap } from 'lucide-react';
import { HARDWARE } from '../data/hardware.js';
import { href } from '../lib/router.js';
import { CURRICULUM } from '../data/curriculumIndex.js';

export default function Home() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-[#0b1220] text-white p-8 md:p-14">
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[28rem] h-[28rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="chip bg-white/10 border-white/15 text-lime-300">서울시교육청 AI·피지컬컴퓨팅융합교육연구회 · 학교자율시간 프로그램</span>
          <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[1.08]">아이디어를 말하면,<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-300 via-emerald-300 to-sky-300">진짜 교구 블록</span>으로 설계됩니다.</h1>
          <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-2xl">햄스터 · 마이크로비트 v2 스마트워치 · 토리 드론 · 레고 스파이크. 실제 엔트리/메이크코드/스파이크 앱 블록 이름 그대로 조립도를 만들고, 블록에서 텍스트 코드를 자동 생성합니다. 교육청 배포 자료의 로직으로 수업을 설계하세요.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={href('/connect')} className="btn btn-primary text-base"><Cpu className="w-5 h-5" /> 코드 커넥트 시작</a>
            <a href={href('/tutorial')} className="btn bg-white/10 hover:bg-white/15 text-white border-white/10 text-base"><Plug className="w-5 h-5" /> 교구 연결 튜토리얼</a>
          </div>
        </div>
      </section>

      {/* 하드웨어 */}
      <section>
        <div className="flex items-end justify-between mb-5"><div><h2 className="text-2xl md:text-3xl font-black tracking-tight">어떤 교구로 수업하나요?</h2><p className="text-slate-500 mt-1">교구를 고르면 그 교구에 실제로 있는 블록·센서만 사용해 설계합니다.</p></div></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HARDWARE.map((h) => (
            <div key={h.id} className="card p-6 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 group-hover:opacity-35 transition" style={{ background: h.gradient }} />
              <div className="text-4xl">{h.emoji}</div>
              <h3 className="mt-3 font-black text-xl">{h.name}</h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">{h.vendor} · {h.tool}</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed flex-1">{h.tagline}</p>
              <div className="mt-5 flex gap-2">
                <a href={href('/connect', { hw: h.id })} className="btn btn-dark !py-2.5 !px-3.5 text-sm flex-1">설계하기</a>
                <a href={href('/tutorial/' + h.tutorial)} className="btn btn-ghost !py-2.5 !px-3.5 text-sm" title="연결 튜토리얼"><Plug className="w-4 h-4" /></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 특징 */}
      <section className="grid md:grid-cols-3 gap-5">
        {[
          { icon: Blocks, title: '실제 블록 이름 1:1 매칭', body: '엔트리(entryjs 소스), 메이크코드 한국어 UI, 스파이크 앱 화면 표기를 그대로 카탈로그화. AI는 카탈로그에 있는 블록만 조립하고, 없는 블록은 자동 차단됩니다.', color: '#4562f5' },
          { icon: ShieldCheck, title: '코드는 블록에서 자동 생성', body: 'AI가 코드를 “쓰지” 않습니다. 블록 조립도에서 엔트리 파이썬 · roboid · MakeCode JS/Python · SPIKE Python을 결정적으로 변환해 할루시네이션을 원천 차단합니다.', color: '#00b6b1' },
          { icon: Wand2, title: '하드웨어 한계 돌파 우회', body: '“하늘을 나는 햄스터”처럼 교구 한계를 넘는 상상도 거부하지 않고, 실제 센서·출력으로 표현하는 대안을 제시해 학생의 동기를 지켜줍니다.', color: '#f59e0b' },
        ].map((f) => { const I = f.icon; return (
          <div key={f.title} className="card p-6"><div className="w-11 h-11 rounded-2xl grid place-items-center text-white" style={{ background: f.color }}><I className="w-6 h-6" /></div><h3 className="font-extrabold text-lg mt-4">{f.title}</h3><p className="text-sm text-slate-600 leading-relaxed mt-2">{f.body}</p></div>
        ); })}
      </section>

      {/* 교육청 자료 */}
      <section>
        <div className="flex items-end justify-between mb-5 gap-4 flex-wrap"><div><h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2"><BookOpen className="w-7 h-7 text-violet-500" /> 교육청 배포 자료 로직</h2><p className="text-slate-500 mt-1">『피지컬 AI 원리를 활용한 문제해결 프로젝트 자료집』 9개 챕터를 JSON으로 구조화 — 차시 흐름·알고리즘·핵심 블록을 AI 설계 근거로 사용합니다.</p></div><a href={href('/library')} className="btn btn-ghost !py-2.5 text-sm">자료실 전체 보기 <ArrowRight className="w-4 h-4" /></a></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM.map((c) => (
            <a key={c.id} href={href('/library/' + c.id)} className="card-flat p-5 hover:border-violet-300 hover:shadow-lg transition flex flex-col">
              <div className="flex items-center gap-2 text-xs font-extrabold"><span className="chip" style={{ background: c.hwColor + '22', borderColor: c.hwColor + '55' }}>{c.hwEmoji} {c.hwName}</span><span className="chip bg-violet-50 border-violet-200 text-violet-700">{c.level}</span><span className="text-slate-400">{c.software}</span></div>
              <h3 className="font-extrabold mt-3 leading-snug">{c.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{c.subtitle}</p>
              <p className="text-xs text-slate-400 mt-auto pt-3">{c.sessionCount}차시 · {c.pages}쪽</p>
            </a>
          ))}
        </div>
      </section>

      {/* 언플러그드 + 흐름 */}
      <section className="grid lg:grid-cols-2 gap-5">
        <a href={href('/unplugged')} className="card p-7 flex gap-5 items-start hover:-translate-y-0.5 transition-transform">
          <div className="w-14 h-14 rounded-2xl bg-fuchsia-500 text-white grid place-items-center shrink-0"><Puzzle className="w-7 h-7" /></div>
          <div><h3 className="font-black text-xl">언플러그드 → 피지컬 연결 수업</h3><p className="text-sm text-slate-600 mt-2 leading-relaxed">『놀이로 경험하는 디지털 세상』 16개 언플러그드 활동(컴퓨팅 시스템·데이터·알고리즘·인공지능)을 브리핑-두잉-디브리핑 구조로 정리하고, 각 활동에 이어질 피지컬 컴퓨팅 활동을 추천합니다.</p><span className="text-fuchsia-600 text-sm font-bold mt-3 inline-flex items-center gap-1">활동 살펴보기 <ArrowRight className="w-4 h-4" /></span></div>
        </a>
        <div className="card p-7">
          <h3 className="font-black text-xl flex items-center gap-2"><GraduationCap className="w-6 h-6 text-lime-600" /> 수업은 이렇게 흘러가요</h3>
          <ol className="mt-4 space-y-3 text-sm">
            {[['언플러그드로 개념 몸으로 익히기', '센서-처리-출력, 알고리즘, AI 분류를 놀이로'], ['교구 연결 튜토리얼 통과', '게임처럼 체크포인트를 넘으며 5분 안에 연결'], ['아이디어 → 블록 조립도 → 텍스트 코드', '기초·기본·심화 3단계 + 교육청 자료 연계'], ['아이디어 더하기 & 피드백', 'AI 교사 피드백으로 블록이 즉시 업데이트']].map(([t, d], i) => (
              <li key={t} className="flex gap-3"><span className="w-7 h-7 rounded-full bg-slate-900 text-white grid place-items-center text-xs font-black shrink-0">{i + 1}</span><div><b>{t}</b><div className="text-slate-500">{d}</div></div></li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
