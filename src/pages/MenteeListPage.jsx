// src/pages/MenteeListPage.jsx
import { useEffect, useState } from 'react'
import { fetchMentees } from '../api/menteeApi'

export default function MenteeListPage() {
  const [mentees, setMentees] = useState([])

  useEffect(() => {
    fetchMentees().then((data) => {
      setMentees(data)
    })
  }, [])

  return (
    <div>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>멘티 관리</h2>

      {/* 검색 영역 */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <input
          type="text"
          placeholder="이름, 학번, 관심 분야로 검색"
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
            color: '#fff',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          검색
        </button>
      </div>

      {/* 멘티 목록 테이블 */}
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
              <th style={thStyle}>이름</th>
              <th style={thStyle}>학번</th>
              <th style={thStyle}>전공</th>
              <th style={thStyle}>관심 분야</th>
              <th style={thStyle}>멘토 매칭 상태</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee) => (
              <tr key={mentee.id}>
                <td style={tdStyle}>{mentee.name}</td>
                <td style={tdStyle}>{mentee.studentId}</td>
                <td style={tdStyle}>{mentee.major}</td>
                <td style={tdStyle}>{mentee.interest}</td>
                <td style={tdStyle}>{mentee.matchStatus}</td>
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
