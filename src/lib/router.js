import { useEffect, useState, useCallback } from 'react';

function parse() {
  const h = window.location.hash.replace(/^#/, '') || '/';
  const [path, qs] = h.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs || ''));
  const segs = path.split('/').filter(Boolean);
  return { path: '/' + segs.join('/'), segs, query };
}

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const navigate = useCallback((to) => { window.location.hash = to.startsWith('#') ? to.slice(1) : to; }, []);
  return { ...route, navigate };
}

export function href(path, query) {
  const qs = query ? '?' + new URLSearchParams(Object.fromEntries(Object.entries(query).filter(([, v]) => v != null && v !== ''))).toString() : '';
  return `#${path}${qs}`;
}
