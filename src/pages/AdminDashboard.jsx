// src/pages/AdminDashboard.jsx
import React from "react";

export default function AdminDashboard() {
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* 제목 */}
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        관리자 대시보드
      </h1>

      <p
        style={{
          marginBottom: "24px",
          color: "#4b5563",
          fontSize: "14px",
        }}
      >
        전체 멘토·멘티 현황과 세션 진행 상황을 한눈에 확인할 수 있는 화면입니다.
      </p>

      {/* 상단 요약 카드 3개 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
            전체 멘토 수
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700 }}>—</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            실제 데이터 연동 시 자동으로 집계됩니다.
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
            전체 멘티 수
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700 }}>—</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            멘티 관리 화면과 연동될 예정입니다.
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
            진행 중 세션 수
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700 }}>—</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            세션 목록 API와 연동해서 집계할 수 있습니다.
          </div>
        </div>
      </div>

      {/* 하단 두 영역: 최근 세션 / 알림 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            최근 세션 활동 (예시 영역)
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            추후에 &quot;/api/sessions/recent&quot; 같은 엔드포인트와 연동해서
            최근 멘토링 세션 목록을 보여줄 수 있습니다.
          </p>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            시스템 알림 (예시 영역)
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            공지사항, 시스템 점검 안내, 중요 통계 변화 등을 표시하는 영역으로
            사용할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
