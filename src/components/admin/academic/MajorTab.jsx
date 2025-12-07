// src/components/admin/academic/MajorTab.jsx
import { useEffect, useState } from 'react';
import academicApi from '../../../api/academicApi';

export default function MajorTab() {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadMajors = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const list = await academicApi.fetchMajors();
      setMajors(list ?? []);
    } catch (err) {
      console.error('[MajorTab] 전공 목록 로딩 오류', err);
      setErrorMessage('전공 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMajors();
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
        전공 관리
      </h2>
      <p
        style={{
          marginBottom: '16px',
          fontSize: '13px',
          color: '#6b7280',
        }}
      >
        학습 멘토·멘티 프로그램과 연계되는 전공 정보를 관리하는 화면입니다.
        현재는 GET <code>/api/academic/majors</code> 로 가져온 DB 목록을
        표시합니다.
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
          onClick={loadMajors}
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
              <th style={{ padding: '10px 16px' }}>전공명</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={2}
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
                  colSpan={2}
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

            {!loading && !errorMessage && majors.length === 0 && (
              <tr>
                <td
                  colSpan={2}
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
              majors.map((m) => (
                <tr key={m.id}>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>
                    {m.id}
                  </td>
                  <td style={{ padding: '10px 16px' }}>{m.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
