// src/pages/SessionListPage.jsx
import { useEffect, useState } from 'react'
import { fetchSessions } from '../api/sessionApi'

export default function SessionListPage() {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    fetchSessions().then((data) => {
      setSessions(data)
    })
  }, [])

  return (
    <div>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>상담/세션 관리</h2>

      {/* 필터 + 검색 영역 */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <select
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
          }}
        >
          <option value="">전체 상태</option>
          <option value="진행 중">진행 중</option>
          <option value="대기">대기</option>
          <option value="완료">완료</option>
        </select>

        <input
          type="text"
          placeholder="멘토/멘티 이름, 주제로 검색"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
          }}
        />

        <button
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#1f2933',
            color: '#ffffff',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          검색
        </button>
      </div>

      {/* 세션 목록 테이블 */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={thStyle}>멘토</th>
              <th style={thStyle}>멘티</th>
              <th style={thStyle}>주제</th>
              <th style={thStyle}>상태</th>
              <th style={thStyle}>일자</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td style={tdStyle}>{session.mentorName}</td>
                <td style={tdStyle}>{session.menteeName}</td>
                <td style={tdStyle}>{session.topic}</td>
                <td style={tdStyle}>{session.status}</td>
                <td style={tdStyle}>{session.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle = {
  padding: '10px 12px',
  fontSize: '14px',
  color: '#4b5563',
  textAlign: 'left',
  borderBottom: '1px solid #e5e7eb',
}

const tdStyle = {
  padding: '10px 12px',
  fontSize: '14px',
  color: '#111827',
  borderBottom: '1px solid #f3f4f6',
}
