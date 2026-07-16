import React, { useState } from 'react';
import { Bot, Sparkles, Send, Edit3, Settings2, Play, CheckCircle2 } from 'lucide-react';

function App() {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [userLogic, setUserLogic] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    setFeedback(null);
    setUserLogic('');
    
    // Simulate AI generation time
    setTimeout(() => {
      setIsGenerating(false);
      setResult({
        title: keyword,
        blocks: [
          { type: 'event', text: '시작하기 버튼을 클릭했을 때' },
          { type: 'control', text: '계속 반복하기' },
          { type: 'condition', text: '만약 (센서 감지 값이 10보다 작다) 라면' },
          { type: 'action', text: '로봇 속도를 (0)으로 정하기' },
          { type: 'condition', text: '아니면' },
          { type: 'action', text: '로봇 속도를 (50)으로 정하기' }
        ],
        variables: [
          { name: '로봇 속도', value: 50, desc: '숫자를 키우면 더 빨리 움직여요!' },
          { name: '센서 감지 거리', value: 10, desc: '장애물을 얼마나 멀리서 알아챌지 결정해요.' }
        ],
        explanation: '여기서 사용된 핵심 원리는 **자동화**와 **조건부 논리**예요! 센서가 주변을 계속 확인하면서(계속 반복하기), 장애물이 있으면 멈추고(조건), 없으면 달리는(아니면) 똑똑한 판단을 스스로 하도록 만든 거랍니다. 마치 우리가 길을 걷다가 돌부리를 보면 피해 가는 것처럼요!'
      });
    }, 2000);
  };

  const handleFeedback = () => {
    if (!userLogic.trim()) return;
    
    setIsGettingFeedback(true);
    
    // Simulate feedback generation
    setTimeout(() => {
      setIsGettingFeedback(false);
      setFeedback({
        strengths: '센서값을 두 가지로 나눠서 더 세밀하게 움직이도록 바꾼 점이 아주 훌륭해요! 상황을 더 다양하게 생각하는 힘이 자랐네요.',
        improvements: '로봇이 너무 갑자기 멈추면 넘어질 수 있으니, 속도를 서서히 줄이는 "1초 동안 속도 0으로 바꾸기" 같은 블록을 활용해 보면 어떨까요?'
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-teal-200">
      {/* Header Area */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-tr from-teal-400 to-green-400 p-2 rounded-2xl shadow-lg shadow-teal-200">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-500">
              피지컬 AI 코드 커넥트
            </h1>
          </div>
          <p className="text-slate-500 font-medium mt-1">
            로그인 없이 즉시 경험하는 엔트리 기반 컴퓨팅 사고력(CT) 융합 플랫폼
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* 1. Keyword Input Area */}
        <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100 transform transition-all hover:shadow-2xl">
          <label htmlFor="keyword" className="block text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            어떤 로봇이나 인공지능을 만들고 싶나요?
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="예: 로봇 축구 인공지능, 분리수거 로봇"
              className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-lg focus:outline-none focus:border-teal-400 focus:bg-white transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !keyword.trim()}
              className="px-8 py-4 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-200"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  설계 중...
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  엔트리 알고리즘 생성
                </>
              )}
            </button>
          </div>
        </section>

        {/* 2. AI Algorithm Suggestion Area */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12 text-teal-600 animate-pulse">
            <Bot className="w-16 h-16 mb-4 animate-bounce" />
            <p className="text-xl font-bold">AI가 엔트리 로직을 설계 중입니다...</p>
            <p className="text-slate-400 mt-2">잠시만 기다려주세요!</p>
          </div>
        )}

        {result && !isGenerating && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 px-2">
              <h2 className="text-2xl font-bold text-slate-800">
                <span className="text-teal-500">"{result.title}"</span> 추천 알고리즘
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* A. Entry Block Flow */}
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-3">
                  <Play className="w-5 h-5 text-green-500" />
                  엔트리 블록 조립 순서
                </h3>
                <div className="space-y-2">
                  {result.blocks.map((block, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl font-medium flex items-center gap-3 shadow-sm border-l-4 
                        ${block.type === 'event' ? 'bg-amber-50 border-amber-400 text-amber-800' : ''}
                        ${block.type === 'control' ? 'bg-blue-50 border-blue-400 text-blue-800' : ''}
                        ${block.type === 'condition' ? 'bg-purple-50 border-purple-400 text-purple-800' : ''}
                        ${block.type === 'action' ? 'bg-teal-50 border-teal-400 text-teal-800' : ''}
                      `}
                    >
                      <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      {block.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* B. Core Variables */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-3">
                    <Settings2 className="w-5 h-5 text-blue-500" />
                    내 맘대로 변수 조작하기
                  </h3>
                  <div className="space-y-4">
                    {result.variables.map((v, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-700">{v.name}</span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">기본값: {v.value}</span>
                        </div>
                        <p className="text-sm text-slate-600">{v.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* C. CT Explanation */}
                <div className="bg-teal-50 rounded-3xl shadow-lg border border-teal-100 p-6">
                  <h3 className="text-lg font-bold text-teal-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    선생님의 컴퓨팅 사고력 해설
                  </h3>
                  <p className="text-teal-700 leading-relaxed text-sm md:text-base">
                    {result.explanation.split('**').map((text, i) => 
                      i % 2 === 1 ? <strong key={i} className="text-teal-900 bg-teal-200/50 px-1 rounded">{text}</strong> : text
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Logic Edit & AI Feedback */}
        {result && !isGenerating && (
          <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            <div className="bg-slate-800 p-4 md:p-6 text-white flex items-center gap-3">
              <Edit3 className="w-6 h-6 text-teal-400" />
              <div>
                <h3 className="text-lg font-bold">나만의 아이디어 더하기</h3>
                <p className="text-slate-400 text-sm mt-1">AI가 만든 기본 코드에 어떤 기능을 더 추가하고 싶나요?</p>
              </div>
            </div>
            
            <div className="p-6">
              <textarea
                value={userLogic}
                onChange={(e) => setUserLogic(e.target.value)}
                placeholder="예: 장애물을 만나면 멈추는 것뿐만 아니라, 경고음도 울리게 하고 싶어요!"
                className="w-full h-32 p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white resize-none transition-colors"
              />
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleFeedback}
                  disabled={isGettingFeedback || !userLogic.trim()}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-md"
                >
                  {isGettingFeedback ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      피드백 생성 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      내 아이디어 피드백 받기
                    </>
                  )}
                </button>
              </div>

              {/* Feedback Result */}
              {feedback && !isGettingFeedback && (
                <div className="mt-6 p-6 bg-green-50 rounded-2xl border border-green-200 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    금정민 쌤의 특급 피드백!
                  </h4>
                  <div className="space-y-4 text-sm md:text-base">
                    <div>
                      <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded font-bold mb-1 text-xs">칭찬해요 👍</span>
                      <p className="text-green-900">{feedback.strengths}</p>
                    </div>
                    <div>
                      <span className="inline-block bg-amber-200 text-amber-800 px-2 py-1 rounded font-bold mb-1 text-xs">이렇게 해볼까요? 💡</span>
                      <p className="text-green-900">{feedback.improvements}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
