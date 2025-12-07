// src/pages/MenteeProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyProfile, updateMyProfile } from "../api/profileApi";

const MenteeProfilePage = () => {
  const { user } = useAuth();

  // 1) 프로필 상태 (DB에서 불러올 값)
  const [profile, setProfile] = useState({
    name: "",
    major: "",
    grade: "",
    tags: [],
  });

  // 2) 상태 메시지 및 로딩 플래그
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // ─────────────────────────────────────────────
  // [A] 프로필: DB에서 불러오기
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoadingProfile(true);

        const data = await fetchMyProfile();

        setProfile({
          name: data.name || user?.username || user?.name || "",
          major: data.major || "",
          grade: data.grade || "",
          tags:
            Array.isArray(data.tags) && data.tags.length > 0
              ? data.tags
              : [],
        });
      } catch (err) {
        console.error("[MenteeProfilePage] 프로필 로딩 오류:", err);

        setProfile((prev) => ({
          ...prev,
          name: prev.name || user?.username || user?.name || "",
        }));
      } finally {
        setLoadingProfile(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user]);

  // ─────────────────────────────────────────────
  // [B] 태그 추가/삭제
  // ─────────────────────────────────────────────
  const handleTagRemove = (tag) => {
    setProfile((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (!value) return;

      if (!profile.tags.includes(value)) {
        setProfile((prev) => ({
          ...prev,
          tags: [...prev.tags, value],
        }));
      }
      e.target.value = "";
    }
  };

  // ─────────────────────────────────────────────
  // [C] 프로필 저장(UPDATE) → DB 연동
  // ─────────────────────────────────────────────
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setSaveMessage("");

      await updateMyProfile(profile);

      setSaveMessage("프로필이 성공적으로 저장되었습니다.");
    } catch (err) {
      console.error("[MenteeProfilePage] 프로필 저장 오류:", err);
      setSaveMessage("프로필 저장 중 오류가 발생했습니다.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ─────────────────────────────────────────────
  // [D] 렌더링 (멘티 본인 프로필)
  // ─────────────────────────────────────────────
  return (
    <div style={{ padding: "24px" }}>
      {/* 상단 타이틀 영역 */}
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
        멘티 프로필 (Mentee_profiles)
      </h2>
      <p style={{ marginBottom: "24px", color: "#6b7280" }}>
        멘티 본인의 기본 정보와 전공, 학년, 관심 태그를 관리하는 화면입니다.
      </p>

      {loadingProfile && (
        <div
          style={{
            marginBottom: "16px",
            padding: "10px 12px",
            borderRadius: "10px",
            backgroundColor: "#eff6ff",
            color: "#1d4ed8",
            fontSize: "13px",
          }}
        >
          프로필 정보를 불러오는 중입니다…
        </div>
      )}

      {/* 카드 형태의 폼 박스 */}
      <div
        style={{
          maxWidth: "900px",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px 28px",
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
          border: "1px solid #e5e7eb",
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
            👤
          </span>
          <div>
            <div style={{ fontWeight: 600 }}>멘티 프로필</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              Mentee_profiles
            </div>
          </div>
        </div>

        {/* 폼 본문 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveProfile();
          }}
        >
          {/* 이름 + 전공 : 멘토 프로필과 동일한 flex 레이아웃 */}
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
                멘티 이름
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="예: 멘티demo"
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
                value={profile.major}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, major: e.target.value }))
                }
                placeholder="예: 항공소프트웨어공학"
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

          {/* 학년 및 추가 설명 */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "6px",
                color: "#4b5563",
              }}
            >
              학년 및 추가 설명
            </label>
            <textarea
              value={profile.grade}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, grade: e.target.value }))
              }
              placeholder="예: 3학년 / 멘토링 받고 싶은 과목, 진로 방향 등을 자유롭게 적어 주세요."
              rows={3}
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

          {/* 관심 태그 */}
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "6px",
                color: "#4b5563",
              }}
            >
              관심 태그 (User subjects)
            </label>
            <input
              type="text"
              placeholder="태그 입력 후 Enter (예: 운영체제, 데이터베이스, 항공정비)"
              onKeyDown={handleTagAdd}
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {profile.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagRemove(tag)}
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

          {/* 프로필 저장 버튼 + 메시지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <button
              type="submit"
              disabled={savingProfile}
              style={{
                padding: "10px 18px",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: savingProfile ? "#9ca3af" : "#2563eb",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: savingProfile ? "default" : "pointer",
              }}
            >
              {savingProfile ? "저장 중…" : "프로필 저장"}
            </button>

            {saveMessage && (
              <span
                style={{
                  fontSize: "12px",
                  color: saveMessage.includes("오류") ? "#b91c1c" : "#15803d",
                }}
              >
                {saveMessage}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenteeProfilePage;
