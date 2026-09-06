// ============================================================
// 설계 지식베이스 — 서울특별시교육청 피지컬 AI 교육자료의 설계 원리를 내부 로직으로 사용
// (원문은 저장소/화면에 노출하지 않고, 단계 흐름·알고리즘 패턴·평가 관점·안전만 구조화하여 AI 설계 근거로 삼는다)
// ============================================================
import KB from '../data/knowledge.json';

export const STAGES = KB.stageModel;
export const ALGORITHM_PATTERN = KB.algorithmPattern;
export const ASSESSMENT_LENSES = KB.assessmentLenses;
export const ROLES = KB.roles;

/** 하드웨어별 관련 프로젝트 지식 (교육청 자료의 설계 구조) */
export function projectsFor(hardwareId) {
  return KB.projects.filter((p) => p.hardware === hardwareId);
}

/** 연구회 추천 프로젝트 템플릿 — 자료의 주제 구조에서 도출한 우리 표현 */
export const TEMPLATES = {
  hamster: [
    { id: 'ai-car', name: 'AI 손짓 자동차', idea: '카메라 손 인식 결과로 전후좌우 움직이는 햄스터 자동차', tags: ['손 인식', '조건 분기'] },
    { id: 'sign-drive', name: '표지판 자율주행', idea: '이미지 모델로 표지판을 학습해 방향을 바꾸는 자율주행 햄스터', tags: ['모델 학습', '신뢰도'] },
    { id: 'agent', name: '피지컬 AI 요원 훈련', idea: '근접·바닥 센서로 미션 코스를 통과하고 소리·LED로 보고하는 로봇', tags: ['센서 판단', '변수'] },
  ],
  microbit: [
    { id: 'watch', name: '스마트워치 만보기', idea: '흔들림으로 걸음을 세고 목표 달성을 알려주는 손목 워치', tags: ['가속도', '변수'] },
    { id: 'security', name: 'AI 보안 출입 장치', idea: '빛·온도·가속도 센서와 PC AI 인식을 결합한 연구소 보안 장치', tags: ['센서 조건', 'AI 연계'] },
    { id: 'eco', name: '에코 패트롤', idea: '주변 환경 데이터를 측정해 라디오로 친구에게 알리는 환경 순찰 워치', tags: ['라디오', '데이터'] },
  ],
  tory: [
    { id: 'gesture-drone', name: '손짓 구조 드론', idea: '손 모양으로 이륙·착륙하고 LED 신호로 소통하는 구조 드론', tags: ['손 인식', '안전 설계'] },
    { id: 'patrol', name: '사각형 순찰 비행', idea: '반복으로 사각형 경로를 비행하고 거리 센서로 고도를 확인하는 드론', tags: ['반복', '센서'] },
  ],
  spike: [
    { id: 'recycle', name: '분류 수거 로봇', idea: 'AI 이미지 분류 결과로 쓰레기를 나누어 담는 수거 로봇', tags: ['이미지 분류', '로봇팔'] },
    { id: 'mobility', name: '스마트 모빌리티', idea: '컬러 센서로 선을 따라가고 거리 센서로 장애물 앞에서 멈추는 자율주행차', tags: ['라인트레이싱', '조건'] },
    { id: 'pet', name: '표정 읽는 반려 로봇', idea: '표정 분류 결과에 따라 라이트와 소리로 반응하는 반려 로봇', tags: ['얼굴 분류', '신뢰도'] },
  ],
};

/** 언플러그드 도입 활동 유형(연구회 정리) — 개념 → 몸으로 익히는 놀이 아이디어 */
export const WARMUPS = {
  sensor: { title: '내가 센서다', summary: '학생이 빛·소리·온도 센서 역할을 맡아 감지한 것을 말로 전달하고, 기록 담당이 판단 규칙에 따라 동작을 결정해 보는 역할놀이. 감지→전달→처리→동작 흐름을 몸으로 익힌다.' },
  sequence: { title: '명령 카드 릴레이', summary: '동작 카드를 순서대로 밟으며 로봇처럼 정확한 절차대로 움직이기. 모호한 표현이 왜 안 되는지 체험한다.' },
  condition: { title: '예/아니오 갈림길', summary: '질문에 예/아니오로 답하며 갈림길을 따라가는 의사결정 나무 게임. 조건 분기의 개념을 익힌다.' },
  classify: { title: '분류 기준 세우기', summary: '카드를 내 기준으로 나누고 다른 모둠의 기준을 추측하기. AI가 데이터에서 규칙을 찾는 방식과 편향의 위험을 이야기한다.' },
  signal: { title: '약속된 신호 보내기', summary: '0과 1처럼 약속된 신호만으로 메시지를 전달해 보는 통신 놀이. 디지털 신호와 무선 통신의 원리를 익힌다.' },
};

export function warmupFor(hardwareId, levelKey) {
  if (levelKey === 'advanced') return WARMUPS.classify;
  if (levelKey === 'standard') return hardwareId === 'microbit' ? WARMUPS.signal : WARMUPS.condition;
  return hardwareId === 'hamster' || hardwareId === 'spike' ? WARMUPS.sequence : WARMUPS.sensor;
}

/** AI 프롬프트용 설계 원리 요약(하드웨어별) */
export function designPrinciples(hardwareId) {
  const ps = projectsFor(hardwareId);
  const lines = [];
  lines.push('# 수업 설계 원리 (서울특별시교육청 피지컬 AI 교육자료의 교수학습 설계 구조를 내부 지식으로 사용)');
  lines.push('## 4단계 흐름: ' + STAGES.map((s) => `${s.name}(${s.en}) — ${s.desc}`).join(' / '));
  lines.push('## 알고리즘 패턴: ' + ALGORITHM_PATTERN.join(' → '));
  lines.push('## 모둠 역할: ' + ROLES.join(', '));
  lines.push('## 평가 관점: ' + ASSESSMENT_LENSES.join(' / '));
  if (ps.length) {
    lines.push(`## 이 교구의 검증된 프로젝트 구조 ${ps.length}개`);
    for (const p of ps) {
      lines.push(`- [${p.level}] 주제 "${p.theme}" — 목표: ${p.goal}`);
      if (p.algorithm?.length) lines.push(`  알고리즘: ${p.algorithm.map((a) => `${a.step} ${a.process}`).join(' → ')}`);
      if (p.flow) lines.push(`  센서(${(p.flow.sensors || []).join('·')}) → AI(${(p.flow.ai || []).join('·')}) → 출력(${(p.flow.actuators || []).join('·')})`);
      if (p.safety?.length) lines.push(`  안전: ${p.safety.slice(0, 3).join('; ')}`);
      if (p.extensions?.length) lines.push(`  확장: ${p.extensions.slice(0, 3).join('; ')}`);
    }
  }
  return lines.join('\n');
}

export const SAFETY_BY_HW = {
  hamster: ['로봇 충전 상태·동글 페어링 확인 후 시작', '책상 가장자리 낙하 주의(바닥 센서 실험은 매트 위에서)', '카메라 사용 시 얼굴 촬영·저장 동의와 개인정보 지도'],
  microbit: ['배터리 홀더 극성·단자 확인, 금속 물체와 접촉 금지', '손목 착용 시 스트랩 조임 정도 확인', '라디오 실습은 모둠별 그룹 번호를 달리해 혼선 방지'],
  tory: ['프로펠러 안전망 장착·사람과 2m 이상 거리 유지', '고도 1.5m 이하, 무늬 있는 바닥에서 비행', '이상 시 즉시 착륙/정지, 배터리 과열·손상 점검'],
  spike: ['모터 회전부에 손·머리카락 접근 금지', '허브 충전 중 케이블 분리 금지, 부품 분실 관리', '로봇팔·이동 실험은 바닥 또는 넓은 책상에서'],
};

/** 결과 화면용 — 하드웨어의 안전/평가/확장 힌트 모음 (연구회 일반화 표현) */
export function hintsFor(hardwareId) {
  const ps = projectsFor(hardwareId);
  const uniq = (arr) => [...new Set(arr.filter(Boolean))];
  return {
    safety: SAFETY_BY_HW[hardwareId] || [],
    assessment: ASSESSMENT_LENSES,
    extensions: uniq(ps.flatMap((p) => p.extensions)).slice(0, 4),
    standards: uniq(ps.flatMap((p) => p.standards)).slice(0, 6),
  };
}
