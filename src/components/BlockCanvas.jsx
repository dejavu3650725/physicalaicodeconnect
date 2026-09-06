import React from 'react';
import { PLATFORMS, getBlockDef } from '../blocks/engine.js';

/**
 * 블록 트리 → 실제 도구(엔트리/메이크코드/스파이크) 모양의 블록 조립도 렌더링
 */
export default function BlockCanvas({ platformKey, blocks, animate = true, compact = false, showCategory = true }) {
  const plat = PLATFORMS[platformKey];
  if (!plat) return null;
  return (
    <div className={`bk-canvas bk-theme-${plat.theme} ${compact ? 'bk-compact' : ''} ${animate ? 'bk-anim' : ''}`}>
      {(!blocks || blocks.length === 0) && <div className="text-slate-400 text-sm font-semibold">블록이 없습니다.</div>}
      {blocks?.map((b, i) => (
        <div className="bk-stack" key={i} style={{ animationDelay: `${i * 80}ms` }}>
          <Stack platformKey={platformKey} blocks={[b]} showCategory={showCategory} isTop />
        </div>
      ))}
    </div>
  );
}

function Stack({ platformKey, blocks, showCategory, isTop }) {
  return (
    <>
      {blocks.map((b, i) => (
        <Block key={i} platformKey={platformKey} node={b} showCategory={showCategory} isLast={i === blocks.length - 1 && !isTop} delay={i} />
      ))}
    </>
  );
}

function colorVars(platformKey, def) {
  const c = PLATFORMS[platformKey].colors[def?.cat] || { fill: '#64748b', dark: '#475569' };
  return { '--bk-fill': c.fill, '--bk-dark': c.dark, '--bk-text': c.text || '#fff' };
}

function Block({ platformKey, node, showCategory, isLast, delay = 0 }) {
  const def = getBlockDef(platformKey, node.type);
  if (!def) return <div className="bk-block" style={{ '--bk-fill': '#94a3b8', '--bk-dark': '#64748b' }}>알 수 없는 블록: {node.type}</div>;
  const style = { ...colorVars(platformKey, def), animationDelay: `${delay * 60}ms` };
  const catLabel = PLATFORMS[platformKey].colors[def.cat]?.label;
  const content = <Caption platformKey={platformKey} def={def} node={node} />;
  const tag = showCategory && catLabel ? <span className="bk-tag">{catLabel}</span> : null;

  if (def.shape === 'value') return <span className="bk-value" style={style}>{content}</span>;
  if (def.shape === 'boolean') return <span className="bk-bool" style={style}>{content}</span>;

  if (def.shape === 'hat') {
    return (
      <div className="bk-c" style={style}>
        <div className="bk-block bk-hat" style={style}>{tag}{content}</div>
        <Arm platformKey={platformKey} blocks={node.children} showCategory={showCategory} hat />
      </div>
    );
  }
  if (def.shape === 'c' || def.shape === 'c_else') {
    return (
      <div className={`bk-c ${isLast ? 'bk-cap-end' : ''}`} style={style}>
        <div className="bk-block" style={style}>{tag}{content}</div>
        <Arm platformKey={platformKey} blocks={node.children} showCategory={showCategory} />
        {def.shape === 'c_else' && (
          <>
            <div className="bk-else">{def.tplElse || '아니면'}</div>
            <Arm platformKey={platformKey} blocks={node.elseChildren} showCategory={showCategory} />
          </>
        )}
        <div className="bk-foot" />
      </div>
    );
  }
  return <div className={`bk-block ${isLast ? 'bk-cap-end' : ''}`} style={style} data-text>{tag}{content}</div>;
}

function Arm({ platformKey, blocks, showCategory, hat }) {
  return (
    <div className="bk-arm">
      <div className="bk-armbar" />
      <div className="bk-inner">
        {blocks && blocks.length ? <Stack platformKey={platformKey} blocks={blocks} showCategory={showCategory} /> : <span className="bk-inner-empty">{hat ? '여기에 블록을 넣어요' : '(비어 있음)'}</span>}
      </div>
    </div>
  );
}

/** 템플릿 문자열을 토큰으로 나눠 필드/드롭다운/중첩 블록으로 렌더링 */
function Caption({ platformKey, def, node }) {
  const parts = def.tpl.split(/(%[A-Z_0-9]+)/g).filter((s) => s !== '');
  return (
    <>
      {parts.map((p, i) => {
        if (!p.startsWith('%')) return <span key={i}>{p.trim()}</span>;
        const key = p.slice(1);
        const pdef = def.params?.[key];
        if (!pdef) return null;
        const v = node.params?.[key];
        if (pdef.kind === 'dropdown') {
          const opt = (pdef.options || []).find((o) => o[1] === v);
          return <span key={i} className="bk-dd">{opt ? opt[0] : String(v ?? pdef.def)}</span>;
        }
        if (pdef.kind === 'variable') return <span key={i} className="bk-var">{String(v ?? pdef.def)}</span>;
        if (v && typeof v === 'object') return <Block key={i} platformKey={platformKey} node={v} showCategory={false} />;
        if (pdef.kind === 'boolean') return <span key={i} className="bk-bool-empty" />;
        return <span key={i} className="bk-field">{String(v ?? pdef.def ?? '')}</span>;
      })}
    </>
  );
}
