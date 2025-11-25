// src/pages/DashboardPage.jsx

export default function DashboardPage() {
  return (
    <div>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>대시보드</h2>

      {/* 상단 카드 4개 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={cardStyle}>
          <p style={cardLabelStyle}>전체 멘토 수</p>
          <p style={cardValueStyle}>24명</p>
        </div>
        <div style={cardStyle}>
          <p style={cardLabelStyle}>전체 멘티 수</p>
          <p style={cardValueStyle}>68명</p>
        </div>
        <div style={cardStyle}>
          <p style={cardLabelStyle}>진행 중 상담</p>
          <p style={cardValueStyle}>12건</p>
        </div>
        <div style={cardStyle}>
          <p style={cardLabelStyle}>대기 중 요청</p>
          <p style={cardValueStyle}>5건</p>
        </div>
      </div>

      {/* 하단 테이블 자리 */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>
          최근 상담/매칭 내역
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          이 영역에는 나중에 실제 테이블 형태로 최근 매칭/상담 목록을 표시할
          수 있습니다.
        </p>
      </div>
    </div>
  )
}

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}

const cardLabelStyle = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '8px',
}

const cardValueStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
}
