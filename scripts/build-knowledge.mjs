// 교육청 배포 자료(knowledge-source/, 저장소 미포함) → 앱 내부 설계 지식베이스(src/data/knowledge.json)
// 원문을 노출하지 않고, 수업 설계 원리(단계 흐름·알고리즘 패턴·평가 관점·안전·센서-AI-출력 흐름)만 구조화한다.
import fs from 'node:fs';
import path from 'node:path';
const SRC = 'knowledge-source/curriculum';
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.json'));
const short = (s, n = 90) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, n) : '');
const stageKey = (s) => /Tinker|분석|기초/i.test(s) ? 'tinkering' : /Shar|공유/i.test(s) ? 'sharing' : /Improv|개선/i.test(s) ? 'improving' : /Making|만들기/i.test(s) ? 'making' : 'making';
const projects = [];
for (const f of files) {
  const c = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
  projects.push({
    id: c.id, hardware: c.hardware, level: c.level, software: c.software,
    theme: short(c.title, 40), goal: short((c.goals || [])[0], 120),
    stages: (c.sessions || []).map((s) => ({ no: String(s.no), key: stageKey(s.stage || ''), focus: (s.contents || []).map((x) => short(x.title.replace(/^내용 주제\d*:\s*/, ''), 60)), tools: (s.tools || []).slice(0, 4) })),
    algorithm: (c.algorithm || []).map((a) => ({ step: a.step, process: short(a.process, 40), detail: short(a.detail, 110) })),
    flow: c.prologue?.flow || null,
    sensors: c.sensorsUsed || [], ai: c.aiUsed || [],
    assessment: [...(c.assessment?.self || []), ...(c.assessment?.peer || []), ...(c.assessment?.teacher || [])].map((x) => short(x, 80)).slice(0, 8),
    safety: (c.safety || []).map((x) => short(x, 80)).slice(0, 6),
    extensions: (c.extensions || []).map((x) => short(x, 80)).slice(0, 6),
    concepts: [...(c.concepts?.basics || []), ...(c.concepts?.principle || [])].map((x) => short(x, 100)).slice(0, 6),
    keyBlocks: (c.keyBlocks || []).slice(0, 30),
    standards: (c.curriculum?.standards || []).map((s) => s.code).filter(Boolean),
  });
}
// 단계 모델(4단계) — 자료 전반에 공통으로 나타나는 교수학습 설계 흐름을 일반화
const stageModel = [
  { key: 'tinkering', name: '분석 및 이해 · 피지컬 기초', en: 'Tinkering & Physical Computing Basics', desc: '문제 상황(스토리) 확인 → 교구 탐색·연결 → 센서 값 실시간 관찰로 입력-처리-출력 구조 이해' },
  { key: 'making', name: '만들기', en: 'Making #01 · #02', desc: '핵심 기능부터 단계적으로 구현(센서 판단 → 출력 → AI 인식 결합). 변수·조건으로 동작 다듬기' },
  { key: 'sharing', name: '공유 및 성찰', en: 'Sharing', desc: '모둠 간 시연·상호 테스트, 설계 특징과 판단 기준(신뢰도 등) 발표, 동료 평가' },
  { key: 'improving', name: '개선하기', en: 'Improving', desc: '오류·취약점 분석 → 데이터 재학습/조건 수정 → 확장 아이디어 적용' },
];
const algorithmPattern = ['① 센서 데이터 수집 및 조건 확인', '② AI 인식/분류(이미지·음성·손 모양 등)', '③ 판단(조건·변수·신뢰도)', '④ 출력·동작(모터·LED·소리) 및 피드백'];
const assessmentLenses = ['입력-판단-출력 흐름을 설명할 수 있는가', '센서 값·조건을 스스로 수정하며 동작을 개선했는가', 'AI 인식 결과와 신뢰도의 한계를 이해하고 보완했는가', '모둠 역할(프로젝트 매니저·엔지니어·AI 전문가)을 협력적으로 수행했는가', '실생활 문제와 연결하여 확장 아이디어를 제안했는가'];
const roles = ['프로젝트 매니저(전체 관리·의사결정)', '엔지니어(하드웨어 연결·코딩)', 'AI 전문가(데이터 수집·모델 학습·윤리)'];
// ---- 드론 지식 (과학전시관 직무연수 자료 + 잇플 토리드론 교재 구조) ----
let drone = null;
try {
  const d = JSON.parse(fs.readFileSync('knowledge-source/drone/drone-training.json', 'utf8'));
  const take = (arr, n, key) => (arr || []).slice(0, n).map((x) => (typeof x === 'string' ? short(x, 110) : key ? short(x[key], 110) : short(JSON.stringify(x), 110)));
  drone = {
    control: (d.principles?.quadcopterControl || []).map((c) => ({ term: c.term, meaning: short(c.meaning, 90) })),
    flightPrinciple: take(d.principles?.flightPrinciple, 6),
    safety: take(d.safety?.rules, 10), law: take(d.safety?.law, 6), preflight: take(d.safety?.preflightChecklist, 8), indoor: take(d.safety?.indoorTips, 6), battery: take(d.safety?.battery, 5),
    skills: (d.flightPractice?.basicSkills || []).slice(0, 10).map((k) => ({ skill: k.skill, howTo: short(k.howTo, 90) })),
    progression: take(d.flightPractice?.progression, 10), mistakes: take(d.flightPractice?.commonMistakes, 8),
    swApproach: take(d.swEducation?.approach, 8), lessonIdeas: (d.swEducation?.lessonIdeas || []).slice(0, 10).map((l) => ({ title: l.title, summary: short(l.summary, 90) })),
    aiIdeas: (d.ai?.ideas || []).slice(0, 8).map((l) => ({ title: l.title, summary: short(l.summary, 90) })),
    assessment: take(d.assessment, 8),
  };
  // 토리드론 엔트리 교재 진행 구조(연구회 정리) — 프로젝트 순서 설계에 참고
  drone.toryCurriculum = [
    { chapter: '드론 코딩 시작하기', topics: ['드론 연결하기(Entry_Alux·토리드론 선택)', '해발고도 센서 값 읽어 말하기', 'LED 색·모드 바꾸기, 조종기 버저·진동', '조종기 버튼/조이스틱 값으로 게임 조종기 만들기'] },
    { chapter: '코딩으로 드론 조종하기', topics: ['센서 초기화→이륙→착륙 기초, Roll/Pitch/Yaw/Throttle % 정하기·초 실행, m 이동·도 회전', '곡예비행: 사각형·지그재그·원·회오리(반복·변수)', '대답(묻고 기다리기)으로 방향 명령 함수 만들기', '키보드(방향키·WASD·숫자)로 조종, 속도 변수 20~80 제한', '마우스 좌표 범위로 피치·롤·쓰로틀 조종'] },
    { chapter: '엔트리 인공지능 드론', topics: ['음성 인식(한국어 음성 인식하기 → 음성을 문자로 바꾼 값)으로 조종', '손 인식(1번째 손의 모양이 브이 사인인가?, 검지 끝 좌표)으로 조종', '신체 인식(1번째 사람의 왼쪽 손목 좌표)으로 범위 조종', '머신러닝(이미지 분류 모델) 결과로 이륙·착륙'] },
  ];
} catch (e) { console.warn('drone knowledge skipped', e.message); }

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/knowledge.json', JSON.stringify({ stageModel, algorithmPattern, assessmentLenses, roles, projects, drone }, null, 1));
console.log('projects', projects.length, 'bytes', fs.statSync('src/data/knowledge.json').size);
