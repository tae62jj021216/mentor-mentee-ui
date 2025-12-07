// src/components/admin/academic/ProgramTab.jsx
import { useEffect, useState } from 'react';
import academicApi from '../../../api/academicApi';

export default function ProgramTab() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadPrograms = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const list = await academicApi.fetchPrograms();
      setPrograms(list ?? []);
    } catch (err) {
      console.error('[ProgramTab] 프로그램 목록 로딩 오류', err);
      setErrorMessage('프로그램 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  return (
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
        화면입니다. 현재는 GET <code>/api/academic/programs</code> 로 가져온
        DB 목록을 표시합니다.
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
                    {p.semesterId ?? '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
