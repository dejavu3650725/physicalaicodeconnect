// ============================================================
// Gemini API 연동 모듈
// - Edge Case 우회 로직 (시스템 프롬프트)
// - Safety Settings 명시 적용
// - 프롬프트 체이닝 & 정규식 2차 검증 (Validation)
// ============================================================

// ---- 허용된 햄스터 로봇 파이썬 명령어 화이트리스트 ----
const ALLOWED_HAMSTER_COMMANDS = [
  'hamster\\.move_forward',
  'hamster\\.move_backward',
  'hamster\\.turn_left',
  'hamster\\.turn_right',
  'hamster\\.move_forward_sec',
  'hamster\\.move_backward_sec',
  'hamster\\.turn_left_sec',
  'hamster\\.turn_right_sec',
  'hamster\\.wheels',
  'hamster\\.stop',
  'hamster\\.left_proximity',
  'hamster\\.right_proximity',
  'hamster\\.left_floor',
  'hamster\\.right_floor',
  'hamster\\.hand_found',
  'hamster\\.beep',
  'hamster\\.buzzer',
  'hamster\\.note',
  'hamster\\.left_led',
  'hamster\\.right_led',
  'hamster\\.leds',
  'hamster\\.leds_off',
  'hamster\\.left_led_off',
  'hamster\\.right_led_off',
  'hamster\\.board_forward',
  'hamster\\.board_left',
  'hamster\\.board_right',
  'hamster\\.line_tracer_mode',
  'hamster\\.light',
  'hamster\\.temperature',
  'hamster\\.input_a',
  'hamster\\.input_b',
  'hamster\\.set_output_a',
  'hamster\\.set_output_b',
];

// ---- Gemini API Safety Settings ----
const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];

// ---- JSON 파싱 유틸리티 ----
function cleanAndParseJSON(text) {
  let cleanText = text.trim();
  // Remove markdown code block fences if present
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, '');
    cleanText = cleanText.replace(/```$/, '');
  }
  return JSON.parse(cleanText.trim());
}

// ============================================================
// 정규식(Regex) 2차 검증 (Validation)
// - 생성된 파이썬 코드에서 'hamster.*' 호출을 추출하여
//   화이트리스트에 없는 가짜 명령어(할루시네이션)를 탐지
// ============================================================
function validatePythonCode(code) {
  if (!code || typeof code !== 'string') return { valid: true, errors: [] };

  const errors = [];
  // hamster.xxx( 형태의 모든 호출 추출
  const hamsterCallRegex = /hamster\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  let match;

  while ((match = hamsterCallRegex.exec(code)) !== null) {
    const fullCall = `hamster.${match[1]}`;
    const isAllowed = ALLOWED_HAMSTER_COMMANDS.some(pattern => {
      const re = new RegExp(`^${pattern}$`);
      return re.test(fullCall);
    });

    if (!isAllowed) {
      errors.push({
        command: fullCall,
        line: code.substring(0, match.index).split('\n').length,
        message: `"${fullCall}"은(는) 실제 햄스터 로봇에 존재하지 않는 명령어입니다.`,
      });
    }
  }

  // 기본 구문 체크: 닫히지 않은 괄호
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push({
      command: 'syntax',
      line: 0,
      message: `괄호가 짝이 맞지 않습니다. 열린 괄호: ${openParens}개, 닫힌 괄호: ${closeParens}개`,
    });
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================
// 프롬프트 체이닝: 2차 수정 요청
// - 1차 검증에서 발견된 오류를 AI에게 전달하여 수정 요청
// ============================================================
async function refinePythonCode(apiKey, keyword, originalCode, validationErrors) {
  const errorDescriptions = validationErrors
    .map(e => `- ${e.message}`)
    .join('\n');

  const refinePrompt = `
당신은 엔트리 햄스터 로봇 파이썬 코드 검증 전문가입니다.

아래 파이썬 코드에서 다음 오류가 발견되었습니다:
${errorDescriptions}

원래 프로젝트: "${keyword}"
원래 코드:
\`\`\`python
${originalCode}
\`\`\`

[수정 규칙]:
1. 존재하지 않는 햄스터 명령어는 반드시 아래 허용된 명령어 중 가장 가까운 것으로 교체하세요.
2. 허용된 명령어 목록: move_forward_sec, move_backward_sec, turn_left_sec, turn_right_sec, wheels, stop, left_proximity, right_proximity, left_floor, right_floor, hand_found, beep, buzzer, note, left_led, right_led, leds, leds_off, light, temperature
3. 괄호 짝이 맞지 않으면 수정하세요.
4. 수정된 코드만 반환하세요. 다른 설명 없이 오직 파이썬 코드만 반환하세요. 마크다운 코드 블록으로 감싸지 마세요.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: refinePrompt }] }],
        safetySettings: SAFETY_SETTINGS,
      }),
    }
  );

  if (!response.ok) {
    console.warn('2차 검증 API 호출 실패, 원본 코드를 유지합니다.');
    return originalCode;
  }

  const data = await response.json();
  let refinedCode = data.candidates?.[0]?.content?.parts?.[0]?.text || originalCode;

  // 마크다운 코드 블록 제거
  refinedCode = refinedCode.trim();
  if (refinedCode.startsWith('```')) {
    refinedCode = refinedCode.replace(/^```(?:python)?\s*/i, '');
    refinedCode = refinedCode.replace(/```$/, '');
  }

  return refinedCode.trim();
}

// ============================================================
// 메인 로직 생성 함수
// 1차 생성 → 정규식 검증 → (필요 시) 2차 프롬프트 체이닝 수정
// ============================================================
export async function generateEntryLogic(keyword) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 입력해주세요.');
  }

  const prompt = `
당신은 베테랑 초등학교 교사이자 인공지능 피지컬 컴퓨팅 전문가 '선생님'입니다.
학생이 만들고 싶어하는 프로젝트: "${keyword}"

이 프로젝트를 **엔트리(Entry) 햄스터 로봇(Hamster Robot)**을 활용하여 구현할 수 있는 블록코딩 알고리즘과 **실제 실행 가능한 엔트리 파이썬(Python) 코드**로 설계해주세요. 
반드시 아래 JSON 형식에 맞춰서 응답해야 합니다. 다른 설명 없이 오직 유효한 JSON 포맷만 반환하세요.

{
  "title": "${keyword} 관련 햄스터 로봇 프로젝트 제목",
  "levels": {
    "basic": {
      "name": "🌱 기초 (기본 제어)",
      "blocks": [
        { "category": "시작", "text": "시작하기 버튼을 클릭했을 때" },
        { "category": "판단", "text": "만약 <손 찾음?> 이라면" },
        { "category": "하드웨어", "text": "앞으로 1초 이동하기" }
      ],
      "pythonCode": "import hamster\\n\\n# 시작하기 버튼을 클릭했을 때\\nif hamster.hand_found():\\n    hamster.move_forward_sec(1)",
      "explanation": "초등학생 눈높이에 맞춘 선생님의 친절하고 유머러스한 해설"
    },
    "standard": {
      "name": "🚀 기본 (센서와 데이터)",
      "blocks": [ ... ],
      "pythonCode": "...",
      "explanation": "..."
    },
    "advanced": {
      "name": "🔥 심화 (인공지능 융합)",
      "blocks": [ ... ],
      "pythonCode": "...",
      "explanation": "..."
    }
  },
  "variables": [
    { "name": "변수명1", "value": 50, "desc": "설명" }
  ]
}

[햄스터 로봇 명령어 가이드 및 파이썬 매핑 규칙]:
1. 블록 카테고리는 반드시 다음 중 하나만 사용하세요: "시작", "흐름", "판단", "움직임", "소리", "자료", "인공지능", "하드웨어".
2. **[실제 엔트리 파이썬 구문]**에 맞춰 'pythonCode'를 작성하세요 (할루시네이션 절대 금지!):
   - 이동/모터:
     - 블록: "앞으로 [N] 초 이동하기" ➡️ 파이썬: \`hamster.move_forward_sec(N)\`
     - 블록: "뒤로 [N] 초 이동하기" ➡️ 파이썬: \`hamster.move_backward_sec(N)\`
     - 블록: "왼쪽으로 [N] 초 돌기" ➡️ 파이썬: \`hamster.turn_left_sec(N)\`
     - 블록: "오른쪽으로 [N] 초 돌기" ➡️ 파이썬: \`hamster.turn_right_sec(N)\`
     - ...
     - 블록: "정지하기" ➡️ 파이썬: \`hamster.stop()\`
     - 블록: "왼쪽 바퀴 [L] 오른쪽 바퀴 [R] (으)로 정하기" ➡️ 파이썬: \`hamster.wheels(L, R)\`
   - 센서/판단 (조건식):
     - 블록: "<손 찾음?>" ➡️ 파이썬: \`hamster.hand_found()\`
     - 블록: "(왼쪽 근접 센서)" ➡️ 파이썬: \`hamster.left_proximity()\`
     - ...
   - 소리/버저:
     - 블록: "삐 소리내기" ➡️ 파이썬: \`hamster.beep()\`
     - 블록: "버저 끄기" ➡️ 파이썬: \`hamster.buzzer(0)\`
     - ...
   - LED:
     - 블록: "[왼쪽] LED를 [빨간색]으로 정하기" ➡️ 파이썬: \`hamster.left_led("red")\`
     - 블록: "[양쪽] LED 끄기" ➡️ 파이썬: \`hamster.leds_off()\`

[★ 하드웨어 한계 돌파(Edge Case) 우회 로직 — 매우 중요! ★]:
학생이 햄스터 로봇의 하드웨어 한계를 넘는 요청(예: '하늘을 나는 햄스터봇', '물속을 탐험하는 잠수함 로봇', '레이저를 쏘는 로봇' 등)을 할 경우, 절대로 오류를 내거나 "불가능합니다"라고 거부하지 마세요.
대신, 다음 전략으로 창의적으로 우회하세요:
1. 학생의 상상력과 의도를 먼저 칭찬하세요.
2. 햄스터 로봇이 가진 실제 하드웨어(바퀴 모터, 근접/바닥 센서, LED, 버저/스피커)로 해당 아이디어를 최대한 표현할 수 있는 대안을 제시하세요.
3. 예시: "하늘을 나는 로봇"이라면 → "바퀴를 최고 속도로 돌리며 비행기 이륙 소리(buzzer)를 내고, LED를 반짝여 이륙 신호를 표현해보자!"
4. 이 우회 내용을 explanation 필드에 자연스럽게 녹여서 설명하세요.
5. 절대 존재하지 않는 센서나 모듈(카메라, GPS, 프로펠러, 팔 등)을 코드에 넣지 마세요.
`;

  try {
    // ---- 1차 생성: Gemini API 호출 ----
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          safetySettings: SAFETY_SETTINGS,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Details:', errorText);
      throw new Error(`API 호출 중 오류가 발생했습니다 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const result = cleanAndParseJSON(resultText);

    // ---- 2차 검증: 정규식으로 파이썬 코드 검증 + 프롬프트 체이닝 수정 ----
    for (const levelKey of Object.keys(result.levels)) {
      const level = result.levels[levelKey];
      if (!level.pythonCode) continue;

      const validation = validatePythonCode(level.pythonCode);

      if (!validation.valid) {
        console.warn(`[2차 검증] ${levelKey} 단계에서 ${validation.errors.length}개 오류 발견. 프롬프트 체이닝으로 수정 중...`);
        validation.errors.forEach(e => console.warn(`  → ${e.message}`));

        // 프롬프트 체이닝: 수정된 코드 요청
        const refinedCode = await refinePythonCode(apiKey, keyword, level.pythonCode, validation.errors);
        result.levels[levelKey].pythonCode = refinedCode;
      }
    }

    return result;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

// ============================================================
// 피드백 생성 함수
// ============================================================
export async function generateFeedback(keyword, userLogic) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 입력해주세요.');
  }

  const prompt = `
당신은 베테랑 초등학교 교사이자 햄스터 로봇 피지컬 컴퓨팅 전문가 '선생님'입니다.
학생이 진행 중인 프로젝트: "${keyword}"
학생이 기존 설계 코드에 추가하고 싶어하는 아이디어: "${userLogic}"

이 학생의 아이디어를 교육적으로 검토하고, 선생님의 친근하고 유머러스한 말투로 피드백을 주시는 동시에, 이 아이디어가 반영되어 실제로 작동 가능한 **업데이트된 햄스터 로봇 블록코딩 순서와 엔트리 파이썬 코드**를 만들어주세요.

반드시 아래 JSON 형식에 맞춰서 응답해야 합니다. 다른 말 없이 오직 유효한 JSON만 반환하세요.

{
  "strengths": "학생의 아이디어에서 좋은 점 폭풍 칭찬 (초등학생 눈높이 구어체)",
  "improvements": "더 발전시키면 좋을 점이나 햄스터 로봇으로 구현할 때 주의할 점 제안 (초등학생 눈높이 구어체)",
  "blocks": [
    { "category": "시작", "text": "시작하기 버튼을 클릭했을 때" },
    { "category": "흐름", "text": "계속 반복하기" },
    { "category": "판단", "text": "만약 <(왼쪽 바닥 센서) < 20> 이라면" },
    { "category": "하드웨어", "text": "양쪽 LED 끄기" }
  ],
  "pythonCode": "import hamster\\n\\n# 엔트리 파이썬 코드 구현\\n..."
}

[햄스터 로봇 명령어 가이드 및 파이썬 매핑 규칙]:
- 블록 카테고리는 반드시 다음 중 하나만 사용하세요: "시작", "흐름", "판단", "움직임", "소리", "자료", "인공지능", "하드웨어".
- 실질적인 햄스터 로봇 블록코딩 명령어와 매핑되는 파이썬 구문을 작성하세요.
  (예: hamster.move_forward_sec(1), hamster.left_proximity(), hamster.hand_found(), hamster.beep(), hamster.buzzer(0), hamster.left_led("red"), hamster.leds_off())

[★ 하드웨어 한계 돌파(Edge Case) 우회 로직 ★]:
학생이 햄스터 로봇의 하드웨어 한계를 넘는 아이디어를 추가할 경우, 절대로 거부하지 마세요.
햄스터 로봇이 가진 실제 하드웨어(바퀴, 센서, LED, 버저)로 해당 아이디어를 최대한 표현할 수 있는 대안을 제시하되, 존재하지 않는 센서나 모듈을 코드에 넣지 마세요.
`;

  try {
    // ---- 1차 생성 ----
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          safetySettings: SAFETY_SETTINGS,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Details:', errorText);
      throw new Error(`API 호출 중 오류가 발생했습니다 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const result = cleanAndParseJSON(resultText);

    // ---- 2차 검증: 피드백 파이썬 코드도 검증 ----
    if (result.pythonCode) {
      const validation = validatePythonCode(result.pythonCode);

      if (!validation.valid) {
        console.warn(`[2차 검증-피드백] ${validation.errors.length}개 오류 발견. 프롬프트 체이닝으로 수정 중...`);
        validation.errors.forEach(e => console.warn(`  → ${e.message}`));

        const refinedCode = await refinePythonCode(apiKey, keyword, result.pythonCode, validation.errors);
        result.pythonCode = refinedCode;
      }
    }

    return result;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
