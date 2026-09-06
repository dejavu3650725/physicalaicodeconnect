import React from 'react';
import { Compass, Route, Users, ClipboardCheck, Puzzle, ArrowRight, Cpu, Sparkles } from 'lucide-react';
import { STAGES, ALGORITHM_PATTERN, ASSESSMENT_LENSES, ROLES, TEMPLATES, WARMUPS } from '../lib/knowledge.js';
import { HARDWARE } from '../data/hardware.js';
import { href } from '../lib/router.js';

export default function Guide() {
  return (
    <div className="space-y-14">
      <section className="hero rounded-[36px] p-8 md:p-14">
        <div className="aurora w-[30rem] h-[30rem] -right-32 -top-32" style={{ background: '#38bdf8' }} />
        <div className="relative max-w-3xl">
          <span className="chip glass-dark text-lime-200 border-white/15"><Compass className="w-3.5 h-3.5" /> 연구회 수업 설계 프레임워크</span>
          <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">피지컬 AI 융합 수업,<br /><span className="gradient-text">이 구조로 설계합니다.</span></h1>
          <p className="mt-5 text-slate-300 text-lg leading-relaxed">서울특별시교육청 피지컬 AI 교육자료의 교수학습 설계 원리를 연구회 관점으로 정리한 구조입니다. 코드 커넥트의 모든 설계 결과(블록·코드·수업 흐름·평가)는 이 원리를 근거로 생성됩니다.</p>
        </div>
      </section>

      <section>
        <span className="eyebrow">Stage Model</span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2 flex items-center gap-2"><Route className="w-7 h-7 text-violet-500" /> 4단계 수업 흐름 (학교자율시간 4~6차시)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {STAGES.map((s, i) => (
            <div key={s.key} className="card p-6 tilt">
              <span className="step-num">{i + 1}</span>
              <h3 className="font-black text-lg mt-4">{s.name}</h3>
              <div className="text-[11px] font-bold text-violet-600">{s.en}</div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card p-7"><h3 className="font-black text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-sky-500" /> 알고리즘 패턴</h3><ol className="mt-4 space-y-2 text-sm text-slate-700">{ALGORITHM_PATTERN.map((a) => <li key={a} className="rounded-xl bg-sky-50 border border-sky-100 px-3 py-2 font-semibold">{a}</li>)}</ol><p className="text-xs text-slate-500 mt-3">모든 프로젝트를 “센서 입력 → AI 인식 → 판단 → 출력”의 데이터 흐름으로 설계합니다. 기초 단계는 ①④, 기본은 ①③④, 심화는 ①②③④.</p></div>
        <div className="card p-7"><h3 className="font-black text-lg flex items-center gap-2"><Users className="w-5 h-5 text-amber-500" /> 모둠 역할(3인 1조)</h3><ul className="mt-4 space-y-2 text-sm text-slate-700">{ROLES.map((r) => <li key={r} className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 font-semibold">{r}</li>)}</ul><p className="text-xs text-slate-500 mt-3">차시마다 역할을 돌려 모두가 연결·코딩·AI 학습을 경험하게 합니다.</p></div>
        <div className="card p-7"><h3 className="font-black text-lg flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-emerald-500" /> 평가 관점</h3><ul className="mt-4 space-y-2 text-sm text-slate-700">{ASSESSMENT_LENSES.map((r) => <li key={r} className="flex gap-2"><span className="text-emerald-500 font-black">✓</span>{r}</li>)}</ul></div>
      </section>

      <section>
        <span className="eyebrow">Unplugged Warm-ups</span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2 flex items-center gap-2"><Puzzle className="w-7 h-7 text-fuchsia-500" /> 언플러그드 도입 활동 유형</h2>
        <p className="text-slate-500 mt-2">교구를 켜기 전, 개념을 몸으로 먼저 익히는 10~15분 놀이. 설계 결과의 수업 흐름에 단계별로 자동 추천됩니다.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {Object.entries(WARMUPS).map(([k, w]) => <div key={k} className="card-flat p-5"><b className="text-fuchsia-800">{w.title}</b><p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{w.summary}</p></div>)}
        </div>
      </section>

      <section>
        <span className="eyebrow">Project Templates</span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2">교구별 추천 프로젝트 템플릿</h2>
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          {HARDWARE.map((h) => (
            <div key={h.id} className="card overflow-hidden">
              <div className="p-5 flex items-center gap-3" style={{ background: h.gradient }}><span className="text-3xl">{h.emoji}</span><div className="text-white"><div className="font-black text-lg drop-shadow">{h.name}</div><div className="text-xs font-bold opacity-90">{h.tool}</div></div></div>
              <div className="p-5 space-y-2">
                {(TEMPLATES[h.id] || []).map((t) => (
                  <a key={t.id} href={href('/connect', { hw: h.id, idea: t.idea })} className="flex items-center gap-3 rounded-xl border border-slate-200 hover:border-slate-400 p-3 transition group">
                    <div className="flex-1"><div className="font-extrabold text-slate-800">{t.name}</div><div className="text-xs text-slate-500 mt-0.5">{t.idea}</div><div className="mt-1 flex gap-1">{t.tags.map((g) => <span key={g} className="chip text-[10px] !py-0.5">{g}</span>)}</div></div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-800 transition" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center"><a href={href('/connect')} className="btn btn-primary text-base !px-7 !py-4"><Cpu className="w-5 h-5" /> 이 구조로 수업 설계 시작</a></div>
    </div>
  );
}
