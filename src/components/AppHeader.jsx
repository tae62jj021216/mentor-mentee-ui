// src/components/AppHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";

/**
 * 상단 공통 헤더
 * - 왼쪽: 서비스 제목
 * - 오른쪽: 로그아웃 버튼
 */
function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 토큰 삭제 (authApi에 이미 있는 logout 함수 사용)
    logout();

    // 로그인 화면으로 이동
    navigate("/login", { replace: true });
  };

  return (
    <header
      style={{
        width: "100%",
        height: "56px",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "18px" }}>
        멘토링 관리 시스템
      </div>
      <button
        type="button"
        onClick={handleLogout}
        style={{
          padding: "6px 14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        로그아웃
      </button>
    </header>
  );
}

export default AppHeader;
