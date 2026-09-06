import React, { useMemo, useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { compileTree, PLATFORMS } from '../blocks/engine.js';

function highlight(code, langKey) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const kw = langKey === 'js'
    ? /\b(function|let|const|if|else|for|while|return|true|false|new|break|continue)\b/g
    : /\b(def|if|elif|else|for|while|in|return|True|False|None|import|from|as|not|and|or|global|await|async|break|continue|lambda|pass|raise)\b/g;
  return code.split('\n').map((line) => {
    let s = esc(line);
    const cm = langKey === 'js' ? s.indexOf('//') : s.indexOf('#');
    let comment = '';
    if (cm >= 0 && !/["'][^"']*$/.test(s.slice(0, cm))) { comment = s.slice(cm); s = s.slice(0, cm); }
    s = s.replace(/("[^"]*"|'[^']*')/g, '<span class="str">$1</span>')
      .replace(kw, '<span class="kw">$1</span>')
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>')
      .replace(/\b([A-Za-z_][\w]*)\s*(?=\()/g, '<span class="fn">$1</span>');
    return s + (comment ? `<span class="cm">${comment}</span>` : '');
  }).join('\n');
}

export default function CodePanel({ platformKey, blocks, minHeight = 260 }) {
  const plat = PLATFORMS[platformKey];
  const [langKey, setLangKey] = useState(plat.langs[0].key);
  const [copied, setCopied] = useState(false);
  const out = useMemo(() => compileTree(platformKey, blocks || [], langKey), [platformKey, blocks, langKey]);
  const lang = plat.langs.find((l) => l.key === langKey) || plat.langs[0];
  const copy = async () => { try { await navigator.clipboard.writeText(out.code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ } };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="seg">
          {plat.langs.map((l) => <button key={l.key} className={langKey === l.key ? 'on' : ''} onClick={() => setLangKey(l.key)}>{l.label}</button>)}
        </div>
        <button onClick={copy} className="btn btn-dark !py-2 !px-3 text-xs">{copied ? <><Check className="w-4 h-4 text-lime-300" /> 복사 완료!</> : <><Copy className="w-4 h-4" /> 코드 복사</>}</button>
      </div>
      <div className="code-dark p-4 overflow-x-auto scrollbar-thin" style={{ minHeight }}>
        <pre className="whitespace-pre" dangerouslySetInnerHTML={{ __html: highlight(out.code, langKey) }} />
      </div>
      <div className="text-xs text-slate-500 font-medium flex gap-2 items-start"><Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" /><span>{lang.hint}</span></div>
      {out.notes.map((n, i) => <div key={i} className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">{n}</div>)}
    </div>
  );
}
