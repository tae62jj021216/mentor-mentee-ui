// src/layouts/MainLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** 역할에 따라 보여줄 메뉴 구성 */
function getMenuItems(role) {
  // 🔹 멘티 기본 메뉴
  const menteeMenus = [
    { icon: "👤", label: "멘티 프로필", path: "/mentee-profile" },
    { icon: "🔍", label: "멘토 찾기", path: "/mentee-mentor-search" },
    { icon: "🤝", label: "매칭/요청", path: "/mentee-matching" },
    { icon: "🗂️", label: "세션/출석평가", path: "/mentee-sessions" },
  ];

  // 🔹 관리자용 메뉴
  if (role === "ADMIN") {
    return [
      { icon: "📊", label: "대시보드", path: "/dashboard" },
      { icon: "📁", label: "워크스페이스", path: "/workspaces" },
      { icon: "🧑‍🏫", label: "멘토 목록", path: "/mentors" },
      { icon: "🧑‍🎓", label: "멘티 목록", path: "/mentees" },
      { icon: "🎓", label: "학사 관리", path: "/admin-academic" },
      { icon: "📋", label: "멘토링 게시판", path: "/posts" },
    ];
  }

  // 🔹 멘토 메뉴: 라벨은 “멘토 프로필”, 나머지 라벨은 그대로, 경로만 멘토 전용
  if (role === "MENTOR") {
    const mentorMenus = [
      { icon: "👤", label: "멘토 프로필", path: "/mentor-profile" },
      { icon: "🔍", label: "멘토 찾기", path: "/mentor-mentor-search" },
      { icon: "🤝", label: "매칭/요청", path: "/mentor-matching" },
      { icon: "🗂️", label: "세션/출석평가", path: "/mentor-sessions" },
    ];

    return [
      ...mentorMenus,
      { icon: "📋", label: "멘토링 게시판", path: "/posts" },
    ];
  }

  // 🔹 멘티 메뉴
  if (role === "MENTEE") {
    return [
      ...menteeMenus,
      { icon: "📋", label: "멘토링 게시판", path: "/posts" },
    ];
  }

  // 🔹 게스트
  return [{ icon: "🔐", label: "로그인", path: "/login" }];
}

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const role = user?.role || null;
  const menuItems = getMenuItems(role);
  const displayName =
    user?.name || user?.username || user?.email || "사용자";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      {/* 왼쪽 고정 사이드바 */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "260px",
          height: "100vh",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          display: "flex",
          flexDirection: "column",
          padding: "20px 18px",
          boxSizing: "border-box",
        }}
      >
        <div>
          {/* 상단 정보 */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              학습 멘토·멘티
            </div>

            {isAuthenticated ? (
              <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                {displayName} ({role}) 로 로그인됨
              </div>
            ) : (
              <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                로그인하지 않은 상태입니다.
              </div>
            )}
          </div>

          {/* 메뉴 */}
          <nav>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  marginBottom: "6px",
                  textDecoration: "none",
                  color: isActive ? "#0f172a" : "#e5e7eb",
                  backgroundColor: isActive ? "#e5e7eb" : "transparent",
                })}
              >
                {item.icon && (
                  <span style={{ fontSize: "15px" }}>{item.icon}</span>
                )}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 로그아웃 버튼 */}
        <div style={{ marginTop: "auto" }}>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #4b5563",
                backgroundColor: "transparent",
                color: "#e5e7eb",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              로그아웃
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #4b5563",
                backgroundColor: "transparent",
                color: "#e5e7eb",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              로그인 화면으로
            </button>
          )}
        </div>
      </aside>

      {/* 오른쪽 메인 콘텐츠 영역 */}
      <main
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          padding: "24px 32px",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
