// src/components/admin/academic/TermTab.jsx
import React, { useEffect, useState } from 'react';
import academicApi from '../../../api/academicApi';

export default function TermTab() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [termName, setTermName] = useState('');
  const [termStartDate, setTermStartDate] = useState('');
  const [termEndDate, setTermEndDate] = useState('');
  const [termIsActive, setTermIsActive] = useState(true);

  const loadTerms = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const list = await academicApi.fetchSemesters(false);
      setTerms(list ?? []);
    } catch (err) {
      console.error('[TermTab] 학기 목록 로딩 오류', err);
      setErrorMessage('학기 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTerm = async (e) => {
    e.preventDefault();

    try {
      await academicApi.createSemester({
        name: termName,
        startDate: termStartDate,
        endDate: termEndDate,
        isActive: termIsActive,
      });

      setTermName('');
      setTermStartDate('');
      setTermEndDate('');
      setTermIsActive(true);

      await loadTerms();
    } catch (err) {
      console.error('[TermTab] 학기 생성 오류', err);
      setErrorMessage('학기 생성 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    loadTerms();
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
        학기 관리
      </h2>
      <p
        style={{
          marginBottom: '16px',
          fontSize: '13px',
          color: '#6b7280',
        }}
      >
        멘토링 프로그램과 연계되는 학기(Semester) 정보를 관리하는 화면입니다.
        GET <code>/api/academic/semesters</code> 로 가져온 DB 목록을 표시하고,
        아래 카드에서 새 학기를 등록할 수 있습니다.
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
          onClick={loadTerms}
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

      {loading && (
        <div
          style={{
            marginBottom: '12px',
            fontSize: '13px',
            color: '#6b7280',
          }}
        >
          학기 목록을 불러오는 중입니다…
        </div>
      )}

      {!loading && errorMessage && (
        <div
          style={{
            marginBottom: '12px',
            fontSize: '13px',
            color: '#b91c1c',
          }}
        >
          {errorMessage}
        </div>
      )}

      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          marginBottom: '24px',
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
              <th style={{ padding: '10px 16px', width: '70px' }}>ID</th>
              <th style={{ padding: '10px 16px' }}>학기명</th>
              <th style={{ padding: '10px 16px', width: '140px' }}>시작일</th>
              <th style={{ padding: '10px 16px', width: '140px' }}>종료일</th>
              <th style={{ padding: '10px 16px', width: '80px' }}>활성</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !errorMessage && terms.length === 0 && (
              <tr>
                <td
                  colSpan={5}
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
              terms.map((t) => (
                <tr key={t.id}>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>
                    {t.id}
                  </td>
                  <td style={{ padding: '10px 16px' }}>{t.name}</td>
                  <td style={{ padding: '10px 16px' }}>{t.startDate}</td>
                  <td style={{ padding: '10px 16px' }}>{t.endDate}</td>
                  <td style={{ padding: '10px 16px' }}>
                    {t.isActive ? 'Y' : 'N'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          marginBottom: '12px',
        }}
      >
        새 학기 등록
      </h3>
      <form
        onSubmit={handleCreateTerm}
        style={{
          maxWidth: '420px',
          width: '100%',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '16px 18px',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label
            htmlFor="termName"
            style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '13px',
            }}
          >
            학기명
          </label>
          <input
            id="termName"
            type="text"
            value={termName}
            onChange={(e) => setTermName(e.target.value)}
            placeholder="예: 2025-1학기"
            required
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              htmlFor="termStartDate"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '13px',
              }}
            >
              시작일
            </label>
            <input
              id="termStartDate"
              type="date"
              value={termStartDate}
              onChange={(e) => setTermStartDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label
              htmlFor="termEndDate"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '13px',
              }}
            >
              종료일
            </label>
            <input
              id="termEndDate"
              type="date"
              value={termEndDate}
              onChange={(e) => setTermEndDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <input
            id="termIsActive"
            type="checkbox"
            checked={termIsActive}
            onChange={(e) => setTermIsActive(e.target.checked)}
          />
          <label htmlFor="termIsActive" style={{ fontSize: '13px' }}>
            활성 학기로 설정
          </label>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '9px 14px',
            borderRadius: '8px',
            border: '1px solid #2563eb',
            backgroundColor: '#2563eb',
            color: '#f9fafb',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          학기 생성
        </button>
      </form>
    </section>
  );
}
