import React, { useEffect, useState } from 'react';
import { X, Bot } from 'lucide-react';

const SERVICE = '피지컬 AI 코드 커넥트';
const OPERATOR = '서울고덕초등학교 금정민';
const ORG = '서울특별시교육청 AI피지컬컴퓨팅융합교육연구회';
const EFFECTIVE = '2026년 9월 1일';

const TERMS = {
  title: '이용약관',
  intro: `본 약관은 ${ORG}(운영자: ${OPERATOR})가 제공하는 웹 서비스 「${SERVICE}」(이하 "서비스")의 이용 조건과 절차, 이용자와 운영자의 권리·의무 및 책임 사항을 규정합니다.`,
  articles: [
    { no: 1, title: '목적', body: [`본 약관은 서비스의 이용과 관련하여 운영자와 이용자 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.`] },
    { no: 2, title: '정의', body: [
      `"서비스"란 교사가 학생의 아이디어를 입력하면 햄스터봇, 마이크로비트, 토리드론, 레고 스파이크 프라임 등 피지컬 컴퓨팅 교구에 실제 존재하는 블록으로 조립도·텍스트 코드·수업 흐름을 설계해 주고, 교구 연결 튜토리얼을 제공하는 「${SERVICE}」를 말합니다.`,
      `"이용자"란 본 약관에 따라 서비스를 이용하는 교사, 학생 및 교육 관계자를 말합니다.`,
      `"설계 결과물"이란 서비스가 이용자의 입력을 바탕으로 생성한 블록 조립도, 코드, 차시 계획, 평가·안전 지도 내용 등을 말합니다.`,
    ] },
    { no: 3, title: '약관의 효력 및 변경', body: [
      `본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.`,
      `운영자는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경된 약관은 서비스 화면에 게시한 때부터 효력이 발생합니다.`,
      `이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있으며, 변경 이후 계속 이용하는 경우 변경에 동의한 것으로 봅니다.`,
    ] },
    { no: 4, title: '서비스의 제공 및 변경', body: [
      `운영자는 다음의 서비스를 제공합니다. ① 코드 커넥트(아이디어 기반 블록 조립도·코드·수업 흐름 설계) ② 교구 연결 튜토리얼 ③ 수업 설계 가이드 ④ 기타 운영자가 정하는 교육 지원 기능`,
      `서비스는 비영리 교육 목적으로 무료로 제공되며, 회원 가입 없이 이용할 수 있습니다.`,
      `운영자는 교육적 필요, 기술적 사정, 외부 인공지능 서비스의 정책 변경 등에 따라 서비스의 내용을 변경·중단할 수 있으며, 이 경우 서비스 화면을 통해 안내합니다.`,
    ] },
    { no: 5, title: '이용자의 의무', body: [
      `이용자는 서비스를 교육 목적에 맞게 이용하여야 하며, 타인의 권리를 침해하거나 법령에 위반되는 내용을 입력해서는 안 됩니다.`,
      `이용자는 학생의 이름, 사진, 연락처 등 개인정보 또는 민감한 정보를 아이디어 입력란에 기재하지 않아야 합니다.`,
      `이용자는 자동화된 수단으로 서비스에 과도한 요청을 보내거나, 서비스의 정상적인 운영을 방해하는 행위를 하여서는 안 됩니다.`,
    ] },
    { no: 6, title: '저작권 및 설계 결과물의 이용', body: [
      `서비스의 화면 구성, 브랜드, 블록 카탈로그 구조, 튜토리얼 등 서비스 자체에 대한 권리는 운영자에게 있습니다.`,
      `서비스가 생성한 설계 결과물은 이용자가 자신의 수업 및 학교 교육활동에 자유롭게 활용할 수 있습니다. 단, 결과물을 상업적으로 판매·배포하는 경우에는 운영자와 사전에 협의하여야 합니다.`,
      `서비스에 표기된 엔트리, 마이크로비트·MakeCode, 레고 스파이크, 로보링크, 바이로봇 등 교구·플랫폼의 명칭과 블록 명칭은 각 권리자의 상표 또는 저작물이며, 서비스는 교육적 호환을 위해 이를 참조합니다.`,
    ] },
    { no: 7, title: '면책', body: [
      `설계 결과물은 인공지능이 생성한 초안으로, 운영자는 그 정확성·완전성·특정 교구에서의 실제 작동을 보증하지 않습니다. 이용자는 수업 적용 전 결과물을 검토하고 안전 수칙을 확인하여야 합니다.`,
      `드론·로봇 등 교구 사용 중 발생한 안전사고, 기기 손상 및 외부 인공지능 서비스의 장애로 인한 손해에 대하여 운영자는 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.`,
      `운영자는 천재지변, 통신 장애, 외부 서비스 중단 등 불가항력으로 인한 서비스 제공 중단에 대하여 책임을 지지 않습니다.`,
    ] },
  ],
  addendum: [`본 약관은 ${EFFECTIVE}부터 시행합니다.`],
};

const PRIVACY = {
  title: '개인정보처리방침',
  intro: `${ORG}(운영자: ${OPERATOR})는 「${SERVICE}」 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 서비스는 회원 가입 없이 이용하는 교육용 서비스로, 개인정보를 최소한으로만 처리합니다.`,
  articles: [
    { no: 1, title: '개인정보의 처리 목적 및 항목', body: [
      `서비스는 회원 가입 없이 이용할 수 있으며, 기본 이용(설계·공유·튜토리얼)에서는 이름·연락처 등 개인정보를 요구하지 않습니다. 저장 기능을 쓰기 위한 선택적 구글 로그인은 제2조에 따릅니다.`,
      `이용자가 아이디어 입력란에 스스로 기재한 내용은 설계 결과 생성을 위해서만 처리되며, 운영자는 여기에 개인정보를 포함하지 않도록 안내합니다.`,
    ] },
    { no: 2, title: '선택적 로그인(구글 계정) 시 처리하는 정보', body: [
      `설계 결과를 저장하거나 짧은 공유 링크를 만들기 위해 이용자가 스스로 구글 계정으로 로그인하는 경우에 한해, Google Firebase Authentication을 통해 계정 식별자(UID), 표시 이름, 이메일, 프로필 사진 URL이 처리됩니다. 로그인하지 않아도 서비스의 설계·공유 기능은 모두 이용할 수 있습니다.`,
      `저장한 설계(제목, 아이디어 문장, 블록 구성, 수업 흐름)는 Google Firebase(Firestore)에 저장되며, 이용자가 '공개'로 둔 설계는 링크를 가진 사람이 볼 수 있고 '비공개'로 바꾸거나 언제든 삭제할 수 있습니다. 운영자는 이 정보를 서비스 제공 외의 목적으로 이용하지 않습니다.`,
    ] },
    { no: 3, title: '브라우저 저장 정보(localStorage)', body: [
      `튜토리얼 진행 상태, 최근 선택한 교구 등 편의 정보는 이용자 기기의 브라우저 저장 공간(localStorage)에만 저장되며, 운영자의 서버로 전송되지 않습니다.`,
      `이용자는 브라우저 설정에서 사이트 데이터를 삭제함으로써 저장된 정보를 언제든지 삭제할 수 있습니다.`,
    ] },
    { no: 4, title: '외부 인공지능 서비스로의 전송', body: [
      `설계 결과 생성을 위해 이용자가 입력한 아이디어·학급 조건 텍스트는 운영자의 중계 서버를 거쳐 Google Gemini API로 전송됩니다. 이 과정에서 이용자의 이름, 이메일, 기기 식별 정보는 전송되지 않습니다.`,
      `전송된 텍스트의 처리는 Google의 개인정보처리방침 및 API 이용 정책에 따르며, 운영자는 요청 내용을 서버에 보관하지 않습니다.`,
    ] },
    { no: 5, title: '호스팅 및 접속 기록', body: [
      `서비스는 Vercel Inc.의 호스팅 인프라를 통해 제공됩니다. 서비스 제공 과정에서 IP 주소, 접속 시각, 브라우저 종류 등 접속 기록이 호스팅 사업자의 시스템에 일시적으로 남을 수 있으며, 이는 서비스 안정성 확보 목적으로만 이용됩니다.`,
    ] },
    { no: 6, title: '개인정보의 보유 및 파기', body: [
      `로그인하지 않은 이용에 대해 운영자는 개인정보를 보유하지 않습니다. 로그인한 이용자의 계정 정보와 저장한 설계는 이용자가 삭제하거나 탈퇴를 요청할 때까지 보유하며, 요청 시 지체 없이 파기합니다.`,
    ] },
    { no: 7, title: '이용자의 권리', body: [
      `이용자는 언제든지 서비스 이용을 중단할 수 있으며, 개인정보 처리와 관련한 문의·요청은 아래 정보관리책임자에게 할 수 있습니다.`,
      `만 14세 미만 학생이 교사의 지도 아래 서비스를 이용하는 경우, 교사는 학생이 개인정보를 입력하지 않도록 지도하여야 합니다.`,
    ] },
    { no: 8, title: '정보관리책임자', body: [
      `정보관리책임자: 금정민 (서울고덕초등학교)`,
      `소속: ${ORG}`,
      `문의: 서울고덕초등학교를 통해 정보관리책임자에게 문의할 수 있습니다.`,
    ] },
  ],
  addendum: [`본 방침은 ${EFFECTIVE}부터 시행합니다.`],
};

function LegalModal({ doc, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#0b1220]/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={doc.title}>
      <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0">
          <div>
            <div className="text-[11px] font-black tracking-widest text-[#5a8d00] uppercase">{SERVICE}</div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">{doc.title}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full grid place-items-center hover:bg-slate-100 text-slate-500" aria-label="닫기"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto px-6 py-6 text-[15px] leading-relaxed text-slate-700">
          <p className="text-slate-600">{doc.intro}</p>
          {doc.articles.map((a) => (
            <section key={a.no} className="mt-7">
              <h3 className="font-black text-slate-900 text-base">제{a.no}조 ({a.title})</h3>
              <ol className="mt-2 space-y-1.5 pl-1">
                {a.body.map((t, i) => <li key={i} className="flex gap-2"><span className="shrink-0 text-slate-400 font-bold">{a.body.length > 1 ? `${i + 1}.` : ''}</span><span>{t}</span></li>)}
              </ol>
            </section>
          ))}
          <section className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="font-black text-slate-900 text-base">부칙</h3>
            {doc.addendum.map((t, i) => <p key={i} className="mt-2">{t}</p>)}
          </section>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end"><button className="btn btn-dark !py-2.5 !px-5 text-sm" onClick={onClose}>확인</button></div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [doc, setDoc] = useState(null);
  return (
    <footer className="mt-16 bg-[#0b1220] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2.5" translate="no">
          <span className="bg-gradient-to-tr from-[#76b900] to-[#22c55e] p-1.5 rounded-lg"><Bot className="w-4 h-4 text-white" /></span>
          <span className="font-black tracking-tight text-white">피지컬 AI <span className="text-lime-300">코드 커넥트</span></span>
        </div>
        <p className="mt-2 text-sm font-bold text-slate-400">{ORG}</p>
        <div className="mt-6 flex items-center justify-center gap-3 text-sm font-bold">
          <button onClick={() => setDoc(TERMS)} className="hover:text-white underline-offset-4 hover:underline">이용약관</button>
          <span className="text-slate-600">|</span>
          <button onClick={() => setDoc(PRIVACY)} className="hover:text-white underline-offset-4 hover:underline">개인정보처리방침</button>
        </div>
        <p className="mt-4 text-xs text-slate-400">정보관리책임자: 금정민</p>
        <p className="mt-1 text-xs text-slate-500">© 2026 서울고덕초등학교 금정민. All rights reserved.</p>
      </div>
      {doc && <LegalModal doc={doc} onClose={() => setDoc(null)} />}
    </footer>
  );
}
