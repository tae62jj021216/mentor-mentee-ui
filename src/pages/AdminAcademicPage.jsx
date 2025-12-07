// src/pages/AdminAcademicPage.jsx
import React, { useEffect, useState } from 'react';
import academicApi from '../api/academicApi';

const TAB_MAJOR = 'MAJOR';
const TAB_TERM = 'TERM';
const TAB_PROGRAM = 'PROGRAM';

export default function AdminAcademicPage() {
  const [activeTab, setActiveTab] = useState(TAB_PROGRAM);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 프로그램 목록 로딩
  const loadPrograms = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const list = await academicApi.fetchPrograms();
      setPrograms(list ?? []);
    } catch (err) {
      console.error('[AdminAcademic] 프로그램 목록 로딩 오류', err);
      setErrorMessage('프로그램 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 최초 진입 시 + 탭이 "프로그램"일 때만 로딩
  useEffect(() => {
    if (activeTab === TAB_PROGRAM) {
      loadPrograms();
    }
  }, [activeTab]);

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
        전공, 학기, 멘토링 프로그램 정보를 관리하는 관리자 화면입니다. 실제 데이터 연동은
        이후 단계에서 점차 확장할 예정이며, 지금은 프로그램 목록을 백엔드 DB와 연동하여
        확인합니다.
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
            backgroundColor: activeTab === TAB_PROGRAM ? '#111827' : 'transparent',
            color: activeTab === TAB_PROGRAM ? '#f9fafb' : '#374151',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          프로그램
        </button>
      </div>

      {/* 프로그램 탭 내용 */}
      {activeTab === TAB_PROGRAM && (
        <section>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            프로그램 관리
          </h2>
          <p
            style={{
              marginBottom: '16px',
              fontSize: '13px',
              color: '#6b7280',
            }}
          >
            멘토링/튜터링/학습공동체 등 멘토링 프로그램을 학기와 연계하여 관리하는
            화면입니다. 현재는 GET <code>/api/academic/programs</code> 로
            가져온 DB 목록을 표시합니다.
          </p>

          <div
            style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={loadPrograms}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #2563eb',
                backgroundColor: '#2563eb',
                color: '#f9fafb',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              새로고침
            </button>
          </div>

          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px',
              }}
            >
              <thead
                style={{
                  backgroundColor: '#f9fafb',
                  textAlign: 'left',
                }}
              >
                <tr>
                  <th style={{ padding: '10px 16px', width: '80px' }}>ID</th>
                  <th style={{ padding: '10px 16px' }}>프로그램명</th>
                  <th style={{ padding: '10px 16px', width: '140px' }}>유형</th>
                  <th style={{ padding: '10px 16px', width: '140px' }}>
                    소속 학기(ID)
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: '18px 16px',
                        textAlign: 'center',
                        color: '#6b7280',
                      }}
                    >
                      불러오는 중입니다…
                    </td>
                  </tr>
                )}

                {!loading && errorMessage && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: '18px 16px',
                        textAlign: 'center',
                        color: '#b91c1c',
                      }}
                    >
                      {errorMessage}
                    </td>
                  </tr>
                )}

                {!loading && !errorMessage && programs.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: '18px 16px',
                        textAlign: 'center',
                        color: '#6b7280',
                      }}
                    >
                      (데이터 없음)
                    </td>
                  </tr>
                )}

                {!loading &&
                  !errorMessage &&
                  programs.map((p) => (
                    <tr key={p.id}>
                      <td style={{ padding: '10px 16px', color: '#6b7280' }}>
                        {p.id}
                      </td>
                      <td style={{ padding: '10px 16px' }}>{p.name}</td>
                      <td style={{ padding: '10px 16px' }}>{p.type}</td>
                      <td style={{ padding: '10px 16px' }}>
                        {p.termId ?? '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 전공/학기 탭 placeholder */}
      {activeTab !== TAB_PROGRAM && (
        <div
          style={{
            marginTop: '40px',
            padding: '18px 20px',
            borderRadius: '12px',
            backgroundColor: '#f9fafb',
            border: '1px dashed #e5e7eb',
            fontSize: '13px',
            color: '#6b7280',
          }}
        >
          아직 전공/학기 탭은 UI만 마련된 상태입니다. 먼저 프로그램 탭에 대해
          백엔드 연동을 완료한 다음, 순차적으로 확장할 예정입니다.
        </div>
      )}
    </div>
  );
}
