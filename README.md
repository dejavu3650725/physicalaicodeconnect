# ★ 피지컬 AI 코드 커넥트 v2 (Physical AI Code Connect)

**다양한 피지컬 AI 융합 수업을 펼치는 장** — 서울특별시교육청 AI피지컬컴퓨팅융합교육연구회 학교자율시간 프로그램 개발 플랫폼

학생의 아이디어(자연어)를 **실제 교구에 존재하는 블록만으로** 조립도로 설계하고, 블록에서 텍스트 코드를 자동 변환하며, 교육청 배포 자료의 로직으로 수업을 재구성하는 웹 애플리케이션입니다.

## 지원 교구

| 교구 | 코딩 도구 | 블록 명칭 출처 | 텍스트 코드 |
|---|---|---|---|
| 햄스터 / 햄스터S (로보메이션) | 엔트리 | entryjs `block_hamster.js`, `block_hamster_s.js` 캡션 그대로 | 엔트리 파이썬(`Hamster.*`), roboid 파이썬 |
| 마이크로비트 v2 스마트워치 세트 | 메이크코드 | makecode.microbit.org 한국어 UI 캡션(2026-09 확인) | MakeCode JavaScript / Python |
| 토리 드론 (잇플) | 엔트리 | 같은 계열(바이로봇 코딩드론) 엔트리 공식 모듈 캡션 기준 ※화면과 다를 수 있음 | CodingRider 파이썬 |
| 레고 스파이크 프라임 | 스파이크 앱 3.x | 교육청 자료집에 실린 워드블록 캡션 | SPIKE Python |

## 핵심 설계

1. **블록 카탈로그 = 단일 진실 공급원** (`src/blocks/*.js`)
   각 블록은 `id · 카테고리 · 모양(hat/stack/c/c_else/value/boolean) · 화면 캡션 템플릿 · 파라미터(드롭다운 옵션/기본값) · 코드 템플릿` 을 가집니다.
2. **AI는 블록 트리(JSON)만 생성** (`src/lib/ai.js`)
   시스템 프롬프트에 카탈로그 레퍼런스를 넣어 Gemini가 카탈로그 id로만 조립하게 하고, `normalizeTree()`가 알 수 없는 블록을 제거·별칭 보정합니다. 남은 오류가 있으면 1회 수정 재요청(프롬프트 체이닝).
3. **코드는 결정적으로 컴파일** (`compileTree()`)
   AI가 코드를 쓰지 않으므로 존재하지 않는 API(할루시네이션)가 코드에 들어갈 수 없습니다. 블록 조립도와 텍스트 코드가 항상 일치합니다.
4. **엔트리/메이크코드/스파이크 모양 재현 렌더러** (`BlockCanvas.jsx`)
   시작(hat) 블록, C블록·아니면 분기, 값(둥근)/판단(육각) 슬롯, 드롭다운, 카테고리 색을 실제 도구 색상으로 표현합니다.
5. **하드웨어 한계 돌파(Edge Case) 우회** — 교구 한계를 넘는 상상은 거부하지 않고 실제 부품으로 표현하는 대안을 `edgeCase`로 제시합니다.
6. **설계 지식베이스(Pedagogy Engine)** (`src/lib/knowledge.js`, `src/data/knowledge.json`)
   서울특별시교육청 피지컬 AI 교육자료의 교수학습 설계 구조(4단계 흐름·센서→AI→판단→출력 알고리즘 패턴·모둠 역할·평가 관점)를 구조화해 AI 시스템 프롬프트의 근거로 사용합니다. 자료 원문은 저장소에 포함하지 않으며(`knowledge-source/`, gitignore), `scripts/build-knowledge.mjs`로 지식베이스만 생성합니다.

## 주요 화면

- **코드 커넥트** — 교구 선택 → 아이디어 입력(+교육청 자료 연계, 학급 조건) → 기초/기본/심화 3단계 블록 조립도 · 조립 순서 · 텍스트 코드 · 해설 · 변수 → 아이디어 더하기 피드백(블록 즉시 업데이트, 단계에 적용)
- **연결 튜토리얼** — 교구별 게임형 단계 진행(체크포인트 퀴즈/체크리스트, 현장 해결법, 진행 저장, 배지)
- **수업 설계 가이드** — 연구회 수업 설계 프레임워크(4단계 흐름 · 알고리즘 패턴 · 모둠 역할 · 평가 관점 · 언플러그드 도입 유형 · 교구별 템플릿)
- **수업 흐름 자동 설계** — 모든 설계 결과에 학교자율시간 4단계 차시 계획·알고리즘 흐름·평가 관점·안전 지도·언플러그드 도입 활동 포함

## 실행 · 배포

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

### AI 키 설정 (3가지 방법, 우선순위 순)
1. 화면 우상단 **AI 설정**에서 개인 Gemini API 키 입력 — 브라우저 localStorage에만 저장
2. 로컬 개발: `.env`에 `VITE_GEMINI_API_KEY=...` (번들에 포함되므로 배포 금지)
3. **배포(권장)**: Vercel 프로젝트 → Environment Variables → `GEMINI_API_KEY` 등록 → 서버리스 함수 `api/gemini.js`가 프록시 (브라우저에 키 노출 없음). 모델은 `GEMINI_MODEL`(기본 `gemini-3.1-flash-lite`).

### 모델 자동 승계
설정된 모델이 구글에서 사라지거나(404) 지원 종료되면, 서버(및 개인 키 직접 호출)는 `models` 목록 API에서 **사용 가능한 최신 Flash 계열 모델**(Flash-Lite > Flash > Pro, 최신 버전 우선, 실험·미리보기·이미지·TTS 제외)을 자동으로 골라 재시도하고 캐시합니다. 현재 사용 중인 모델은 우상단 **AI 설정** 창 또는 `GET /api/gemini` 로 확인할 수 있습니다.

## 폴더 구조

```
api/gemini.js               Vercel 서버리스 Gemini 프록시
src/blocks/                 블록 카탈로그(entryCommon, hamster, microbit, tory, spike) + engine(정규화/컴파일/레퍼런스)
src/components/             BlockCanvas · CodePanel · ResultView · Visuals(튜토리얼 일러스트)
src/pages/                  Home · CodeConnect · Tutorial · Library · Unplugged
src/data/hardware.js        하드웨어 프로필(센서·출력·한계·AI 융합 방법·예시 아이디어)
src/data/tutorials.js       연결 튜토리얼 단계 데이터
src/data/samples.js         AI 호출 없이 보는 예시 설계
src/data/knowledge.json     설계 지식베이스(생성물)
src/lib/knowledge.js        설계 원리·템플릿·언플러그드 도입 유형
scripts/build-knowledge.mjs 지식베이스 생성 스크립트(원문은 knowledge-source/, 미포함)
src/lib/ai.js               Gemini 호출 · 프롬프트 · 검증/수정 체이닝
```

## 출처 및 유의

- 설계 원리: 서울특별시교육청 피지컬 AI 교육자료의 교수학습 설계 구조를 내부 지식으로 활용(원문 미수록).
- 블록 명칭: 엔트리(entrylabs/entryjs), MakeCode(makecode.microbit.org 한국어 UI), SPIKE 앱. 토리드론 블록은 동일 프로토콜 계열의 엔트리 공식 모듈을 기준으로 하였으므로 실제 화면과 차이가 있을 수 있습니다.
- 엔트리 인공지능 블록은 엔트리 파이썬(텍스트) 모드에서 지원되지 않으므로 코드 변환 시 주석으로 표시됩니다.

## 기술 스택
React 19 (Vite 8) · Tailwind CSS 4 · Lucide React · Google Gemini API · Vercel(정적 + 서버리스)
