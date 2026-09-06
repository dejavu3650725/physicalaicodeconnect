import React from 'react';

/* 튜토리얼용 인라인 SVG 일러스트. 단순한 도형 + 애니메이션으로 상태(깜빡임/켜짐)를 표현 */
const Blink = ({ cx, cy, r = 5, color = '#38bdf8', speed = '0.5s', steady = false }) => (
  <circle cx={cx} cy={cy} r={r} fill={color} style={steady ? { filter: 'drop-shadow(0 0 6px ' + color + ')' } : { animation: `blink ${speed} steps(2) infinite`, filter: 'drop-shadow(0 0 6px ' + color + ')' }} />
);

function Laptop({ x = 0, y = 0, screen, children }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="180" height="110" rx="10" fill="#1e293b" />
      <rect x="8" y="8" width="164" height="94" rx="6" fill="#0f172a" />
      {screen}
      <rect x="-14" y="110" width="208" height="12" rx="6" fill="#334155" />
      {children}
    </g>
  );
}

function Hamster({ x = 0, y = 0, led = null }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="10" width="90" height="70" rx="18" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
      <rect x="-8" y="30" width="12" height="36" rx="4" fill="#334155" /><rect x="86" y="30" width="12" height="36" rx="4" fill="#334155" />
      <circle cx="28" cy="38" r="7" fill="#0f172a" /><circle cx="62" cy="38" r="7" fill="#0f172a" />
      <circle cx="28" cy="38" r="2.5" fill="#fff" /><circle cx="62" cy="38" r="2.5" fill="#fff" />
      <rect x="35" y="58" width="20" height="8" rx="4" fill="#92400e" />
      {led && <><Blink cx={14} cy={20} r={4} color={led} steady /><Blink cx={76} cy={20} r={4} color={led} steady /></>}
    </g>
  );
}

function Dongle({ x = 0, y = 0, state = 'blink' }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="16" height="34" rx="3" fill="#94a3b8" />
      <rect x="2" y="-10" width="12" height="12" fill="#cbd5e1" />
      {state === 'off' ? <circle cx="8" cy="24" r="3.5" fill="#334155" /> : <Blink cx={8} cy={24} r={3.5} color="#38bdf8" speed="0.35s" steady={state === 'on'} />}
    </g>
  );
}

function Microbit({ x = 0, y = 0, icon = 'heart', back = false, yellow = false }) {
  const heart = [[1, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [2, 2], [3, 2], [2, 3]];
  const on = icon === 'heart' ? heart : icon === 'zero' ? [[1, 0], [2, 0], [3, 0], [1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3], [1, 4], [2, 4], [3, 4]] : [];
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="130" height="104" rx="8" fill="#111827" stroke="#374151" strokeWidth="2" />
      {!back && <>
        <rect x="12" y="34" width="18" height="18" rx="3" fill="#374151" /><text x="21" y="31" fontSize="8" fill="#e5e7eb" textAnchor="middle" fontWeight="700">A</text>
        <rect x="100" y="34" width="18" height="18" rx="3" fill="#374151" /><text x="109" y="31" fontSize="8" fill="#e5e7eb" textAnchor="middle" fontWeight="700">B</text>
        {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => <rect key={`${r}${c}`} x={44 + c * 9} y={28 + r * 9} width="6" height="6" rx="1" fill={on.some(([a, b]) => a === c && b === r) ? '#f43f5e' : '#27272a'} style={on.some(([a, b]) => a === c && b === r) ? { filter: 'drop-shadow(0 0 3px #f43f5e)' } : {}} />))}
        <ellipse cx="65" cy="12" rx="9" ry="6" fill="none" stroke="#fbbf24" strokeWidth="2" />
        {['0', '1', '2', '3V', 'GND'].map((t, i) => <g key={t}><rect x={6 + i * 26} y="86" width="20" height="16" rx="2" fill="#d4a017" /><text x={16 + i * 26} y="98" fontSize="7" textAnchor="middle" fill="#3b2a00" fontWeight="800">{t}</text></g>)}
      </>}
      {back && <>
        <rect x="52" y="4" width="26" height="10" rx="2" fill="#94a3b8" />
        <circle cx="65" cy="50" r="9" fill="#374151" stroke="#9ca3af" strokeWidth="2" /><text x="65" y="70" fontSize="7" fill="#e5e7eb" textAnchor="middle">RESET / 전원</text>
        <Blink cx={22} cy={14} r={3.5} color="#ef4444" speed="2s" steady />
        {yellow ? <Blink cx={108} cy={14} r={3.5} color="#facc15" speed="0.25s" /> : <circle cx="108" cy="14" r="3.5" fill="#3f3f46" />}
        <text x="22" y="26" fontSize="6" fill="#cbd5e1" textAnchor="middle">전원</text><text x="108" y="26" fontSize="6" fill="#cbd5e1" textAnchor="middle">USB 통신</text>
        <rect x="20" y="82" width="90" height="12" rx="3" fill="#0f172a" stroke="#475569" /><text x="65" y="91" fontSize="7" fill="#cbd5e1" textAnchor="middle">배터리 JST 단자</text>
      </>}
    </g>
  );
}

function Drone({ x = 0, y = 0, led = '#22c55e', spin = false }) {
  const prop = (px, py) => (<g key={px + '' + py} transform={`translate(${px},${py})`}><circle r="18" fill="none" stroke="#f472b6" strokeWidth="3" /><ellipse rx="14" ry="3" fill="#64748b" style={spin ? { animation: 'spin 0.4s linear infinite', transformOrigin: 'center' } : {}} /><circle r="3" fill="#0f172a" /></g>);
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1="20" y1="20" x2="100" y2="80" stroke="#334155" strokeWidth="6" /><line x1="100" y1="20" x2="20" y2="80" stroke="#334155" strokeWidth="6" />
      {prop(20, 20)}{prop(100, 20)}{prop(20, 80)}{prop(100, 80)}
      <rect x="42" y="34" width="36" height="32" rx="8" fill="#0ea5e9" stroke="#0369a1" strokeWidth="2" />
      <Blink cx={60} cy={50} r={5} color={led} steady />
    </g>
  );
}

function Controller({ x = 0, y = 0, text = 'LINK' }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="120" height="70" rx="16" fill="#1e293b" />
      <rect x="35" y="10" width="50" height="22" rx="4" fill="#0f172a" stroke="#38bdf8" /><text x="60" y="25" fontSize="10" fill="#7dd3fc" textAnchor="middle" fontWeight="800">{text}</text>
      <circle cx="22" cy="48" r="11" fill="#475569" /><circle cx="98" cy="48" r="11" fill="#475569" />
      <circle cx="22" cy="48" r="5" fill="#94a3b8" /><circle cx="98" cy="48" r="5" fill="#94a3b8" />
    </g>
  );
}

function Hub({ x = 0, y = 0, bt = false, ports = false }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="90" height="120" rx="12" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
      {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => <rect key={`${r}${c}`} x={22 + c * 10} y={26 + r * 10} width="7" height="7" rx="1" fill={(r === 1 && (c === 1 || c === 3)) || (r === 3 && c >= 1 && c <= 3) ? '#fff' : '#eab308'} />))}
      <circle cx="45" cy="90" r="9" fill="#fff" stroke="#ca8a04" strokeWidth="2" />
      <rect x="10" y="84" width="10" height="12" rx="2" fill="#ca8a04" /><rect x="70" y="84" width="10" height="12" rx="2" fill="#ca8a04" />
      <Blink cx={45} cy={12} r={4} color={bt ? '#38bdf8' : '#94a3b8'} speed="0.5s" steady={!bt} />
      {ports && ['A', 'B', 'C', 'D', 'E', 'F'].map((p, i) => <g key={p}><rect x={i < 3 ? -14 : 90} y={20 + (i % 3) * 30} width="14" height="18" rx="2" fill="#1f2937" /><text x={i < 3 ? -7 : 97} y={33 + (i % 3) * 30} fontSize="8" fill="#fde68a" textAnchor="middle" fontWeight="800">{p}</text></g>)}
    </g>
  );
}

const Screen = ({ lines = [], accent = '#76b900' }) => (
  <g>
    <rect x="8" y="8" width="164" height="14" fill={accent} opacity=".9" />
    {lines.map((l, i) => <text key={i} x="16" y={38 + i * 15} fontSize={i === 0 ? 10 : 8.5} fill={i === 0 ? '#fff' : '#cbd5e1'} fontWeight={i === 0 ? 800 : 600}>{l}</text>)}
  </g>
);

export default function Visual({ id }) {
  const W = 420, H = 190;
  let scene = null;
  switch (id) {
    case 'hamster-kit': scene = <><Hamster x={40} y={60} /><Dongle x={170} y={80} state="off" /><Laptop x={220} y={30} screen={<Screen lines={['Chrome', 'playentry.org']} />} /></>; break;
    case 'hamster-dongle': scene = <><Laptop x={40} y={30} screen={<Screen lines={['드라이버 설치 중…', '10~30초 기다리기']} />} /><Dongle x={236} y={90} state="blink" /><text x="244" y="170" fontSize="11" fontWeight="800" fill="#0ea5e9" textAnchor="middle">빠르게 깜빡임 = 로봇 찾는 중</text><Hamster x={300} y={60} /></>; break;
    case 'hamster-pair': scene = <><Laptop x={20} y={30} screen={<Screen lines={['연결 대기…']} />} /><Dongle x={216} y={90} state="on" /><path d="M235 100 q30 -40 60 0" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="4 4" /><text x="262" y="50" fontSize="11" fontWeight="800" fill="#0ea5e9" textAnchor="middle">15cm 이내</text><Hamster x={290} y={70} led="#22c55e" /><text x="224" y="170" fontSize="11" fontWeight="800" fill="#16a34a" textAnchor="middle">계속 켜짐 = 연결 완료</text></>; break;
    case 'entry-hw': scene = <><Laptop x={60} y={30} screen={<Screen lines={['엔트리 하드웨어 연결 프로그램', '검색: 햄스터', '▸ 햄스터   ▸ 햄스터S', '[연결 프로그램 열기]']} />} /><Dongle x={280} y={90} state="on" /><Hamster x={310} y={60} /></>; break;
    case 'entry-ok': scene = <><Laptop x={60} y={30} screen={<Screen lines={['✔ 연결 성공', '하드웨어 ▸ 햄스터 블록', '삐 소리내기 / 앞으로 1초']} accent="#22c55e" />} /><Hamster x={300} y={60} led="#22c55e" /><text x="345" y="160" fontSize="12" fill="#f59e0b" fontWeight="900">♪ 삐!</text></>; break;
    case 'tips': scene = <><Hamster x={30} y={60} led="#22c55e" /><Hamster x={150} y={60} led="#22c55e" /><Hamster x={270} y={60} led="#22c55e" />{[60, 180, 300].map((x, i) => <g key={x}><circle cx={x + 15} cy="50" r="12" fill="#fff" stroke="#f59e0b" strokeWidth="2" /><text x={x + 15} y="54" fontSize="11" fontWeight="900" textAnchor="middle" fill="#b45309">{i + 1}</text></g>)}<text x="210" y="170" fontSize="11" fontWeight="800" fill="#475569" textAnchor="middle">로봇·동글 번호 스티커로 짝 맞추기</text></>; break;
    case 'microbit-kit': scene = <><Microbit x={40} y={40} icon="heart" /><rect x="190" y="70" width="60" height="30" rx="6" fill="#334155" /><text x="220" y="89" fontSize="9" fill="#e2e8f0" textAnchor="middle" fontWeight="800">AAA×2</text><path d="M250 85 h30" stroke="#ef4444" strokeWidth="3" /><rect x="290" y="45" width="100" height="90" rx="14" fill="#1e293b" opacity=".9" /><rect x="300" y="55" width="80" height="70" rx="10" fill="#0f172a" /><rect x="270" y="80" width="20" height="18" rx="4" fill="#475569" /><rect x="390" y="80" width="20" height="18" rx="4" fill="#475569" /><text x="340" y="160" fontSize="11" fontWeight="800" fill="#475569" textAnchor="middle">시계 케이스 + 스트랩</text></>; break;
    case 'microbit-usb': scene = <><Laptop x={40} y={30} screen={<Screen lines={['파일 탐색기', '▸ 로컬 디스크 (C:)', '▸ MICROBIT (E:)  ◀ 여기!']} accent="#1E90FF" />} /><path d="M225 90 h40" stroke="#94a3b8" strokeWidth="4" /><Microbit x={270} y={40} icon="none" /></>; break;
    case 'makecode': scene = <><Laptop x={40} y={20} screen={<Screen lines={['makecode.microbit.org', '⚙ 언어 → 한국어', '시작하면 ┐', '  아이콘 출력 ♥']} accent="#1E90FF" />} /><Microbit x={270} y={40} icon="heart" /></>; break;
    case 'microbit-flash': scene = <><Laptop x={30} y={30} screen={<Screen lines={['microbit-이름없음.hex', '→ MICROBIT 드라이브로 드래그']} accent="#1E90FF" />} /><path d="M215 90 h45" stroke="#facc15" strokeWidth="4" strokeDasharray="6 6" style={{ animation: 'dash 1s linear infinite' }} /><Microbit x={270} y={40} back yellow /><text x="335" y="165" fontSize="11" fontWeight="800" fill="#ca8a04" textAnchor="middle">노란 LED 깜빡 = 쓰는 중</text></>; break;
    case 'webusb': scene = <><Laptop x={40} y={30} screen={<Screen lines={['… → 장치 연결', 'BBC micro:bit CMSIS-DAP', '[연결]']} accent="#1E90FF" />} /><path d="M225 90 h40" stroke="#22c55e" strokeWidth="4" /><Microbit x={270} y={40} icon="heart" /></>; break;
    case 'microbit-wear': scene = <><Microbit x={60} y={40} icon="zero" /><rect x="200" y="60" width="60" height="30" rx="6" fill="#334155" /><text x="230" y="79" fontSize="9" fill="#e2e8f0" textAnchor="middle" fontWeight="800">배터리</text><text x="330" y="80" fontSize="40" textAnchor="middle">🚶</text><text x="330" y="130" fontSize="11" fontWeight="800" fill="#475569" textAnchor="middle">흔들림 감지될 때 → steps +1</text></>; break;
    case 'drone-safety': scene = <><Drone x={60} y={40} led="#22c55e" /><text x="260" y="70" fontSize="30">🧍</text><path d="M180 100 h70" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" /><text x="215" y="90" fontSize="11" fontWeight="900" fill="#ef4444" textAnchor="middle">2m 이상</text><rect x="20" y="150" width="380" height="14" rx="3" fill="url(#pat)" /><text x="210" y="182" fontSize="11" fontWeight="800" fill="#475569" textAnchor="middle">무늬 있는 바닥 · 고도 1.5m 이하</text></>; break;
    case 'drone-pair': scene = <><Drone x={40} y={40} led="#38bdf8" /><path d="M170 90 q40 -50 80 0" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="4 4" /><Controller x={250} y={60} text="PAIRING" /></>; break;
    case 'drone-flat': scene = <><rect x="40" y="130" width="340" height="8" rx="2" fill="#94a3b8" /><Drone x={150} y={30} led="#facc15" /><Controller x={290} y={50} text="SENSOR RESET" /><text x="210" y="170" fontSize="11" fontWeight="800" fill="#475569" textAnchor="middle">평평한 곳에 두고 초기화 → 드리프트 예방</text></>; break;
    case 'drone-usb': scene = <><Laptop x={30} y={30} screen={<Screen lines={['장치 관리자', '▸ 포트 (COM & LPT)', '  USB-SERIAL CH340 (COM3)']} accent="#0ea5e9" />} /><path d="M215 100 h50" stroke="#94a3b8" strokeWidth="4" /><Controller x={270} y={65} text="LINK" /></>; break;
    case 'drone-fly': scene = <><Drone x={150} y={20} led="#22c55e" spin /><text x="210" y="150" fontSize="11" fontWeight="800" fill="#475569" textAnchor="middle">이륙 → 2초 기다리기 → 착륙</text><Controller x={300} y={90} text="LINK" /></>; break;
    case 'spike-app': scene = <><Laptop x={40} y={30} screen={<Screen lines={['SPIKE 앱', '새 프로젝트 ▸ 워드블록 / Python']} accent="#facc15" />} /><Hub x={290} y={35} /></>; break;
    case 'spike-hub': scene = <><Laptop x={30} y={30} screen={<Screen lines={['허브 연결', '▸ USB   ▸ Bluetooth', '● SPIKE 허브 찾음']} accent="#facc15" />} /><Hub x={290} y={35} bt /><text x="335" y="175" fontSize="11" fontWeight="800" fill="#0284c7" textAnchor="middle">블루투스 버튼 → 깜빡임</text></>; break;
    case 'spike-update': scene = <><Laptop x={30} y={30} screen={<Screen lines={['허브 업데이트 중… 62%', '케이블을 빼지 마세요']} accent="#facc15" />} /><path d="M215 90 h60" stroke="#94a3b8" strokeWidth="4" /><Hub x={290} y={35} /></>; break;
    case 'spike-ports': scene = <><Hub x={165} y={35} ports /><text x="60" y="60" fontSize="10" fontWeight="800" fill="#475569">A 거리 센서</text><text x="60" y="90" fontSize="10" fontWeight="800" fill="#475569">B 컬러 센서</text><text x="60" y="120" fontSize="10" fontWeight="800" fill="#475569">C 왼쪽 모터</text><text x="290" y="60" fontSize="10" fontWeight="800" fill="#475569">D 오른쪽 모터</text><text x="290" y="90" fontSize="10" fontWeight="800" fill="#475569">E 로봇팔 모터</text><text x="290" y="120" fontSize="10" fontWeight="800" fill="#475569">F (예비)</text></>; break;
    case 'spike-run': scene = <><Hub x={60} y={35} /><text x="220" y="100" fontSize="30">➡️</text><text x="300" y="95" fontSize="36">🤖</text><text x="260" y="165" fontSize="11" fontWeight="800" fill="#475569" textAnchor="middle">↑ 방향으로 10 cm 만큼 움직이기</text></>; break;
    default: scene = <text x="210" y="100" fontSize="40" textAnchor="middle">🛠️</text>;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200" role="img">
      <defs><pattern id="pat" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#e2e8f0" /><circle cx="6" cy="6" r="2" fill="#94a3b8" /></pattern></defs>
      <style>{`@keyframes blink{50%{opacity:.15}} @keyframes spin{to{transform:rotate(180deg)}} @keyframes dash{to{stroke-dashoffset:-24}}`}</style>
      {scene}
    </svg>
  );
}
