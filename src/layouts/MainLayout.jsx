// src/layouts/MainLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** 역할에 따라 보여줄 메뉴 구성 */
function getMenuItems(role) {
  // 🔹 멘토 · 멘티 공통 메뉴 (아이콘 포함)
  const mentorMenteeCommonMenus = [
    { icon: '📊', label: '대시보드', path: '/mentee-dashboard' },
    { icon: '🔍', label: '멘토 찾기', path: '/mentee-mentor-search' },
    { icon: '👤', label: '멘티 프로필', path: '/mentee-profile' },
    { icon: '🕒', label: '멘토 가능시간', path: '/mentor-availability' },
    { icon: '🤝', label: '매칭/요청', path: '/mentee-matching' },
    { icon: '🗂️', label: '세션/출석평가', path: '/mentee-sessions' },
  ];

  // 🔹 관리자용 메뉴
  if (role === 'ADMIN') {
    return [
      { icon: '📊', label: '대시보드', path: '/dashboard' },
      { icon: '📁', label: '워크스페이스', path: '/workspaces' },
      { icon: '🧑‍🏫', label: '멘토 목록', path: '/mentors' },
      { icon: '🧑‍🎓', label: '멘티 목록', path: '/mentees' },
      { icon: '📝', label: '세션 목록', path: '/sessions' },
    ];
  }

  // 🔹 멘토 · 멘티 동일 메뉴 사용
  if (role === 'MENTOR' || role === 'MENTEE') {
    return mentorMenteeCommonMenus;
  }

  // 🔹 게스트
  return [{ icon: '🔐', label: '로그인', path: '/login' }];
}

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const role = user?.role || null;
  const menuItems = getMenuItems(role);
  const displayName = user?.name || user?.username || user?.email || '게스트';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
      }}
    >
      {/* 왼쪽 고정 사이드바 */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '260px',
          height: '100vh',
          backgroundColor: '#020617',
          color: '#e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 18px',
          boxSizing: 'border-box',
        }}
      >
        {/* 상단: 로고 + 사용자 정보 + 메뉴 */}
        <div>
          {/* 상단 소개 영역 */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              학습 멘토·멘티
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
          <nav>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  marginBottom: '6px',
                  textDecoration: 'none',
                  color: isActive ? '#0f172a' : '#e5e7eb',
                  backgroundColor: isActive ? '#e5e7eb' : 'transparent',
                })}
              >
                {item.icon && (
                  <span style={{ fontSize: '15px' }}>{item.icon}</span>
                )}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 하단: 로그인/로그아웃 버튼 – 항상 사이드바 맨 아래 */}
        <div
          style={{
            marginTop: 'auto',
          }}
        >
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

      {/* 오른쪽 메인 콘텐트 영역 */}
      <main
        style={{
          marginLeft: '260px',        // 고정 사이드바 폭만큼 밀어주기
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          padding: '24px 32px',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
