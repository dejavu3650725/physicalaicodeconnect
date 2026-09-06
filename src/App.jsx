import React, { useState } from 'react';
import { Bot, Home as HomeIcon, Cpu, Plug, BookOpen, Puzzle, KeyRound, X, Menu } from 'lucide-react';
import { useRoute, href } from './lib/router.js';
import Home from './pages/Home.jsx';
import CodeConnect from './pages/CodeConnect.jsx';
import Tutorial from './pages/Tutorial.jsx';
import Library from './pages/Library.jsx';
import Unplugged from './pages/Unplugged.jsx';
import { aiMode, getLocalApiKey, setLocalApiKey } from './lib/ai.js';

const NAV = [
  { to: '/', label: '홈', icon: HomeIcon },
  { to: '/connect', label: '코드 커넥트', icon: Cpu },
  { to: '/tutorial', label: '연결 튜토리얼', icon: Plug },
  { to: '/library', label: '교육청 자료실', icon: BookOpen },
  { to: '/unplugged', label: '언플러그드', icon: Puzzle },
];

function SettingsModal({ onClose }) {
  const [key, setKey] = useState(getLocalApiKey());
  const mode = aiMode();
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-lg pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold text-lg flex items-center gap-2"><KeyRound className="w-5 h-5 text-amber-500" /> AI 연결 설정</h3><button onClick={onClose}><X className="w-5 h-5" /></button></div>
        <p className="text-sm text-slate-600 leading-relaxed">현재 모드: <b>{mode.label}</b>. 배포 서버(Vercel)에 <code className="kbd">GEMINI_API_KEY</code>가 등록되어 있으면 키를 입력하지 않아도 됩니다. 연구회 선생님이 개인 Gemini API 키(무료)를 쓰고 싶다면 아래에 입력하세요. 키는 <b>이 브라우저에만</b> 저장되고 서버로 전송되지 않습니다.</p>
        <input className="input mt-4 font-mono text-sm" placeholder="AIza… (Google AI Studio에서 발급)" value={key} onChange={(e) => setKey(e.target.value)} />
        <div className="flex justify-between items-center mt-4 gap-2">
          <a className="text-xs text-sky-600 font-semibold underline" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">API 키 발급받기 ↗</a>
          <div className="flex gap-2">
            <button className="btn btn-ghost !py-2" onClick={() => { setLocalApiKey(''); setKey(''); }}>삭제</button>
            <button className="btn btn-primary !py-2" onClick={() => { setLocalApiKey(key); onClose(); }}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const route = useRoute();
  const [showSettings, setShowSettings] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to));

  let page;
  if (route.segs[0] === 'connect') page = <CodeConnect route={route} />;
  else if (route.segs[0] === 'tutorial') page = <Tutorial route={route} />;
  else if (route.segs[0] === 'library') page = <Library route={route} />;
  else if (route.segs[0] === 'unplugged') page = <Unplugged route={route} />;
  else page = <Home route={route} />;

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <a href="#/" className="flex items-center gap-2.5 shrink-0" translate="no">
            <span className="bg-gradient-to-tr from-[#76b900] to-[#22c55e] p-2 rounded-xl shadow-lg shadow-lime-500/30"><Bot className="w-5 h-5 text-white" /></span>
            <span className="font-black tracking-tight text-lg leading-none whitespace-nowrap">피지컬 AI <span className="text-[#5a8d00]">코드 커넥트</span></span>
          </a>
          <div className="hidden md:flex items-center gap-1 ml-4">
            {NAV.map((n) => { const I = n.icon; return <a key={n.to} href={href(n.to)} className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${active(n.to) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}><I className="w-4 h-4" />{n.label}</a>; })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden xl:inline text-[11px] font-bold text-slate-400 tracking-wide whitespace-nowrap">서울시교육청 AI·피지컬컴퓨팅융합교육연구회</span>
            <button onClick={() => setShowSettings(true)} className="btn btn-ghost !py-2 !px-3 text-xs whitespace-nowrap" title="AI 연결 설정"><KeyRound className="w-4 h-4" /><span className="hidden sm:inline">AI 설정</span></button>
            <div className="md:hidden"><button className="btn btn-ghost !py-2 !px-2.5" onClick={() => setMenu(!menu)}><Menu className="w-5 h-5" /></button></div>
          </div>
        </div>
        {menu && <div className="md:hidden border-t border-slate-100 bg-white px-4 py-2 grid grid-cols-2 gap-1">{NAV.map((n) => <a key={n.to} href={href(n.to)} onClick={() => setMenu(false)} className={`px-3 py-2.5 rounded-xl text-sm font-bold ${active(n.to) ? 'bg-slate-900 text-white' : 'text-slate-700 bg-slate-50'}`}>{n.label}</a>)}</div>}
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-10">{page}</main>
      <footer className="max-w-7xl mx-auto px-4 pb-10 pt-6 text-xs text-slate-400 font-medium flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 mt-8">
        <span>피지컬 AI 코드 커넥트 v2 · 서울특별시교육청 AI정보교육연구회(AI·피지컬컴퓨팅융합교육연구회)</span>
        <span>교육 자료 출처: 서울특별시교육청 『피지컬 AI 원리를 활용한 문제해결 프로젝트 자료집』, 『놀이로 경험하는 디지털 세상 언플러그드 학습가이드 지도자료』</span>
        <span>블록 명칭 출처: 엔트리(entryjs) · MakeCode(makecode.microbit.org) · SPIKE 앱 공식 화면</span>
      </footer>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
