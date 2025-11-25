// src/pages/MenteeDashboard.jsx
import React from "react";

const MenteeDashboard = () => {
  // 멘티용 임시 통계 데이터 (나중에 백엔드/DB 연결 시 교체)
  const stats = [
    {
      id: 1,
      label: "전체 멘티 수",
      value: 28,
      description: "현재 시스템에 등록된 전체 멘티 수",
    },
    {
      id: 2,
      label: "진행 중 세션 수",
      value: 12,
      description: "이번 학기 진행 중인 멘토링 세션",
    },
    {
      id: 3,
      label: "완료된 세션 수",
      value: 34,
      description: "지난 학기까지 완료된 멘토링 세션",
    },
    {
      id: 4,
      label: "평균 만족도",
      value: "4.7 / 5.0",
      description: "멘티 설문 기반 평균 만족도",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
        멘티 대시보드
      </h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        멘토링 프로그램에 참여 중인 멘티 현황을 한 눈에 확인할 수 있는 화면입니다.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {stats.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "16px 20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#888",
                marginBottom: "8px",
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "4px",
              }}
            >
              {item.value}
            </div>
            <div style={{ fontSize: "13px", color: "#777" }}>
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenteeDashboard;
