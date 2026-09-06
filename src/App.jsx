import React, { useState } from 'react';
import { Bot, Home as HomeIcon, Cpu, Plug, Compass, Menu } from 'lucide-react';
import { useRoute, href } from './lib/router.js';
import Home from './pages/Home.jsx';
import CodeConnect from './pages/CodeConnect.jsx';
import Tutorial from './pages/Tutorial.jsx';
import Guide from './pages/Guide.jsx';

const NAV = [
  { to: '/', label: '홈', icon: HomeIcon },
  { to: '/connect', label: '코드 커넥트', icon: Cpu },
  { to: '/tutorial', label: '연결 튜토리얼', icon: Plug },
  { to: '/guide', label: '수업 설계 가이드', icon: Compass },
];

export default function App() {
  const route = useRoute();
  const [menu, setMenu] = useState(false);
  const active = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to));

  let page;
  if (route.segs[0] === 'connect') page = <CodeConnect route={route} />;
  else if (route.segs[0] === 'tutorial') page = <Tutorial route={route} />;
  else if (route.segs[0] === 'guide') page = <Guide route={route} />;
  else page = <Home route={route} />;

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 glass border-b border-white/60 shadow-[0_8px_30px_-20px_rgba(11,18,32,.3)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <a href="#/" className="flex items-center gap-2.5 shrink-0" translate="no">
            <span className="bg-gradient-to-tr from-[#76b900] to-[#22c55e] p-2 rounded-xl shadow-lg shadow-lime-500/30"><Bot className="w-5 h-5 text-white" /></span>
            <span className="font-black tracking-tight text-lg leading-none whitespace-nowrap">피지컬 AI <span className="text-[#5a8d00]">코드 커넥트</span></span>
          </a>
          <div className="hidden md:flex items-center gap-1 ml-4">
            {NAV.map((n) => { const I = n.icon; return <a key={n.to} href={href(n.to)} className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${active(n.to) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}><I className="w-4 h-4" />{n.label}</a>; })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden xl:inline text-[11px] font-bold text-slate-400 tracking-wide whitespace-nowrap">서울특별시교육청 AI피지컬컴퓨팅융합교육연구회</span>
            <div className="md:hidden"><button className="btn btn-ghost !py-2 !px-2.5" onClick={() => setMenu(!menu)}><Menu className="w-5 h-5" /></button></div>
          </div>
        </div>
        {menu && <div className="md:hidden border-t border-slate-100 bg-white px-4 py-2 grid grid-cols-2 gap-1">{NAV.map((n) => <a key={n.to} href={href(n.to)} onClick={() => setMenu(false)} className={`px-3 py-2.5 rounded-xl text-sm font-bold ${active(n.to) ? 'bg-slate-900 text-white' : 'text-slate-700 bg-slate-50'}`}>{n.label}</a>)}</div>}
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-10">{page}</main>
      <footer className="max-w-7xl mx-auto px-4 pb-10 pt-6 text-xs text-slate-400 font-medium flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 mt-8">
        <span className="font-extrabold text-slate-500">피지컬 AI 코드 커넥트 · 서울특별시교육청 AI피지컬컴퓨팅융합교육연구회</span>
        <span>설계 원리: 서울특별시교육청 피지컬 AI 교육자료의 교수학습 설계 구조를 내부 지식으로 활용</span>
        <span>블록 명칭: 엔트리(entryjs) · MakeCode(makecode.microbit.org) · SPIKE 앱 공식 화면</span>
      </footer>
    </div>
  );
}
