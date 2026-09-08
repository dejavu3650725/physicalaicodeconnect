# 피지컬 AI 코드 커넥트 (Physical AI Code Connect)

**학생의 아이디어를 진짜 교구 블록으로 연결하는 피지컬 AI 융합 수업 설계 플랫폼**
서울특별시교육청 AI피지컬컴퓨팅융합교육연구회 · 학교자율시간 프로그램

🌐 https://physical-ai-code-connect.vercel.app

학생의 아이디어 한 줄을 **실제 교구에 존재하는 블록만으로** 기초·기본·심화 3단계 조립도로 설계하고, 블록에서 텍스트 코드를 결정적으로 변환하며, 4단계 수업 흐름·평가·안전 지도까지 함께 내놓는 웹 앱입니다. 가입 없이 30초 안에 결과를 봅니다.

## 지원 교구

| 교구 | 코딩 도구 | 블록 명칭 출처 | 텍스트 코드 |
|---|---|---|---|
| 햄스터 / 햄스터S (로보메이션) | 엔트리 | entryjs `block_hamster.js`, `block_hamster_s.js` 캡션 그대로 | 엔트리 파이썬(`Hamster.*`), roboid 파이썬 |
| 마이크로비트 v2 스마트워치 세트 | 메이크코드 | makecode.microbit.org 한국어 UI 캡션 | MakeCode JavaScript / Python |
| 토리 드론 (잇플) | 엔트리(Entry_Alux) | 잇플 교재 『엔트리 인공지능과 함께하는 토리드론』 화면 표기 + 제조사 사용자 가이드 | CodingRider 파이썬 |
| 레고 스파이크 프라임 | 스파이크 앱 3.x | 워드블록 캡션 | SPIKE Python |

총 368개 블록.

## 핵심 설계

1. **블록 카탈로그 = 단일 진실 공급원** (`src/blocks/*.js`) — 각 블록은 `id · 카테고리 · 모양 · 화면 캡션 템플릿 · 파라미터 · 코드 템플릿`을 가집니다.
2. **AI는 블록 트리(JSON)만 생성** (`src/lib/ai.js`) — 시스템 프롬프트에 카탈로그 레퍼런스를 넣어 Gemini가 카탈로그 id로만 조립하게 하고, `normalizeTree()`가 알 수 없는 블록을 제거·별칭 보정합니다.
3. **코드는 결정적으로 컴파일** (`compileTree()`) — AI가 코드를 쓰지 않으므로 존재하지 않는 API가 코드에 들어갈 수 없습니다. 조립도와 텍스트 코드가 항상 일치합니다.
4. **수준별 단계 규칙 검사** (`src/lib/levelRules.js`) — 기초(순차·조건/AI 금지) · 기본(센서+조건+반복) · 심화(AI 블록+분기 또는 다중 센서 결합)가 실제로 난이도 차이를 갖는지 블록 트리를 검사하고, 위반 시 사유를 적어 문제 있는 단계만 1회 재요청합니다. 화면에 「단계 규칙 통과」 배지와 「이 단계 다시 설계」 버튼.
5. **설계 지식베이스(Pedagogy Engine)** (`src/lib/knowledge.js`, `src/data/knowledge.json`) — 서울특별시교육청 피지컬 AI 교육자료의 교수학습 설계 구조(4단계 흐름 · 센서→AI→판단→출력 · 모둠 역할 · 평가 관점)와 과학전시관 드론 직무연수의 원리·안전을 구조화해 AI 프롬프트의 근거로만 사용합니다. 원문은 저장소에 포함하지 않습니다(`knowledge-source/`, gitignore).
6. **속도** — 블록 설계와 수업 흐름을 병렬 요청해 첫 결과를 먼저 표시, Flash 계열의 thinking 비활성(거부 시 자동 재시도), 세션 캐시.
7. **하드웨어 한계 돌파(Edge Case)** — 교구 한계를 넘는 상상은 거부하지 않고 실제 부품으로 표현하는 대안을 제시합니다.
8. **토리드론 지상 테스트 버전** (`src/lib/groundTest.js`) — 비행 블록을 LED·부저·진동 신호로 자동 치환해 드론을 바닥에 둔 채 논리를 검증합니다(비행 5~6분 배터리 절약·안전).

## 주요 화면

- **코드 커넥트** — 교구 선택 → 아이디어 입력(추천 템플릿, 학급 조건) → STEP 1·2·3 수준별 블록 조립도 · 조립 순서 · 텍스트 코드 · 해설 · 변수 → 아이디어 더하기 피드백 → 학교자율시간 4단계 차시 계획·평가·안전
- **연결 튜토리얼** — 교구별 게임형 단계 진행(체크포인트 퀴즈·체크리스트, 현장 해결법, 진행 저장, 배지). 토리드론은 제조사 매뉴얼 기준(페어링 P 3초 · 캘리브레이션 S 3초 · Link 모드 · 배터리 운영 팁)
- **수업 설계 가이드** — 연구회 수업 설계 프레임워크
- **공유** — 설계 전체를 압축한 링크(`#/view?d=…`, 서버 불필요) · 1200×630 공유 카드 이미지 · 인쇄/PDF. 받은 사람은 가입 없이 열고 「이 아이디어로 나도 설계」
- **내 설계** (선택, Firebase) — 구글 로그인 후 저장 · 목록 · 공개/비공개 · 짧은 링크 `#/d/{id}`

## 실행 · 배포

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

### 환경 변수

| 이름 | 위치 | 설명 |
|---|---|---|
| `GEMINI_API_KEY` | Vercel(비밀) | 서버리스 `api/gemini.js`가 사용. 브라우저에 노출되지 않음 |
| `GEMINI_MODEL` | Vercel(선택) | 기본 `gemini-3.1-flash-lite`. 사라지면 최신 Flash 계열로 자동 승계 |
| `VITE_FIREBASE_*` (6개) | Vercel(구성) + `.env` | 설계 저장·내 설계·짧은 링크. 비워 두면 기능이 숨겨지고 앱은 그대로 동작. 공개 가능한 식별자 |
| `VITE_GEMINI_API_KEY` | 로컬 개발 전용 | 번들에 포함되므로 배포 금지 |

`.env.example` 참고. `VITE_` 변수는 빌드 시 새겨지므로 값을 바꾼 뒤 Vercel **Redeploy**가 필요합니다.

### Firebase (선택)
1. Firebase 콘솔 → Authentication → Google 사용 설정 → 승인된 도메인에 배포 도메인 추가
2. Firestore 생성 → 규칙 탭에 `firestore.rules` 내용 붙여넣고 게시
3. 프로젝트 설정 → 웹 앱 → `firebaseConfig` 6개 값을 `VITE_FIREBASE_*`로 등록

규칙: 공개 설계는 누구나 읽기, 쓰기·삭제는 본인만. `admins/{uid}` 문서가 있는 계정만 `programs` 쓰기(추후 연구회 프로그램 자료용).

### 모델 자동 승계
설정된 모델이 사라지거나(404) 지원 종료되면 `models` 목록 API에서 사용 가능한 최신 Flash 계열(Flash-Lite > Flash > Pro, 실험·미리보기·이미지·TTS 제외)을 골라 재시도하고 6시간 캐시합니다. `GET /api/gemini`로 현재 모델 확인.

## 폴더 구조

```
api/gemini.js                 Vercel 서버리스 Gemini 프록시(모델 승계, thinking 폴백)
firestore.rules               Firestore 보안 규칙
public/og.png                 링크 미리보기 이미지(카톡·SNS)
src/blocks/                   블록 카탈로그(entryCommon, hamster, microbit, tory, spike) + engine
src/components/               BlockCanvas · CodePanel · ResultView · ShareBar · SpecCard · Footer · Visuals
src/pages/                    Home · CodeConnect · Tutorial · Guide · View(공유) · MyDesigns
src/data/hardware.js          하드웨어 프로필(센서·출력·한계·AI 융합 방법·사양·조종기)
src/data/tutorials.js         연결 튜토리얼 단계 데이터
src/data/samples.js           AI 호출 없이 보는 예시 설계(few-shot으로도 사용)
src/data/knowledge.json       설계 지식베이스(생성물)
src/lib/ai.js                 Gemini 호출 · 프롬프트 · 병렬 요청 · 검증/수정 체이닝 · 단계 재생성
src/lib/levelRules.js         수준별 단계 규칙 검사
src/lib/knowledge.js          설계 원리·템플릿·안전·언플러그드 도입 유형
src/lib/share.js              URL 압축 공유 · 공유 카드(Canvas)
src/lib/firebase.js           로그인·저장·목록(설정 없으면 비활성)
src/lib/groundTest.js         토리드론 지상 테스트 변환
scripts/build-knowledge.mjs   지식베이스 생성 스크립트(원문은 knowledge-source/, 미포함)
```

## 출처 및 유의

- 설계 원리: 서울특별시교육청 피지컬 AI 교육자료의 교수학습 설계 구조를 내부 지식으로 활용(원문 미수록).
- 드론 지식: 서울특별시교육청과학전시관 『드론의 원리와 비행실습 직무연수』 자료 구조 활용(원문 미수록) + 토리드론 제조사 사용자 가이드.
- 블록 명칭: 엔트리(entrylabs/entryjs), MakeCode(makecode.microbit.org 한국어 UI), SPIKE 앱, 토리드론은 잇플 교재 화면 표기. 각 명칭·상표는 해당 권리자의 것입니다.
- 엔트리 인공지능 블록은 엔트리 파이썬(텍스트) 모드에서 지원되지 않으므로 코드 변환 시 주석으로 표시됩니다.
- AI가 생성한 설계는 초안입니다. 수업 적용 전 검토와 안전 수칙 확인이 필요합니다(이용약관 제7조).

## 기술 스택
React 19 (Vite 8) · Tailwind CSS 4 · Lucide React · Google Gemini API · Vercel(정적 + 서버리스) · Firebase(Auth · Firestore, 선택)

---
© 2026 서울고덕초등학교 금정민 · 서울특별시교육청 AI피지컬컴퓨팅융합교육연구회
