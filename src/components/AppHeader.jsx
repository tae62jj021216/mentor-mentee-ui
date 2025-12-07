// src/components/AppHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";

function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
      <div
        style={{ fontWeight: 700, fontSize: "18px", cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        멘토링 관리 시스템
      </div>

      {/* 오른쪽 메뉴 */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {/* 🔹 게시판 버튼 */}
        <button
          type="button"
          onClick={() => navigate("/posts")}
          style={{
            padding: "6px 14px",
            borderRadius: "4px",
            border: "1px solid #2563eb",
            backgroundColor: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          게시판
        </button>

        {/* 🔹 로그아웃 버튼 */}
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
      </div>
    </header>
  );
}

export default AppHeader;
