// src/layouts/MainLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const roleLabel =
    user?.role === 'ADMIN'
      ? '관리자'
      : user?.role === 'MENTOR'
      ? '멘토'
      : user?.role === 'MENTEE'
      ? '멘티'
      : ''

  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    color: isActive ? '#ffffff' : '#e5e7eb',
    backgroundColor: isActive ? '#111827' : 'transparent',
    textDecoration: 'none',
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#f3f4f6',
      }}
    >
      {/* 사이드바 */}
      <aside
        style={{
          width: '220px',
          backgroundColor: '#020617',
          color: '#e5e7eb',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
          멘토·멘티 시스템
        </div>
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          {user
            ? `${user.username} (${roleLabel})로 로그인됨`
            : '로그인하지 않은 상태입니다.'}
        </div>

        <nav style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* 관리자 메뉴 */}
          {user?.role === 'ADMIN' && (
            <>
              <NavLink to="/dashboard" style={linkStyle}>
                대시보드
              </NavLink>
              <NavLink to="/mentors" style={linkStyle}>
                멘토 관리
              </NavLink>
              <NavLink to="/mentees" style={linkStyle}>
                멘티 관리
              </NavLink>
              <NavLink to="/sessions" style={linkStyle}>
                상담/세션 관리
              </NavLink>
            </>
          )}

          {/* 멘토 메뉴 */}
          {user?.role === 'MENTOR' && (
            <>
              <NavLink to="/mentors" style={linkStyle}>
                내 멘티 관리
              </NavLink>
              <NavLink to="/sessions" style={linkStyle}>
                내 상담 세션
              </NavLink>
            </>
          )}

          {/* 멘티 메뉴 */}
          {user?.role === 'MENTEE' && (
            <>
              <NavLink to="/mentee-dashboard" style={linkStyle}>
                멘티 대시보드
              </NavLink>
              <NavLink to="/sessions" style={linkStyle}>
                나의 상담 세션
              </NavLink>
            </>
          )}

          {/* 혹시 로그인 전인데 메인 레이아웃이 렌더링되면 기본 메뉴 숨김 */}
          {!user && (
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>
              로그인 후 메뉴가 표시됩니다.
            </div>
          )}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid #4b5563',
                backgroundColor: 'transparent',
                color: '#e5e7eb',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid #4b5563',
                backgroundColor: 'transparent',
                color: '#e5e7eb',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              로그인 화면으로
            </button>
          )}
        </div>
      </aside>

      {/* 메인 영역 */}
      <main style={{ flex: 1, padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  )
}
