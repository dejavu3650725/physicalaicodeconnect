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
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/knowledge.json', JSON.stringify({ stageModel, algorithmPattern, assessmentLenses, roles, projects }, null, 1));
console.log('projects', projects.length, 'bytes', fs.statSync('src/data/knowledge.json').size);
