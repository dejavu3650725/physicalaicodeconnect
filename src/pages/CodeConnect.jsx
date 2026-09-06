import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Sparkles, Plug, AlertTriangle, Eye, Info, LayoutTemplate } from 'lucide-react';
import { HARDWARE, HARDWARE_MAP } from '../data/hardware.js';
import { TEMPLATES } from '../lib/knowledge.js';
import { SAMPLES } from '../data/samples.js';
import { designProject, feedbackAndUpdate, aiMode } from '../lib/ai.js';
import { normalizeTree } from '../blocks/engine.js';
import ResultView from '../components/ResultView.jsx';
import { href } from '../lib/router.js';
import SpecCard from '../components/SpecCard.jsx';

const LOADING_MSGS = ['교구 사양서를 펼치는 중…', '카탈로그에서 실제 블록만 고르는 중…', '기초·기본·심화 3단계로 나누는 중…', '선생님 해설을 쓰는 중…', '블록에서 텍스트 코드를 변환하는 중…'];

export default function CodeConnect({ route }) {
  const initialHw = HARDWARE_MAP[route.query.hw] ? route.query.hw : 'hamster';
  const [hwId, setHwId] = useState(initialHw);
  const hw = HARDWARE_MAP[hwId];
  const [platformKey, setPlatformKey] = useState(hw.defaultPlatform);
  const [idea, setIdea] = useState(route.query.idea || '');
  const [extra, setExtra] = useState('');
  const [busy, setBusy] = useState(false);
  const [busyFb, setBusyFb] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showAdv, setShowAdv] = useState(false);
  const resultRef = useRef(null);
  useEffect(() => { if (result && resultRef.current) setTimeout(() => resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); }, [result?.title, result?.sample]);

  useEffect(() => { setPlatformKey(HARDWARE_MAP[hwId].defaultPlatform); }, [hwId]);
  useEffect(() => { if (!busy) return; const t = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MSGS.length), 1400); return () => clearInterval(t); }, [busy]);
  useEffect(() => { if (route.query.hw && HARDWARE_MAP[route.query.hw]) setHwId(route.query.hw); if (route.query.idea) setIdea(route.query.idea); }, [route.query.hw, route.query.idea]);
  const templates = useMemo(() => TEMPLATES[hwId] || [], [hwId]);

  const generate = async () => {
    if (!idea.trim()) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const r = await designProject({ hardwareId: hwId, platformKey, idea: idea.trim(), extra });
      setResult({ ...r, platformKey, hwId, idea: idea.trim() });
    } catch (e) { setError(e.message || String(e)); }
    finally { setBusy(false); }
  };

  const showSample = () => {
    const s = SAMPLES[hwId];
    const levels = {};
    for (const k of Object.keys(s.levels)) { const issues = []; levels[k] = { ...s.levels[k], blocks: normalizeTree(s.platformKey, s.levels[k].blocks, issues), issues }; }
    setResult({ ...s, levels, hwId, sample: true });
    setPlatformKey(s.platformKey);
    setIdea(s.idea);
    setError('');
  };

  const onFeedback = async ({ levelKey, currentBlocks, userIdea }) => {
    setBusyFb(true);
    try { return await feedbackAndUpdate({ hardwareId: hwId, platformKey: result.platformKey, idea: result.idea || result.title, levelKey, currentBlocks, userIdea }); }
    catch (e) { setError(e.message || String(e)); return null; }
    finally { setBusyFb(false); }
  };
  const applyFeedback = (levelKey, blocks) => setResult((r) => ({ ...r, levels: { ...r.levels, [levelKey]: { ...r.levels[levelKey], blocks, issues: [] } } }));

  const swapVariant = async () => {
    if (!result || hw.variants.length < 2) return;
    const other = hw.variants.find((v) => v.key !== result.platformKey);
    if (!other) return;
    setPlatformKey(other.key);
    if (result.sample) return;
    setBusy(true);
    try { const r = await designProject({ hardwareId: hwId, platformKey: other.key, idea: result.idea, extra }); setResult({ ...r, platformKey: other.key, hwId, idea: result.idea }); }
    catch (e) { setError(e.message || String(e)); } finally { setBusy(false); }
  };

  const mode = aiMode();

  return (
    <div className="space-y-8">
      {/* 하드웨어 선택 */}
      <section className="flex gap-3 overflow-x-auto scrollbar-thin pb-1 no-print">
        {HARDWARE.map((h) => (
          <button key={h.id} onClick={() => setHwId(h.id)} className={`shrink-0 flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition text-left ${hwId === h.id ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <span className="text-2xl">{h.emoji}</span>
            <span><span className="block font-extrabold text-sm leading-tight">{h.name}</span><span className={`block text-[11px] font-bold ${hwId === h.id ? 'text-slate-300' : 'text-slate-400'}`}>{h.tool}</span></span>
          </button>
        ))}
      </section>

      {/* 입력 */}
      <section className="card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-15 blur-2xl" style={{ background: hw.gradient }} />
        <div className="relative grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <label className="text-lg font-extrabold flex items-center gap-2"><Sparkles className="w-6 h-6 text-amber-400" /> {hw.short}로 어떤 로봇·인공지능을 만들고 싶나요?</label>
            <div className="flex flex-col md:flex-row gap-3">
              <input className="input text-lg flex-1" value={idea} onChange={(e) => setIdea(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && generate()} placeholder={`예: ${hw.ideas[0]}`} />
              <button onClick={generate} disabled={busy || !idea.trim()} className="btn btn-primary text-base shrink-0">{busy ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 설계 중…</> : <><Bot className="w-5 h-5" /> 블록코딩 로직 뚝딱!</>}</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hw.ideas.map((s) => <button key={s} onClick={() => setIdea(s)} className="chip hover:bg-slate-200 transition cursor-pointer">{s}</button>)}
            </div>
            {templates.length > 0 && (
              <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-3">
                <div className="text-[11px] font-black text-violet-700 flex items-center gap-1 mb-2"><LayoutTemplate className="w-3.5 h-3.5" /> 연구회 추천 프로젝트 템플릿 — 교육청 피지컬 AI 설계 원리 반영</div>
                <div className="flex flex-wrap gap-2">
                  {templates.map((t) => <button key={t.id} onClick={() => setIdea(t.idea)} className="text-left rounded-xl bg-white border border-violet-200 hover:border-violet-400 px-3 py-2 transition"><div className="text-sm font-extrabold text-slate-800">{t.name}</div><div className="text-[11px] text-slate-500">{t.tags.join(' · ')}</div></button>)}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-3 items-center pt-1">
              {hw.variants.length > 1 && (
                <div className="seg">{hw.variants.map((v) => <button key={v.key} className={platformKey === v.key ? 'on' : ''} onClick={() => setPlatformKey(v.key)}>{v.label}</button>)}</div>
              )}
              <button onClick={() => setShowAdv(!showAdv)} className="text-xs font-bold text-slate-500 underline">학급 조건 추가 {showAdv ? '▲' : '▼'}</button>
            </div>
            {showAdv && <input className="input text-sm" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="예: 4학년, 2인 1조, 40분 2차시, 센서는 근접 센서만 사용, 변수 이름은 한글로" />}
          </div>
          <SpecCard hw={hw} compact collapsible />
        </div>
      </section>

      {/* 상태 */}
      {busy && (
        <div className="card p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-3xl grid place-items-center text-white animate-bounce" style={{ background: hw.gradient }}><Bot className="w-9 h-9" /></div>
          <p className="mt-4 text-xl font-extrabold">인공지능 쌤이 {hw.short} 블록을 조립하고 있어요!</p>
          <p className="text-slate-500 mt-1 font-medium">{LOADING_MSGS[msgIdx]}</p>
          <div className="mt-6 grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">{[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}</div>
        </div>
      )}
      {error && !busy && (
        <div className="card p-6 border-rose-200 bg-rose-50 text-rose-800 flex gap-3 items-start">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div className="text-sm space-y-2">
            <p className="font-extrabold">AI 설계 중 문제가 생겼어요.</p>
            <p className="break-all">{error}</p>
            <p className="text-rose-700">잠시 후 다시 시도해 주세요. (연결 모드: {mode.label}) 우선 <button className="underline font-bold" onClick={showSample}>예시 설계 보기</button>로 화면을 확인할 수 있어요.</p>
          </div>
        </div>
      )}
      {!result && !busy && !error && (
        <div className="text-center text-sm text-slate-500 no-print">
          아이디어를 입력해 설계를 시작하거나, <button onClick={showSample} className="inline-flex items-center gap-1 font-bold text-slate-800 underline"><Eye className="w-4 h-4" /> {hw.short} 예시 설계 미리보기</button>
        </div>
      )}

      {result && !busy && (
        <div ref={resultRef} className="scroll-mt-20">
        <ResultView
          hardware={HARDWARE_MAP[result.hwId]} platformKey={result.platformKey} result={result}
          onFeedback={result.sample ? undefined : onFeedback} onApplyFeedback={applyFeedback} busyFeedback={busyFb}
          variantOptions={HARDWARE_MAP[result.hwId].variants} onSwapVariant={swapVariant}
        />
        </div>
      )}
      {result?.sample && <p className="text-xs text-center text-slate-400 no-print">※ 예시 설계는 AI 호출 없이 내장된 데이터로 표시됩니다. 아이디어를 입력해 설계하면 피드백 기능도 사용할 수 있어요.</p>}
    </div>
  );
}
