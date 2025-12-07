// src/pages/MentorProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MentorProfilePage() {
  const { user } = useAuth();

  // 간단한 로컬 상태 (추후 API 연동 시 교체 가능)
  const [name, setName] = useState(user?.name || "");
  const [major, setMajor] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("멘토 프로필 저장", {
      name,
      major,
      description,
      tags,
    });
    alert("멘토 프로필이 로컬 상태에만 저장되었습니다. (API 연동 예정)");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim();
      if (!value) return;
      if (!tags.includes(value)) {
        setTags((prev) => [...prev, value]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* 상단 타이틀 영역 */}
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
        멘토 프로필 (Mentor_profiles)
      </h2>
      <p style={{ marginBottom: "24px", color: "#6b7280" }}>
        멘토 본인의 기본 정보와 전공, 소개, 관심 분야 태그를 관리하는 화면입니다.
      </p>

      {/* 카드 형태의 폼 박스 */}
      <div
        style={{
          maxWidth: "900px",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px 28px",
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        }}
      >
        {/* 카드 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9999px",
              backgroundColor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            👨‍🏫
          </span>
          <div>
            <div style={{ fontWeight: 600 }}>멘토 프로필</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              Mentor_profiles
            </div>
          </div>
        </div>

        {/* 폼 본문 */}
        <form onSubmit={handleSubmit}>
          {/* 이름 + 전공 : flex 레이아웃으로 간격 넉넉하게 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ flex: "1 1 260px", minWidth: "0" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  marginBottom: "6px",
                  color: "#4b5563",
                }}
              >
                멘토 이름
              </label>
              <input
                type="text"
                value={name}
                placeholder="예: 멘토demo"
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: "1 1 220px", minWidth: "0" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  marginBottom: "6px",
                  color: "#4b5563",
                }}
              >
                전공
              </label>
              <input
                type="text"
                value={major}
                placeholder="예: 항공소프트웨어공학"
                onChange={(e) => setMajor(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* 소개 / 설명 */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "6px",
                color: "#4b5563",
              }}
            >
              소개 및 추가 설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 멘토링 가능 과목, 선호하는 멘티 수준, 지도 스타일 등을 자유롭게 적어 주세요."
              rows={4}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* 태그 입력 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "6px",
                color: "#4b5563",
              }}
            >
              관심 태그 (Mentor subjects)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="태그 입력 후 Enter (예: 운영체제, 데이터베이스, 항공전기전자)"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                marginBottom: "8px",
                boxSizing: "border-box",
              }}
            />

            {/* 태그 리스트 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    borderRadius: "9999px",
                    border: "none",
                    backgroundColor: "#e0f2fe",
                    color: "#0369a1",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  <span>#{tag}</span>
                  <span style={{ fontWeight: 700 }}>×</span>
                </button>
              ))}
            </div>
          </div>

          {/* 저장 버튼 */}
          <div style={{ textAlign: "right" }}>
            <button
              type="submit"
              style={{
                padding: "10px 18px",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              프로필 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
