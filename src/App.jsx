import React, { useState } from 'react';
import { Bot, Home as HomeIcon, Cpu, Plug, Compass, Menu, X } from 'lucide-react';
import { useRoute, href } from './lib/router.js';
import Home from './pages/Home.jsx';
import CodeConnect from './pages/CodeConnect.jsx';
import Tutorial from './pages/Tutorial.jsx';
import Guide from './pages/Guide.jsx';
import View from './pages/View.jsx';
import Footer from './components/Footer.jsx';

const NAV = [
  { to: '/', label: '홈', icon: HomeIcon },
  { to: '/connect', label: '코드 커넥트', icon: Cpu, primary: true },
  { to: '/tutorial', label: '연결 튜토리얼', icon: Plug, primary: true },
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
  else if (route.segs[0] === 'view') page = <View route={route} />;
  else page = <Home route={route} />;

  const linkCls = (n) => {
    if (active(n.to)) return 'bg-lime-400 text-[#0b1220] shadow-[0_6px_18px_-6px_rgba(163,230,53,.8)]';
    if (n.primary) return 'text-white hover:bg-white/10';
    return 'text-slate-400 hover:text-white hover:bg-white/10';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="topbar sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <a href="#/" className="flex items-center gap-2.5 shrink-0" translate="no">
            <span className="bg-gradient-to-tr from-[#76b900] to-[#22c55e] p-2 rounded-xl shadow-lg shadow-lime-500/30"><Bot className="w-5 h-5 text-white" /></span>
            <span className="font-black tracking-tight text-lg leading-none whitespace-nowrap text-white">피지컬 AI <span className="text-lime-300">코드 커넥트</span></span>
          </a>
          <div className="hidden md:flex items-center gap-1 ml-6">
            {NAV.map((n) => { const I = n.icon; return <a key={n.to} href={href(n.to)} className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${linkCls(n)}`}><I className="w-4 h-4" />{n.label}</a>; })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden xl:inline text-[11px] font-bold text-slate-400 tracking-wide whitespace-nowrap">서울특별시교육청 AI피지컬컴퓨팅융합교육연구회</span>
            <div className="md:hidden"><button className="w-10 h-10 rounded-xl grid place-items-center text-white hover:bg-white/10" onClick={() => setMenu(!menu)} aria-label="메뉴">{menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button></div>
          </div>
        </div>
        {menu && <div className="md:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-1.5">{NAV.map((n) => { const I = n.icon; return <a key={n.to} href={href(n.to)} onClick={() => setMenu(false)} className={`px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 ${active(n.to) ? 'bg-lime-400 text-[#0b1220]' : 'text-white bg-white/5'}`}><I className="w-4 h-4" />{n.label}</a>; })}</div>}
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-10 w-full flex-1">{page}</main>
      <Footer />
    </div>
  );
}
