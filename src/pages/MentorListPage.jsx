// src/pages/MentorListPage.jsx
import { useEffect, useState } from 'react'
import { fetchMentorList } from '../api/mentorApi'

export default function MentorListPage() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: 20,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadMentors() {
      try {
        setLoading(true)
        setError(null)

        const result = await fetchMentorList({ page, size: data.size })

        // result 예시:
        // { content: [...], totalElements, totalPages, number, size }
        setData((prev) => ({
          ...prev,
          ...result,
        }))
      } catch (err) {
        console.error('멘토 목록 로딩 실패:', err)

        const message =
          err?.response?.data?.message ||
          err.message ||
          '멘토 목록을 불러오는 중 오류가 발생했습니다.'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadMentors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const mentors = data.content || []
  const hasPrev = page > 0
  const hasNext =
    typeof data.totalPages === 'number' && page < data.totalPages - 1

  const handlePrev = () => {
    if (hasPrev) {
      setPage((p) => p - 1)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      setPage((p) => p + 1)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '8px',
          }}
        >
          멘토 목록
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '16px',
          }}
        >
          프로그램에 등록된 멘토 계정 목록입니다.
        </p>

        {/* 로딩 상태 */}
        {loading && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
              fontSize: '14px',
            }}
          >
            멘토 목록을 불러오는 중입니다...
          </div>
        )}

        {/* 오류 상태 */}
        {!loading && error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
              fontSize: '14px',
              marginBottom: '12px',
            }}
          >
            멘토 목록을 불러오지 못했습니다.
            <br />
            <span style={{ fontSize: '13px', color: '#991b1b' }}>{error}</span>
          </div>
        )}

        {/* 데이터 테이블 */}
        {!loading && !error && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead
                style={{
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>이름</th>
                  <th style={thStyle}>이메일</th>
                  <th style={thStyle}>전공</th>
                  <th style={thStyle}>학번</th>
                  <th style={thStyle}>역할</th>
                </tr>
              </thead>
              <tbody>
                {mentors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        color: '#9ca3af',
                      }}
                    >
                      표시할 멘토가 없습니다.
                    </td>
                  </tr>
                ) : (
                  mentors.map((mentor) => (
                    <tr key={mentor.id}>
                      <td style={tdStyle}>{mentor.id}</td>
                      <td style={tdStyle}>{mentor.name}</td>
                      <td style={tdStyle}>{mentor.email}</td>
                      <td style={tdStyle}>{mentor.majorName}</td>
                      <td style={tdStyle}>{mentor.studentId}</td>
                      <td style={tdStyle}>{mentor.role}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 하단 페이징 영역 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
              }}
            >
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                총 {data.totalElements ?? 0}명
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: hasPrev ? '#ffffff' : '#e5e7eb',
                    color: '#374151',
                    fontSize: '13px',
                    cursor: hasPrev ? 'pointer' : 'default',
                  }}
                >
                  이전
                </button>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {data.number + 1} / {data.totalPages || 1}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasNext}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: hasNext ? '#ffffff' : '#e5e7eb',
                    color: '#374151',
                    fontSize: '13px',
                    cursor: hasNext ? 'pointer' : 'default',
                  }}
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const thStyle = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '13px',
  color: '#4b5563',
  borderBottom: '1px solid #e5e7eb',
}

const tdStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid #f3f4f6',
  color: '#374151',
  fontSize: '14px',
}
