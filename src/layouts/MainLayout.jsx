// src/layouts/MainLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** 역할에 따라 보여줄 메뉴 구성 */
function getMenuItems(role) {
  if (role === 'ADMIN') {
    return [
      { label: '대시보드', path: '/dashboard' },
      { label: '워크스페이스', path: '/workspaces' },
      { label: '멘토 목록', path: '/mentors' },
      { label: '멘티 목록', path: '/mentees' },
      { label: '세션 목록', path: '/sessions' },
    ]
  }

  if (role === 'MENTOR') {
    return [
      { label: '멘토 대시보드', path: '/dashboard' },
      { label: '내 워크스페이스', path: '/workspaces' },
      { label: '세션 목록', path: '/sessions' },
      { label: '멘티 목록', path: '/mentees' },
    ]
  }

  if (role === 'MENTEE') {
    return [
      { label: '멘티 대시보드', path: '/mentee-dashboard' },
      { label: '내 워크스페이스', path: '/workspaces' },
      { label: '세션 목록', path: '/sessions' },
    ]
  }

  // 게스트
  return [{ label: '로그인', path: '/login' }]
}

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const isAuthenticated = !!user
  const role = user?.role || null
  const menuItems = getMenuItems(role)

  const displayName = user?.name || user?.username || user?.email || '게스트'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
      }}
    >
      {/* 사이드바 */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#020617',
          color: '#e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 18px',
        }}
      >
        {/* 상단 소개 영역 */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              marginBottom: '6px',
            }}
          >
            멘토·멘티 시스템
          </div>

          {isAuthenticated ? (
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>
              {displayName} ({role || 'ROLE 없음'})로 로그인됨
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>
              로그인하지 않은 상태입니다.
              <br />
              로그인 후 메뉴가 표시됩니다.
            </div>
          )}
        </div>

        {/* 메뉴 목록 */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '14px',
                marginBottom: '6px',
                textDecoration: 'none',
                color: isActive ? '#0f172a' : '#e5e7eb',
                backgroundColor: isActive ? '#e5e7eb' : 'transparent',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 하단: 로그인/로그아웃 */}
        <div style={{ marginTop: '16px' }}>
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #4b5563',
                backgroundColor: 'transparent',
                color: '#e5e7eb',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              로그인 화면으로
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #4b5563',
                backgroundColor: 'transparent',
                color: '#e5e7eb',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              로그아웃
            </button>
          )}
        </div>
      </aside>

      {/* 메인 콘텐트 영역 */}
      <main
        style={{
          flex: 1,
          backgroundColor: '#f9fafb',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
