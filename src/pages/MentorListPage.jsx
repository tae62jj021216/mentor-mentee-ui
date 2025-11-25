import { useEffect, useState } from 'react'
import { fetchMentors } from '../api/mentorApi'

export default function MentorListPage() {
  const [mentors, setMentors] = useState([])

  useEffect(() => {
    fetchMentors().then(data => setMentors(data))
  }, [])

  return (
    <div>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>멘토 관리</h2>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>멘토 목록</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerStyle}>이름</th>
              <th style={headerStyle}>학번</th>
              <th style={headerStyle}>전공</th>
              <th style={headerStyle}>상담 분야</th>
              <th style={headerStyle}>상태</th>
            </tr>
          </thead>

          <tbody>
            {mentors.map((mentor) => (
              <tr key={mentor.id}>
                <td style={cellStyle}>{mentor.name}</td>
                <td style={cellStyle}>{mentor.studentId}</td>
                <td style={cellStyle}>{mentor.major}</td>
                <td style={cellStyle}>{mentor.field}</td>
                <td style={cellStyle}>{mentor.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const headerStyle = {
  padding: '12px',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
}

const cellStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
  fontSize: '14px',
}
