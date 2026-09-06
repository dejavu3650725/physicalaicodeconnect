// ============================================================
// 하드웨어 프로필 — 코드 커넥트/튜토리얼/설계 가이드가 공통으로 참조
// ============================================================
export const HARDWARE = [
  {
    id: 'hamster', name: '햄스터 로봇', short: '햄스터', emoji: '🐹', vendor: '로보메이션',
    color: '#f59e0b', color2: '#fbbf24', gradient: 'linear-gradient(135deg,#f59e0b,#f97316)',
    tagline: '바닥·근접 센서와 LED, 버저를 가진 손바닥 크기 로봇. 엔트리로 바로 코딩.',
    tool: '엔트리', variants: [
      { key: 'entry-hamster', label: '햄스터(기본)', hwName: '햄스터' },
      { key: 'entry-hamster-s', label: '햄스터S', hwName: '햄스터S' },
    ],
    defaultPlatform: 'entry-hamster',
    connection: 'USB 블루투스 동글 + 엔트리 하드웨어 연결 프로그램',
    sensors: ['왼쪽/오른쪽 근접 센서(0~255)', '왼쪽/오른쪽 바닥 센서(0~100)', '3축 가속도', '밝기', '온도', '신호 세기', '확장 포트 입력 A/B'],
    actuators: ['왼쪽/오른쪽 바퀴(-100~100%)', '왼쪽/오른쪽 LED(7색, S는 RGB)', '버저·음계 연주(S는 효과음 15종)', '말판 이동·선 따라가기', '확장 포트 출력 A/B·집게'],
    limits: '카메라·마이크·스피커(음성)·GPS·팔·프로펠러 없음. 카메라/음성 기능은 PC의 엔트리 인공지능 블록(비디오 감지, 음성 인식, 모델 학습)으로 대신한다.',
    aiHow: '엔트리 [인공지능] 블록 — 비디오 감지(손·얼굴·사람·사물 인식), 음성 인식/읽어주기, 모델 학습(이미지·텍스트·소리 분류)을 PC 카메라/마이크로 처리하고 결과에 따라 햄스터를 제어.',
    ideas: ['손 모양으로 조종하는 햄스터 자동차', '표지판을 인식해 자율주행하는 AI 자동차', '음성 명령 심부름 로봇', '검은 선을 따라가는 배달 로봇', '장애물을 피하는 청소 로봇', '밝기에 따라 LED가 켜지는 야간 등'],
    curriculum: [],
    aiMethods: [
      { name: '엔트리 인공지능 블록', tag: 'PC 카메라·마이크', how: '비디오 감지(손·얼굴·사람·사물), 음성 인식·읽어주기 결과로 햄스터를 제어' },
      { name: '엔트리 모델 학습', tag: '이미지·텍스트·소리 분류', how: '학생이 직접 학습시킨 분류 모델의 결과(클래스·신뢰도)로 동작 분기' },
    ],
    tutorial: 'hamster',
  },
  {
    id: 'microbit', name: '마이크로비트 v2', short: '마이크로비트', emoji: '⌚', vendor: 'Micro:bit 교육재단',
    color: '#e11d48', color2: '#fb7185', gradient: 'linear-gradient(135deg,#e11d48,#7c3aed)',
    tagline: '스마트워치 세트로 손목에 차는 컴퓨터. 25 LED·가속도·마이크·스피커·라디오 내장. 메이크코드로 코딩.',
    tool: '메이크코드', variants: [{ key: 'makecode-microbit', label: '마이크로비트 v2 (메이크코드)', hwName: 'micro:bit V2' }],
    defaultPlatform: 'makecode-microbit',
    connection: 'micro USB → MICROBIT 드라이브에 .hex 복사 또는 WebUSB 원클릭 다운로드',
    sensors: ['버튼 A/B', '터치 로고(V2)', '가속도(흔들림·기울임·자유낙하 제스처)', '나침반(자기)', '온도', '빛 밝기(LED 이용)', '마이크·소리 크기(V2)', '핀 P0/P1/P2 입력'],
    actuators: ['5×5 LED 매트릭스(아이콘·문자·그래프)', '스피커(V2)·음악', '라디오 송수신(2.4GHz)', '핀 디지털/아날로그/서보 출력'],
    limits: '카메라·GPS·모터 없음(모터는 확장보드 필요). 스마트워치 세트 = 마이크로비트 v2 + 손목 스트랩/케이스 + 배터리(AAA×2 또는 코인셀). AI는 PC/앱과 연결해 처리.',
    aiHow: '① microbit.org CreateAI(동작 데이터 학습 → 제스처 인식 모델을 마이크로비트에 탑재) ② 엔트리와 마이크로비트를 연결해 엔트리 AI 블록(이미지·음성)과 결합(초등 초급 과정 방식) ③ 티처블 머신 + 블루투스(boundaryX, 중·고급 과정 방식).',
    ideas: ['걸음 수를 세는 스마트워치(만보기)', '체온·주변 온도 알림 밴드', '흔들면 가위바위보', '친구와 라디오로 비밀 메시지', '소리가 커지면 경고하는 소음 측정기', '나침반 방향 안내 시계'],
    curriculum: [],
    aiMethods: [
      { name: 'microbit.org CreateAI', tag: '기기 탑재 · 초등 추천', how: '흔들기·걷기 같은 동작 데이터를 모아 학습 → 제스처 인식 모델을 마이크로비트에 직접 넣기' },
      { name: '엔트리 + 마이크로비트', tag: 'PC 카메라·마이크', how: '엔트리에 연결해 엔트리 AI 블록(이미지·음성 인식) 결과를 LED·소리로 출력' },
      { name: '티처블 머신 + 블루투스', tag: '중·고급', how: 'PC에서 학습한 모델 결과를 블루투스(boundaryX)로 마이크로비트에 전송' },
    ],
    tutorial: 'microbit',
  },
  {
    id: 'tory', name: '토리 드론', short: '토리드론', emoji: '🛸', vendor: '잇플(ITPLE)',
    color: '#0ea5e9', color2: '#38bdf8', gradient: 'linear-gradient(135deg,#0ea5e9,#2563eb)',
    tagline: '안전망 가드가 있는 교육용 코딩 드론. 엔트리·파이썬 호환, 조종기를 USB로 PC에 연결.',
    tool: '엔트리', variants: [{ key: 'entry-tory', label: '토리드론 (엔트리)', hwName: '토리드론' }],
    defaultPlatform: 'entry-tory',
    connection: '잇플 자료실 Entry_Alux(엔트리 토리드론) 설치 → 조종기 USB 연결 → 하드웨어 › 연결 프로그램 열기 › 토리드론 선택 (또는 엔트리 하드웨어 프로그램에서 바이로봇 배틀 드론)',
    sensors: ['각도 Roll/Pitch/Yaw', '가속도 x/y/z · 각속도 Roll/Pitch/Yaw', '위치 X/Y/Z(옵티컬 플로우)', '해발고도(기압)', '비행 동작 상태·비행 제어 모드·이동 상태·Headless·센서 방향', '배터리(%)'],
    actuators: ['드론 이륙/착륙/정지·센서 초기화·방향 초기화·Headless', '앞/뒤/오른쪽/왼쪽/위/아래로 m 이동, 시계/반시계 방향 회전(도)', 'Roll/Pitch/Yaw/Throttle % 정하기·초 실행', '드론 LED(13색·켜기/깜빡임/무지개/RGB)', '조종기 버저 연주·진동'],
    limits: '카메라 없음(영상 인식은 PC 카메라 + 엔트리 AI 블록). 배터리 3.7V 300mAh로 비행 시간이 짧다. 실내 비행 시 무늬 있는 바닥, 2m 이하 고도, 안전 거리 필수.',
    aiHow: '엔트리 [인공지능] 블록(손 모양·얼굴·음성 인식, 모델 학습)으로 PC 카메라/마이크 입력을 판단하고 드론 동작(이륙·이동·LED)을 제어. 파이썬은 CodingRider 라이브러리.',
    ideas: ['손 모양으로 이륙·착륙하는 드론', '음성 명령 "올라가" 드론', '색 카드 학습으로 방향을 바꾸는 배달 드론', '장애물(정면 거리) 감지 자동 정지', '고도 유지 비행 실험', 'LED 신호로 소통하는 구조 드론'],
    curriculum: [],
    aiMethods: [
      { name: '엔트리 인공지능 블록', tag: 'PC 카메라·마이크', how: '손 모양·얼굴·음성 인식 결과로 이륙·이동·LED를 제어' },
      { name: '엔트리 모델 학습', tag: '이미지 분류', how: '색 카드·표지판을 학습시켜 인식 결과에 따라 비행 방향 결정' },
      { name: '파이썬 CodingRider', tag: '텍스트 코딩', how: '엔트리 블록과 1:1로 대응하는 CodingRider 라이브러리로 확장' },
    ],
    tutorial: 'tory',
    caution: '블록 명칭은 잇플 교재 『엔트리 인공지능과 함께하는 토리드론』 화면을 기준으로 정리했습니다. 조종기 전원 버튼으로 조종기 모드↔코딩 모드가 바뀌므로, 엔트리로 제어할 때는 코딩 모드인지 확인하세요.',
  },
  {
    id: 'spike', name: '레고 스파이크 프라임', short: '스파이크', emoji: '🧱', vendor: 'LEGO Education',
    color: '#facc15', color2: '#fde047', gradient: 'linear-gradient(135deg,#f5b400,#e11d48)',
    tagline: '허브·모터·컬러/거리/힘 센서로 로봇을 조립하고 스파이크 앱(워드블록/파이썬)으로 코딩.',
    tool: '스파이크 앱', variants: [{ key: 'spike-prime', label: '스파이크 프라임 (SPIKE 앱 3.x)', hwName: 'SPIKE Prime' }],
    defaultPlatform: 'spike-prime',
    connection: 'SPIKE 앱 설치 → 허브 전원 → USB 또는 블루투스 연결 → 허브 OS 업데이트',
    sensors: ['컬러 센서(색상·반사광)', '거리 센서(초음파, cm)', '힘 센서(눌림·세기)', '허브 자이로(요/피치/롤)·기울기·제스처', '허브 왼쪽/오른쪽 버튼', '모터 각도 위치'],
    actuators: ['중형/대형 모터(회전·각도·위치)', '드라이빙 베이스 이동·조향', '5×5 라이트 매트릭스·전원 버튼 LED', '허브 스피커 비프음', '거리 센서 라이트'],
    limits: '카메라·마이크 없음(AI는 PC 카메라의 "AI 이거다" 확장 또는 허스키렌즈 카메라 모듈로). 모터 포트 A~F 6개.',
    aiHow: '① "AI 이거다"(PC 카메라 이미지/자세/얼굴 분류 모델을 SPIKE 앱 확장 블록으로 연결) ② HuskyLens AI 카메라(색·얼굴·물체 추적)를 허브에 연결.',
    ideas: ['쓰레기 종류를 인식해 분류하는 수거 로봇', '손 모양으로 조종하는 로봇팔', '검은 선을 따라가는 스마트 모빌리티', '장애물 앞에서 멈추는 자율주행차', '표정을 읽는 반려 로봇', '마스크 인식 출입 차단기'],
    curriculum: [],
    aiMethods: [
      { name: '"AI 이거다" 확장', tag: 'PC 카메라', how: '이미지·자세·얼굴 분류 모델을 SPIKE 앱 확장 블록으로 연결해 모터·라이트 제어' },
      { name: 'HuskyLens AI 카메라', tag: '카메라 모듈', how: '색·얼굴·물체 추적 결과를 허브가 직접 읽어 판단' },
    ],
    tutorial: 'spike',
  },
];

export const HARDWARE_MAP = Object.fromEntries(HARDWARE.map((h) => [h.id, h]));
export const LEVELS = [
  { key: 'basic', name: '기초', sub: '기본 제어', emoji: '🌱', desc: '움직임·출력 중심의 순차 구조', full: '🌱 기초 (기본 제어)', color: '#16a34a', soft: '#dcfce7' },
  { key: 'standard', name: '기본', sub: '센서와 데이터', emoji: '🚀', desc: '센서 값에 따라 판단하는 반복·조건 구조', full: '🚀 기본 (센서와 데이터)', color: '#2563eb', soft: '#dbeafe' },
  { key: 'advanced', name: '심화', sub: '인공지능 융합', emoji: '🔥', desc: 'AI 인식·학습 모델과 결합한 융합 프로젝트', full: '🔥 심화 (인공지능 융합)', color: '#ea580c', soft: '#ffedd5' },
];
