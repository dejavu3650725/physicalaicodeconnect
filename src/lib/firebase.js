// ============================================================
// Firebase 연동 — 설계 저장 · 내 설계 목록 · 짧은 공유 링크
//  - 환경변수(VITE_FIREBASE_*)가 없으면 모든 기능이 조용히 꺼진다(앱은 지금처럼 동작)
//  - 로그인 없이도 설계·공유(긴 링크)는 그대로. 로그인은 "저장"에서만 요구
//  - 보안은 firestore.rules 가 담당(본인 것만 쓰기, public 문서는 누구나 읽기)
// ============================================================
import { useEffect, useState } from 'react';
import { slimResult } from './share.js';

const env = import.meta.env;
const config = env.VITE_FIREBASE_API_KEY ? {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
} : null;

// Firebase SDK(≈300KB)는 설정이 있을 때만, 그것도 첫 사용 시점에 동적으로 불러온다(첫 화면 속도 보호)
let db = null, auth = null, F = null, readyP = null;
function ready() {
  if (!config) return Promise.resolve(null);
  if (!readyP) readyP = (async () => {
    const [{ initializeApp }, A, D] = await Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore')]);
    const app = initializeApp(config); auth = A.getAuth(app); db = D.getFirestore(app); F = { ...A, ...D };
    return true;
  })().catch((e) => { console.warn('[firebase] 초기화 실패', e); return null; });
  return readyP;
}
if (config) setTimeout(ready, 1500); // 첫 화면이 그려진 뒤 백그라운드 로드

export const isFirebaseEnabled = () => !!config;

/** 현재 로그인 사용자 훅 — { user, loading } */
export function useAuth() {
  const [state, setState] = useState({ user: auth?.currentUser || null, loading: !!config });
  useEffect(() => {
    if (!config) return undefined;
    let unsub = null, alive = true;
    ready().then((ok) => { if (!ok || !alive) { setState({ user: null, loading: false }); return; } unsub = F.onAuthStateChanged(auth, (u) => setState({ user: u, loading: false })); });
    return () => { alive = false; if (unsub) unsub(); };
  }, []);
  return state;
}

export async function signIn() {
  if (!(await ready())) throw new Error('Firebase가 설정되지 않았습니다.');
  const provider = new F.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const r = await F.signInWithPopup(auth, provider);
  return r.user;
}
export const signOut = async () => { if (await ready()) await F.signOut(auth); };
export const currentUser = () => auth?.currentUser || null;

// ---------- 설계 저장 ----------
const COL = 'designs';

/** 결과 저장 → 문서 id 반환. 로그인 필요 */
export async function saveDesign(result, { isPublic = true } = {}) {
  await ready(); const u = currentUser(); if (!db || !u) throw new Error('로그인이 필요합니다.');
  const slim = slimResult(result);
  const ref = await F.addDoc(F.collection(db, COL), {
    ownerUid: u.uid, ownerName: u.displayName || '', ownerPhoto: u.photoURL || '',
    hwId: slim.hwId, platformKey: slim.platformKey, title: slim.title || '', idea: slim.idea || '', summary: slim.summary || '',
    blockCount: { basic: countSafe(slim.levels.basic), standard: countSafe(slim.levels.standard), advanced: countSafe(slim.levels.advanced) },
    data: JSON.stringify(slim), // 블록 트리는 중첩 배열이 있어 문자열로 저장(1MB 한도 내)
    public: isPublic, createdAt: F.serverTimestamp(), updatedAt: F.serverTimestamp(),
  });
  return ref.id;
}
function countSafe(lv) { try { let n = 0; const walk = (bs) => { for (const b of bs || []) { n++; walk(b.children); walk(b.elseChildren); } }; walk(lv?.blocks); return n; } catch { return 0; } }

/** 공개 문서 또는 본인 문서 읽기 */
export async function getDesign(id) {
  if (!(await ready())) throw new Error('Firebase가 설정되지 않았습니다.');
  const snap = await F.getDoc(F.doc(db, COL, id));
  if (!snap.exists()) throw new Error('설계를 찾을 수 없습니다(삭제되었거나 비공개).');
  const d = snap.data();
  return { id: snap.id, meta: d, result: JSON.parse(d.data) };
}

export async function listMyDesigns(max = 50) {
  await ready(); const u = currentUser(); if (!db || !u) return [];
  // 복합 인덱스 없이 동작하도록 where 만 쓰고 정렬은 클라이언트에서
  const q = F.query(F.collection(db, COL), F.where('ownerUid', '==', u.uid), F.limit(max));
  const snap = await F.getDocs(q);
  return snap.docs.map((s) => ({ id: s.id, ...s.data(), data: undefined })).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
}
export const setDesignPublic = async (id, isPublic) => { await ready(); return F.updateDoc(F.doc(db, COL, id), { public: isPublic, updatedAt: F.serverTimestamp() }); };
export const deleteDesign = async (id) => { await ready(); return F.deleteDoc(F.doc(db, COL, id)); };

export function shortShareUrl(id) {
  return `${window.location.origin}${window.location.pathname}#/d/${id}`;
}
