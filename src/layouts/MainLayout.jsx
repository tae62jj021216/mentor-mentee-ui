// src/layouts/MainLayout.jsx
import { Link, Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 사이드바 */}
      <aside
        style={{
          width: '220px',
          backgroundColor: '#1f2933',
          color: '#fff',
          padding: '16px',
        }}
      >
        <h2 style={{ marginBottom: '24px', fontSize: '18px' }}>
          멘토·멘티 시스템
        </h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>
            대시보드
          </Link>
          <Link to="/mentors" style={{ color: '#fff', textDecoration: 'none' }}>
            멘토 관리
          </Link>
          <Link to="/mentees" style={{ color: '#fff', textDecoration: 'none' }}>
            멘티 관리
          </Link>
          <Link to="/sessions" style={{ color: '#fff', textDecoration: 'none' }}>
            상담/세션 관리
          </Link>
        </nav>
      </aside>

      {/* 메인 영역 */}
      <main
        style={{
          flex: 1,
          padding: '24px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <header
          style={{
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ fontSize: '20px' }}>관리자 화면</h1>
          <button
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            로그아웃
          </button>
        </header>

        {/* 각 페이지가 이 위치에 렌더링됨 */}
        <section>
          <Outlet />
        </section>
      </main>
    </div>
  )
}
