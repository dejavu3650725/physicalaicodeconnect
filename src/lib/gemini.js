export async function generateEntryLogic(keyword) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 입력해주세요.');
  }

  const prompt = `
당신은 베테랑 초등학교 교사이자 인공지능 피지컬 컴퓨팅 전문가 '금정민 선생님'입니다.
학생이 만들고 싶어하는 프로젝트: "${keyword}"

위 주제를 구현하기 위한 엔트리(Entry) 블록코딩 알고리즘을 설계해주세요.
반드시 아래 JSON 형식에 맞춰서 응답해야 합니다. 다른 말은 절대 추가하지 말고 오직 유효한 JSON 포맷만 반환하세요.

{
  "title": "${keyword} 관련 센스있는 프로젝트 제목",
  "levels": {
    "basic": {
      "name": "🌱 기초 (기본 제어)",
      "blocks": [
        { "category": "시작", "bg": "bg-[#00B686]", "text": "시작하기 버튼을 클릭했을 때" },
        { "category": "판단", "bg": "bg-[#4068FF]", "text": "만약 <(디지털 2번 핀 센서 값) = 참> 라면" }
      ],
      "explanation": "초등학생 눈높이에 맞춘 선생님의 친절하고 유머러스한 해설"
    },
    "standard": {
      "name": "🚀 기본 (데이터 활용)",
      "blocks": [ ... ],
      "explanation": "..."
    },
    "advanced": {
      "name": "🔥 심화 (인공지능 모델)",
      "blocks": [ ... ],
      "explanation": "..."
    }
  },
  "variables": [
    { "name": "변수명1", "value": 500, "desc": "설명" },
    { "name": "변수명2", "value": 255, "desc": "설명" }
  ]
}

주의사항:
- 블록 카테고리에 맞는 정확한 Tailwind bg 색상을 사용하세요. (시작: bg-[#00B686], 흐름: bg-[#1DBAEC], 판단: bg-[#4068FF], 움직임: bg-[#A359FF], 자료: bg-[#E54C8B], 인공지능: bg-[#7A52FF], 하드웨어: bg-[#00B6B1])
- 하드웨어 블록은 아두이노 호환 보드에서 범용적으로 쓰이는 "디지털 N번 핀", "아날로그 N번 핀" 같은 명칭을 사용하세요.
- 설명(explanation)에는 선생님 특유의 친근한 말투(해요체, ~랍니다 등)를 사용하세요.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generation_config: {
          temperature: 0.7,
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Details:', errorText);
      throw new Error(`API 호출 중 오류가 발생했습니다 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    return JSON.parse(resultText);
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
당신은 베테랑 초등학교 교사이자 피지컬 컴퓨팅 전문가 '금정민 선생님'입니다.
학생이 진행 중인 프로젝트: "${keyword}"
학생이 추가하고 싶은 아이디어: "${userLogic}"

이 학생의 아이디어를 듣고, 선생님의 친근하고 유머러스한 말투로 피드백을 주세요.
반드시 아래 JSON 형식에 맞춰서 응답해야 합니다. 오직 JSON만 반환하세요.

{
  "strengths": "학생의 아이디어에서 좋은 점 폭풍 칭찬 (초등학생 눈높이)",
  "improvements": "더 발전시키면 좋을 점이나 코딩할 때 주의할 점 제안 (초등학생 눈높이)"
}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generation_config: {
          temperature: 0.7,
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error('API 호출 중 오류가 발생했습니다.');
    }

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
