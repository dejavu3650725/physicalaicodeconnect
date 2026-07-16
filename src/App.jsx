import React, { useState } from 'react';
import { Bot, Sparkles, Send, Edit3, Settings2, Play, CheckCircle2, Layers } from 'lucide-react';
import { generateEntryLogic, generateFeedback } from './lib/gemini';

function App() {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeLevel, setActiveLevel] = useState('standard');
  const [userLogic, setUserLogic] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    setFeedback(null);
    setUserLogic('');
    setActiveLevel('standard');
    
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-[#76b900] drop-shadow-sm">"{result.title}"</span> 추천 알고리즘 🚀
              </h2>
              
              {/* Level Selector */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto shadow-inner border border-slate-200">
                {Object.entries(result.levels).map(([key, level]) => (
                  <button
                    key={key}
                    onClick={() => setActiveLevel(key)}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      activeLevel === key 
                        ? 'bg-white text-[#76b900] shadow-md border border-slate-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* A. Entry Block Flow */}
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex flex-col hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  엔트리 블록 조립 순서
                </h3>
                <div className="space-y-3 flex-1">
                  {result.levels[activeLevel].blocks.map((block, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4"
                      style={{ animationDelay: `${idx * 80}ms`, fillMode: 'both' }}
                    >
                      <div className={`shrink-0 px-3 py-2 rounded-xl text-white text-xs font-bold shadow-md w-[72px] text-center border border-black/5 ${block.bg}`}>
                        {block.category}
                      </div>
                      <div className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 font-medium text-sm shadow-sm hover:border-[#76b900]/50 transition-colors cursor-default">
                        {block.text}
                      </div>
                    </div>
                  ))}
                </div>
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
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer Area */}
      <footer className="bg-[#fcfcf9] py-8 border-t border-slate-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <button 
              onClick={() => setShowTerms(true)}
              className="text-slate-500 hover:text-slate-900 font-medium text-[15px] transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full"
            >
              이용약관
            </button>
            <button 
              onClick={() => setShowPrivacy(true)}
              className="text-slate-700 font-bold text-[15px] hover:text-[#76b900] transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full"
            >
              개인정보처리방침
            </button>
          </div>
          <div className="space-y-2 text-slate-400 text-sm font-medium">
            <p>정보관리책임자: 금정민</p>
            <p>© 2026 서울고덕초등학교 금정민. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#76b900] rounded-full inline-block"></span>
                이용약관
              </h2>
              <button onClick={() => setShowTerms(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-slate-600 space-y-6 text-[15px] leading-relaxed custom-scrollbar">
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제1조 (목적)</h3>
                <p>본 약관은 서울고덕초등학교 금정민(이하 "운영자")이 제공하는 피지컬 AI 코드 커넥트(이하 "서비스")의 이용과 관련하여, 운영자와 사용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제2조 (용어의 정의)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>"서비스"란 사용자가 단말기를 통해 접속하여 이용할 수 있는 피지컬 AI 코드 커넥트 관련 제반 서비스를 의미합니다.</li>
                  <li>"사용자"란 본 서비스에 접속하여 이 약관에 따라 운영자가 제공하는 서비스를 받는 교사, 학생 및 일반 이용자를 말합니다.</li>
                </ol>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제3조 (약관의 효력 및 변경)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.</li>
                  <li>운영자는 필요하다고 인정되는 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내에 공지함으로써 효력이 발생합니다.</li>
                </ol>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제4조 (서비스의 제공 및 변경)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>서비스는 교육적 목적을 위해 무상으로 제공됨을 원칙으로 합니다.</li>
                  <li>운영자는 필요에 따라 서비스의 내용을 변경하거나 중단할 수 있으며, 이 경우 사용자에게 사전 통지하지 않을 수 있습니다.</li>
                </ol>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제5조 (사용자의 의무)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>사용자는 서비스를 이용할 때 타인의 권리를 침해하거나 법령에 위반되는 행위를 하여서는 안 됩니다.</li>
                  <li>사용자는 서비스의 원활한 운영을 방해하는 해킹, 악성코드 유포 등의 행위를 할 수 없습니다.</li>
                  <li>서비스 내에 공유된 교육 자료는 교육적 목적으로만 활용되어야 하며, 상업적 무단 도용을 금합니다.</li>
                </ol>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제6조 (저작권 및 지적재산권)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>운영자가 작성한 서비스 내의 디자인, 텍스트, 코드 등에 대한 저작권은 운영자에게 있습니다.</li>
                  <li>사용자가 서비스 내에 등록한 데이터에 대한 일차적 책임은 해당 사용자에게 있습니다.</li>
                </ol>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제7조 (면책 조항)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>운영자는 천재지변, 서버 장애 등 불가항력적인 사유로 인해 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
                  <li>운영자는 사용자가 서비스를 이용하여 얻은 정보 등으로 인해 발생한 손해에 대하여 책임지지 않습니다.</li>
                </ol>
              </section>
              <section className="text-center text-slate-400 font-bold mt-4">
                <p>본 약관은 2026년 7월 16일부터 시행됩니다.</p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#76b900] rounded-full inline-block"></span>
                개인정보처리방침
              </h2>
              <button onClick={() => setShowPrivacy(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-slate-600 space-y-6 text-[15px] leading-relaxed custom-scrollbar">
              <div className="bg-[#76b900]/10 p-5 rounded-2xl border border-[#76b900]/20 text-[#5a8d00] font-medium">
                <p>서울고덕초등학교 금정민(이하 "운영자")은(는) 「개인정보 보호법」 등 관련 법령에 따라 사용자(교사, 학생 및 일반 이용자)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
              </div>
              
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제1조 (개인정보의 처리 목적)</h3>
                <p className="mb-3">운영자는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>서비스 제공 및 운영: 포털 내 알고리즘 생성 기록 제공, 코드 저장 및 관리.</li>
                  <li>사용자 편의성 향상: 개인 맞춤형 코드 인터페이스 및 생성 모니터링 콘텐츠 제공.</li>
                </ol>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제2조 (처리하는 개인정보의 항목)</h3>
                <p className="mb-3">운영자는 서비스 제공을 위해 최소한의 범위 내에서 아래와 같은 개인정보를 처리할 수 있습니다.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-slate-700">필수항목:</strong> 서비스 이용 기록, 키워드 검색 내역</li>
                  <li><strong className="text-slate-700">선택항목:</strong> 해당 없음</li>
                </ul>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제3조 (개인정보의 처리 및 보유 기간)</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>운영자는 법령에 따른 개인정보 보유·이용 기간 또는 사용자로부터 개인정보를 수집할 때 동의받은 기간 내에서 개인정보를 처리·보유합니다.</li>
                  <li>사용자의 서비스 이용 기록 및 데이터는 테스트 기간 만료 혹은 서비스 종료 시 파기됩니다.</li>
                </ol>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제4조 (개인정보의 제3자 제공)</h3>
                <p className="mb-3">운영자는 사용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>사용자가 사전에 동의한 경우</li>
                  <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                </ol>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제5조 (사용자의 권리와 그 행사 방법)</h3>
                <p>사용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 삭제를 요청할 수도 있습니다. 삭제 요청은 정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.</p>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제6조 (개인정보의 안전성 확보 조치)</h3>
                <p>운영자는 개인정보의 안전성 확보를 위해 관리적, 기술적 조치를 취하고 있습니다. (보안 규칙 등)</p>
              </section>
              <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">제7조 (개인정보 보호책임자 및 정보관리책임자)</h3>
                <p className="mb-4">운영자는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 사용자의 불만 처리 및 피해 구제를 위하여 아래와 같이 책임자를 지정하고 있습니다.</p>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <ul className="list-none space-y-2">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> <strong className="text-slate-700">정보관리책임자:</strong> 서울고덕초등학교 금정민</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> <strong className="text-slate-700">연락처:</strong> 02-427-0525</li>
                  </ul>
                </div>
              </section>
              <section className="text-center text-slate-400 font-bold mt-4">
                <p>이 개인정보처리방침은 2026년 7월 16일부터 적용됩니다.</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
