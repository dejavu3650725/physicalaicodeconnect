import React, { useState } from 'react';
import { Bot, Sparkles, Send, Edit3, Settings2, Play, CheckCircle2, Layers, Copy, Check } from 'lucide-react';
import { generateEntryLogic, generateFeedback } from './lib/gemini';

const getCategoryColor = (category) => {
  const colors = {
    '시작': '#00B686',
    '흐름': '#1DBAEC',
    '판단': '#4068FF',
    '움직임': '#A359FF',
    '자료': '#E54C8B',
    '인공지능': '#7A52FF',
    '하드웨어': '#00B6B1'
  };
  return colors[category] || '#7A52FF';
};

function App() {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeLevel, setActiveLevel] = useState('standard');
  const [userLogic, setUserLogic] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);

  const [viewMode, setViewMode] = useState('block'); // 'block' or 'python'
  const [copied, setCopied] = useState(false);
  const [showFeedbackBlocks, setShowFeedbackBlocks] = useState(false);
  const [feedbackCopied, setFeedbackCopied] = useState(false);
  const [feedbackViewMode, setFeedbackViewMode] = useState('block'); // 'block' or 'python'

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    setFeedback(null);
    setUserLogic('');
    setActiveLevel('standard');
    setViewMode('block');
    setShowFeedbackBlocks(false);
    
    try {
      const generatedResult = await generateEntryLogic(keyword);
      setResult(generatedResult);
    } catch (error) {
      alert("AI 알고리즘을 생성하는 중에 오류가 발생했습니다. API 키나 인터넷 연결을 확인해주세요!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFeedback = async () => {
    if (!userLogic.trim()) return;
    
    setIsGettingFeedback(true);
    setFeedback(null);
    setShowFeedbackBlocks(false);
    
    try {
      const fb = await generateFeedback(keyword, userLogic);
      setFeedback(fb);
    } catch (error) {
      alert("피드백을 생성하는 중에 오류가 발생했습니다. API 키를 확인해주세요!");
    } finally {
      setIsGettingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-[#76b900]/30">
      {/* Header Area */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-tr from-[#76b900] to-[#a3e527] p-2.5 rounded-2xl shadow-lg shadow-[#76b900]/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 translate="no" className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5a8d00] to-[#76b900]">
              피지컬 AI 코드 커넥트
            </h1>
          </div>
          <p translate="no" className="text-slate-500 font-medium mt-1">
            블록코딩 기반 AI 피지컬 컴퓨팅 융합 수업 코드 제작 도우미
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* 1. Keyword Input Area */}
        <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100 transform transition-all hover:shadow-2xl hover:-translate-y-1">
          <label htmlFor="keyword" className="block text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
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
              className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-lg focus:outline-none focus:border-[#76b900] focus:bg-white transition-all shadow-inner"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !keyword.trim()}
              className="px-8 py-4 bg-[#76b900] hover:bg-[#68a400] active:bg-[#5a8d00] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#76b900]/30 shrink-0 text-lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  설계 중...
                </>
              ) : (
                <>
                  <Bot className="w-6 h-6" />
                  블록코딩 로직 뚝딱!
                </>
              )}
            </button>
          </div>
          
          {/* Hardware notice banner */}
          <div className="mt-6 flex items-start gap-3 bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs md:text-sm text-blue-700 font-medium leading-relaxed">
            <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p>
              <strong>[하드웨어 지원 안내]</strong> 현재 버전은 교육 현장에서 가장 활발히 쓰이는 <strong>'햄스터 로봇'</strong>에 최적화된 블록코딩과 엔트리 파이썬 실행 코드를 지원합니다. 아두이노, 알버트, 비트브릭, 코드이노 등 다양한 하드웨어 교구도 순차적으로 업데이트될 예정입니다!
            </p>
          </div>
        </section>

        {/* 2. AI Algorithm Suggestion Area */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 text-[#76b900] animate-pulse">
            <Bot className="w-16 h-16 mb-4 animate-bounce drop-shadow-md" />
            <p className="text-xl font-bold">인공지능 쌤이 블록코딩 로직을 설계 중이에요!</p>
            <p className="text-slate-400 mt-2 font-medium">수십만 개의 엔트리 블록을 조합하는 중...</p>
          </div>
        )}

        {result && !isGenerating && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex flex-wrap items-center gap-1.5 leading-snug">
                <span className="text-[#76b900] drop-shadow-sm">"{result.title}"</span> 추천 알고리즘 🚀
              </h2>
              
              {/* Level Selector */}
              <div className="flex bg-slate-100 p-1 rounded-2xl w-full lg:w-auto shadow-inner border border-slate-200 gap-0.5 shrink-0 overflow-hidden">
                {Object.entries(result.levels).map(([key, level]) => {
                  const parts = level.name.split(' ');
                  const shortName = `${parts[0]} ${parts[1]}`;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveLevel(key)}
                      className={`flex-1 lg:flex-none px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                        activeLevel === key 
                          ? 'bg-white text-[#76b900] shadow-md border border-slate-100' 
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                      }`}
                    >
                      <span className="hidden sm:inline">{level.name}</span>
                      <span className="inline sm:hidden">{shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* A. Entry Block Flow */}
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex flex-col hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    엔트리 코드 흐름
                  </h3>
                  
                  {/* View Mode Toggle */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                    <button
                      onClick={() => setViewMode('block')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                        viewMode === 'block'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      🧱 블록
                    </button>
                    <button
                      onClick={() => setViewMode('python')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                        viewMode === 'python'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      🐍 파이썬
                    </button>
                  </div>
                </div>

                {viewMode === 'block' ? (
                  <div className="space-y-2 flex-1 pb-4">
                    {result.levels[activeLevel].blocks.map((block, idx) => (
                      <div 
                        key={idx} 
                        className={`entry-block flex items-center px-4 py-3.5 text-white text-sm font-semibold relative animate-in fade-in slide-in-from-left-4 select-none cursor-default ${
                          idx === 0 ? 'entry-block-start' : ''
                        }`}
                        style={{ 
                          backgroundColor: getCategoryColor(block.category),
                          animationDelay: `${idx * 80}ms`,
                          fillMode: 'both',
                          borderTopLeftRadius: idx === 0 ? '16px' : '6px',
                          borderTopRightRadius: idx === 0 ? '16px' : '6px',
                        }}
                      >
                        <span className="bg-black/20 px-2 py-0.5 rounded text-xs font-bold mr-3 shrink-0">
                          {block.category}
                        </span>
                        <span className="flex-1 drop-shadow-sm leading-relaxed">
                          {block.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col pb-4 animate-in fade-in duration-300">
                    <div className="relative flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-4 font-mono text-xs md:text-sm text-slate-300 overflow-x-auto shadow-inner min-h-[300px]">
                      {/* Copy Button */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(result.levels[activeLevel].pythonCode || '');
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute right-3 top-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs z-10"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#a3e527]" />
                            <span>복사 완료!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>코드 복사</span>
                          </>
                        )}
                      </button>
                      <pre className="whitespace-pre-wrap leading-relaxed select-text mt-6">
                        <code>
                          {result.levels[activeLevel].pythonCode || `# 해당 단계의 파이썬 코드가 존재하지 않습니다.`}
                        </code>
                      </pre>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium">
                      💡 이 코드를 복사해서 <strong>엔트리 [파이썬 모드]</strong>에 붙여넣기 한 뒤 <strong>[블록 모드]</strong>로 바꾸면, 블록이 자동으로 촥 조립된답니다!
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* B. Core Variables */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Settings2 className="w-5 h-5 text-blue-500" />
                    내 맘대로 변수 조작하기
                  </h3>
                  <div className="space-y-4">
                    {result.variables.map((v, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-700">{v.name}</span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">기본값: {v.value}</span>
                        </div>
                        <p className="text-sm text-slate-600">{v.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* C. CT Explanation */}
                <div className="bg-gradient-to-br from-[#f2fbe8] to-[#f9fef5] rounded-3xl shadow-lg border border-[#e1f4cd] p-6 transition-all hover:shadow-xl">
                  <h3 className="text-lg font-bold text-[#5a8d00] mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#76b900]" />
                    선생님의 사고력 쏙쏙 해설!
                  </h3>
                  <p key={activeLevel} className="text-[#4b7600] leading-relaxed text-sm md:text-[15px] animate-in fade-in duration-500">
                    {result.levels[activeLevel].explanation.split('**').map((text, i) => 
                      i % 2 === 1 ? <strong key={i} className="text-[#3b5d00] bg-[#76b900]/10 px-1.5 py-0.5 rounded-md mx-0.5 shadow-sm">{text}</strong> : text
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Logic Edit & AI Feedback */}
        {result && !isGenerating && (
          <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both hover:shadow-2xl transition-shadow">
            <div className="bg-slate-800 p-5 md:p-6 text-white flex items-center gap-3 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
              <div className="bg-slate-700 p-2.5 rounded-2xl shadow-inner">
                <Edit3 className="w-6 h-6 text-[#a3e527]" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold">나만의 번뜩이는 아이디어 더하기 💡</h3>
                <p className="text-slate-300 text-sm mt-1 font-medium">AI가 만든 기본 코드에 어떤 기능을 더 추가하고 싶나요?</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 bg-slate-50/50">
              <textarea
                value={userLogic}
                onChange={(e) => setUserLogic(e.target.value)}
                placeholder="예: 공을 발견하면 모터가 움직이는 것뿐만 아니라, 스피커로 '찾았다!' 소리도 나게 하고 싶어요."
                className="w-full h-32 p-5 rounded-2xl bg-white border-2 border-slate-200 focus:outline-none focus:border-[#76b900] focus:ring-4 focus:ring-[#76b900]/10 resize-none transition-all shadow-sm text-slate-700"
              />
              
              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleFeedback}
                  disabled={isGettingFeedback || !userLogic.trim()}
                  className="px-8 py-3.5 bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-bold rounded-2xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-slate-300 shrink-0"
                >
                  {isGettingFeedback ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      쌤이 읽어보는 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      선생님에게 피드백 받기
                    </>
                  )}
                </button>
              </div>

              {/* Feedback Result */}
              {feedback && !isGettingFeedback && (
                <div className="mt-8 p-6 bg-green-50 rounded-3xl border-2 border-green-200 animate-in fade-in slide-in-from-top-4 shadow-sm relative overflow-hidden">
                   <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-green-400/10 rounded-full blur-3xl" />
                  <h4 className="font-bold text-green-800 mb-5 flex items-center gap-2 text-lg relative z-10">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    선생님의 특급 피드백 도착! 💌
                  </h4>
                  <div className="space-y-5 text-sm md:text-base relative z-10">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold mb-2 text-xs shadow-sm">폭풍 칭찬해요 👍</span>
                      <p className="text-slate-700 font-medium leading-relaxed">{feedback.strengths}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
                      <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold mb-2 text-xs shadow-sm">이렇게 해볼까요? 💡</span>
                      <p className="text-slate-700 font-medium leading-relaxed">{feedback.improvements}</p>
                    </div>

                    {/* View Blocks Button */}
                    {feedback.blocks && feedback.blocks.length > 0 && (
                      <div className="pt-2 flex justify-center">
                        <button
                          onClick={() => setShowFeedbackBlocks(!showFeedbackBlocks)}
                          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all text-sm md:text-base border border-indigo-500/20"
                        >
                          <Layers className="w-5 h-5 shrink-0" />
                          <span>{showFeedbackBlocks ? '추가된 블록 숨기기' : '🧱 추가된 블록 코딩으로 확인하기'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Feedback Blocks Viewer Card */}
                  {showFeedbackBlocks && feedback.blocks && (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                          아이디어가 더해진 햄스터 로봇 알고리즘 🚀
                        </h4>

                        {/* View Mode Toggle inside Feedback Card */}
                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                          <button
                            onClick={() => setFeedbackViewMode('block')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                              feedbackViewMode === 'block'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            🧱 블록
                          </button>
                          <button
                            onClick={() => setFeedbackViewMode('python')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                              feedbackViewMode === 'python'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            🐍 파이썬
                          </button>
                        </div>
                      </div>

                      {feedbackViewMode === 'block' ? (
                        <div className="space-y-2 max-w-xl mx-auto pb-4">
                          {feedback.blocks.map((block, idx) => (
                            <div 
                              key={idx} 
                              className={`entry-block flex items-center px-4 py-3.5 text-white text-sm font-semibold relative animate-in fade-in select-none cursor-default ${
                                idx === 0 ? 'entry-block-start' : ''
                              }`}
                              style={{ 
                                backgroundColor: getCategoryColor(block.category),
                                borderTopLeftRadius: idx === 0 ? '16px' : '6px',
                                borderTopRightRadius: idx === 0 ? '16px' : '6px',
                              }}
                            >
                              <span className="bg-black/20 px-2 py-0.5 rounded text-xs font-bold mr-3 shrink-0">
                                {block.category}
                              </span>
                              <span className="flex-1 drop-shadow-sm leading-relaxed">
                                {block.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col pb-4 max-w-xl mx-auto animate-in fade-in duration-300">
                          <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-4 font-mono text-xs md:text-sm text-slate-300 overflow-x-auto shadow-inner min-h-[250px]">
                            {/* Copy Button */}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(feedback.pythonCode || '');
                                setFeedbackCopied(true);
                                setTimeout(() => setFeedbackCopied(false), 2000);
                              }}
                              className="absolute right-3 top-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs z-10"
                            >
                              {feedbackCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#a3e527]" />
                                  <span>복사 완료!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>코드 복사</span>
                                </>
                              )}
                            </button>
                            <pre className="whitespace-pre-wrap leading-relaxed select-text mt-6">
                              <code>
                                {feedback.pythonCode || `# 해당 아이디어의 파이썬 코드가 존재하지 않습니다.`}
                              </code>
                            </pre>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 font-medium">
                            💡 이 수정된 코드를 복사해서 <strong>엔트리 [파이썬 모드]</strong>에 넣고 <strong>[블록 모드]</strong>로 바꾸면 바뀐 아이디어가 즉시 블록으로 변환됩니다!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
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
