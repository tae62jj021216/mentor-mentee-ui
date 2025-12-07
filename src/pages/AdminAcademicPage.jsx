// src/pages/AdminAcademicPage.jsx
import React, { useState } from 'react';
import MajorTab from '../components/admin/academic/MajorTab';
import ProgramTab from '../components/admin/academic/ProgramTab';
import TermTab from '../components/admin/academic/TermTab';

const TAB_MAJOR = 'MAJOR';
const TAB_TERM = 'TERM';
const TAB_PROGRAM = 'PROGRAM';

export default function AdminAcademicPage() {
  const [activeTab, setActiveTab] = useState(TAB_PROGRAM);

  return (
    <div style={{ padding: '24px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: '8px',
        }}
      >
        학사 관리 (Academic)
      </h1>
      <p style={{ marginBottom: '24px', color: '#4b5563', fontSize: '14px' }}>
        전공, 학기, 멘토링 프로그램 정보를 관리하는 관리자 화면입니다. 실제 데이터
        연동은 이후 단계에서 점차 확장할 예정이며, 지금은 전공 · 학기 · 프로그램
        목록을 백엔드 DB와 연동하여 확인합니다.
      </p>

      {/* 탭 버튼 영역 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_MAJOR)}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            border: '1px solid #e5e7eb',
            backgroundColor: activeTab === TAB_MAJOR ? '#111827' : 'transparent',
            color: activeTab === TAB_MAJOR ? '#f9fafb' : '#374151',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          전공
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_TERM)}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            border: '1px solid #e5e7eb',
            backgroundColor: activeTab === TAB_TERM ? '#111827' : 'transparent',
            color: activeTab === TAB_TERM ? '#f9fafb' : '#374151',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          학기
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_PROGRAM)}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            border: '1px solid #e5e7eb',
            backgroundColor:
              activeTab === TAB_PROGRAM ? '#111827' : 'transparent',
            color: activeTab === TAB_PROGRAM ? '#f9fafb' : '#374151',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          프로그램
        </button>
      </div>

      {activeTab === TAB_MAJOR && <MajorTab />}
      {activeTab === TAB_TERM && <TermTab />}
      {activeTab === TAB_PROGRAM && <ProgramTab />}
    </div>
  );
}
