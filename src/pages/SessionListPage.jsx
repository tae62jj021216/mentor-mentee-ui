// src/pages/SessionListPage.jsx

export default function SessionListPage() {
  return (
    <div>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>상담/세션 관리</h2>

      {/* 필터/검색 영역 */}
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
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
          }}
        >
          <option value="">전체 상태</option>
          <option value="ongoing">진행 중</option>
          <option value="pending">대기</option>
          <option value="done">완료</option>
        </select>

        <input
          type="text"
          placeholder="멘토/멘티 이름으로 검색"
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

      {/* 상담/세션 목록 테이블 */}
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
              <th style={thStyle}>번호</th>
              <th style={thStyle}>멘토</th>
              <th style={thStyle}>멘티</th>
              <th style={thStyle}>일시</th>
              <th style={thStyle}>진행 방식</th>
              <th style={thStyle}>상태</th>
            </tr>
          </thead>
          <tbody>
            {/* 더미 데이터 */}
            <tr>
              <td style={tdStyle}>1</td>
              <td style={tdStyle}>김멘토</td>
              <td style={tdStyle}>박멘티</td>
              <td style={tdStyle}>2025-11-30 19:00</td>
              <td style={tdStyle}>대면</td>
              <td style={tdStyle}>진행 중</td>
            </tr>
            <tr>
              <td style={tdStyle}>2</td>
              <td style={tdStyle}>이멘토</td>
              <td style={tdStyle}>최멘티</td>
              <td style={tdStyle}>2025-12-02 20:00</td>
              <td style={tdStyle}>온라인</td>
              <td style={tdStyle}>대기</td>
            </tr>
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