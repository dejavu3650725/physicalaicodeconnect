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

이 프로젝트를 **엔트리(Entry) 햄스터 로봇(Hamster Robot)**을 활용하여 구현할 수 있는 블록코딩 알고리즘으로 설계해주세요. 
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
      "explanation": "초등학생 눈높이에 맞춘 선생님의 친절하고 유머러스한 해설"
    },
    "standard": {
      "name": "🚀 기본 (센서와 데이터)",
      "blocks": [ ... ],
      "explanation": "..."
    },
    "advanced": {
      "name": "🔥 심화 (인공지능 융합)",
      "blocks": [ ... ],
      "explanation": "..."
    }
  },
  "variables": [
    { "name": "변수명1", "value": 50, "desc": "설명" }
  ]
}

[햄스터 로봇 블록 설계 규칙 및 명령어 가이드]:
1. 카테고리는 반드시 아래 중 하나만 사용하세요:
   - "시작" (초록)
   - "흐름" (파랑/하늘)
   - "판단" (남색)
   - "움직임" (보라)
   - "소리" (연두)
   - "자료" (분홍)
   - "인공지능" (보라/남색)
   - "하드웨어" (청록)

2. 실제 엔트리 햄스터 로봇 전용 명령어 블록을 사용해야 합니다:
   - [움직임/하드웨어]: 
     - "앞으로 [1] 초 이동하기"
     - "뒤로 [1] 초 이동하기"
     - "왼쪽으로 [1] 초 돌기"
     - "오른쪽으로 [1] 초 돌기"
     - "정지하기"
     - "왼쪽 바퀴 [30] 오른쪽 바퀴 [30] (으)로 정하기"
   - [센서/판단]:
     - "<손 찾음?>" (참/거짓)
     - "(왼쪽 근접 센서)" / "(오른쪽 근접 센서)" (값 범위 0~255)
     - "(왼쪽 바닥 센서)" / "(오른쪽 바닥 센서)" (값 범위 0~255, 어두울수록 큰 값)
   - [소리]:
     - "삐 소리내기"
     - "버저 끄기"
     - "버저 음을 [10] 만큼 바꾸기"
     - "[도] [4] 음을 [0.5] 박자 연주하기"
   - [LED]:
     - "[왼쪽] LED를 [빨간색]으로 정하기" (방향: 왼쪽/오른쪽/양쪽, 색상: 빨간색/노란색/초록색/하늘색/파란색/자주색/흰색 등)
     - "[양쪽] LED 끄기"

3. 심화 단계에서는 엔트리의 [인공지능] 블록(예: 비디오 화면 보이기, 사물 인식 시작하기, 얼굴이 인식되었는가 등)과 햄스터 하드웨어 블록을 융합하는 시나리오를 설계해주세요.
4. 설명(explanation)에는 선생님 특유의 친근한 말투(해요체, ~랍니다 등)를 사용하세요.
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
학생이 추가하고 싶은 아이디어: "${userLogic}"

이 학생의 아이디어를 듣고, 햄스터 로봇의 기능(바닥 센서, 근접 센서, LED, 바퀴 모터, 스피커 등)에 빗대어 선생님의 친근하고 유머러스한 말투로 피드백을 주세요.
반드시 아래 JSON 형식에 맞춰서 응답해야 합니다. 오직 JSON만 반환하세요.

{
  "strengths": "학생의 아이디어에서 좋은 점 폭풍 칭찬 (초등학생 눈높이)",
  "improvements": "더 발전시키면 좋을 점이나 햄스터 로봇으로 구현할 때 주의할 점 제안 (초등학생 눈높이)"
}
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
