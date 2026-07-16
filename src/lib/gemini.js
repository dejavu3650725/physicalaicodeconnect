function cleanAndParseJSON(text) {
  let cleanText = text.trim();
  // Remove markdown code block fences if present
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, '');
    cleanText = cleanText.replace(/```$/, '');
  }
  return JSON.parse(cleanText.trim());
}

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
      "pythonCode": "import hamster\n\n# 시작하기 버튼을 클릭했을 때\nif hamster.hand_found():\n    hamster.move_forward_sec(1)",
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
     - 블록: "[왼쪽] LED를 [빨간색]으로 정하기" ➡️ 파이썬: \`hamster.left_led(\"red\")\`
     - 블록: "[양쪽] LED 끄기" ➡️ 파이썬: \`hamster.leds_off()\`
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Details:', errorText);
      throw new Error(`API 호출 중 오류가 발생했습니다 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    return cleanAndParseJSON(resultText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

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
  "pythonCode": "import hamster\n\n# 엔트리 파이썬 코드 구현\n..."
}

[햄스터 로봇 명령어 가이드 및 파이썬 매핑 규칙]:
- 블록 카테고리는 반드시 다음 중 하나만 사용하세요: "시작", "흐름", "판단", "움직임", "소리", "자료", "인공지능", "하드웨어".
- 실질적인 햄스터 로봇 블록코딩 명령어와 매핑되는 파이썬 구문을 작성하세요.
  (예: hamster.move_forward_sec(1), hamster.left_proximity(), hamster.hand_found(), hamster.beep(), hamster.buzzer(0), hamster.left_led("red"), hamster.leds_off())
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Details:', errorText);
      throw new Error(`API 호출 중 오류가 발생했습니다 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return cleanAndParseJSON(resultText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
