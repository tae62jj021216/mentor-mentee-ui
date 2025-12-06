// src/pages/MentorDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const LOCAL_STORAGE_KEY = 'mentor_dashboard_profile';

// 태그 기반 추천용 전체 멘토 풀 (백엔드가 준비되기 전까지 사용)
const ALL_MENTORS = [
  {
    id: 1,
    name: '김멘토',
    tags: ['Java', 'Spring', '백엔드'],
    title: '백엔드/커리어 멘토 — Java, Spring, 면접 코칭',
    description:
      '항공SW 출신 선배, 백엔드 개발자 5년차. 프로젝트 코드 리뷰와 취업 준비 상담 가능.',
  },
  {
    id: 2,
    name: '박멘토',
    tags: ['Python', '데이터분석'],
    title: '데이터 분석/파이썬 멘토 — Python, Pandas, 시각화',
    description:
      '데이터 분석 실무자. 포트폴리오용 분석 프로젝트 설계와 코드 피드백 제공.',
  },
  {
    id: 3,
    name: '이멘토',
    tags: ['C', '임베디드', '드론'],
    title: '임베디드·드론 제어 멘토 — C, RTOS, PX4',
    description:
      '드론/항공 소프트웨어 분야 재직자. 임베디드 C, 실시간 시스템, PX4 프로젝트 멘토링.',
  },
];

const MentorDashboard = () => {
  const { user } = useAuth();

  // 1) 기본 프로필 값 (초기값)
  const [profile, setProfile] = useState({
    name: '이멘티',
    major: '항공SW',
    grade: '항공SW 3학년',
    tags: ['Java', '백엔드'],
  });

  // 2) 서버에서 받아온 추천 멘토 (있으면 이걸 우선 사용)
  const [serverRecommended, setServerRecommended] = useState(null);

  // 3) 제안한 멘토 ID 목록 + 안내 메시지
  const [requestedMentorIds, setRequestedMentorIds] = useState([]);
  const [lastMessage, setLastMessage] = useState('');

  // ─────────────────────────────────────────────
  // [A] 프로필: localStorage 복원 + 서버에서 최신값 가져오기
  // ─────────────────────────────────────────────

  // 3-1) localStorage에 저장된 프로필 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setProfile((prev) => ({
            ...prev,
            ...parsed,
            tags: Array.isArray(parsed.tags) ? parsed.tags : prev.tags,
          }));
        }
      } else if (user) {
        // 저장된 값이 없고 로그인 정보가 있으면 이름 정도만 매핑
        setProfile((prev) => ({
          ...prev,
          name:
            prev.name === '이멘티' && user.username
              ? user.username
              : prev.name,
        }));
      }
    } catch (e) {
      console.error('[MentorDashboard] 프로필 복원 중 오류:', e);
    }
  }, [user]);

  // 3-2) profile이 변경될 때마다 localStorage에 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('[MentorDashboard] 프로필 저장 중 오류:', e);
    }
  }, [profile]);

  // 3-3) 서버에서 프로필 최신값 가져오기
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const tokenType = localStorage.getItem('tokenType') || 'Bearer';

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${tokenType} ${token}`,
          },
        });

        if (!res.ok) {
          console.warn('[MentorDashboard] 프로필 API 응답 코드:', res.status);
          return;
        }

        const json = await res.json();
        const data = json.data || json; // ApiResponse 래핑 여부에 따라

        setProfile((prev) => ({
          ...prev,
          name: data.name ?? prev.name,
          major: data.major ?? prev.major,
          grade: data.grade ?? prev.grade,
          tags: Array.isArray(data.tags) ? data.tags : prev.tags,
        }));
      } catch (err) {
        console.error('[MentorDashboard] 프로필 API 호출 중 오류:', err);
      }
    };

    fetchProfile();
  }, [user]);

  // ─────────────────────────────────────────────
  // [B] 관심 태그에 따라 추천 멘토 계산 (서버 우선, 실패 시 프론트 더미 사용)
  // ─────────────────────────────────────────────

  // 4-1) 프론트 더미 기반 추천 (서버 데이터가 없을 때만 사용)
  const fallbackRecommended = useMemo(() => {
    if (!profile.tags || profile.tags.length === 0) return [];

    const lowerTags = profile.tags.map((t) => t.toLowerCase());

    return ALL_MENTORS.filter((mentor) =>
      mentor.tags.some((tag) => lowerTags.includes(tag.toLowerCase())),
    );
  }, [profile.tags]);

  // 4-2) 실제 화면에서 사용할 추천 목록 (서버 데이터 있으면 우선 사용)
  const recommendedMentors = serverRecommended ?? fallbackRecommended;

  // 4-3) 태그 변경 시 서버에서 추천 멘토 가져오기 시도
  useEffect(() => {
    if (!user) return;
    if (!profile.tags || profile.tags.length === 0) {
      setServerRecommended(null);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';

    const fetchRecommended = async () => {
      try {
        const query = encodeURIComponent(profile.tags.join(','));

        // ★ 실제 추천 API URL로 교체 필요
        const res = await fetch(`/api/mentors/recommend?tags=${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${tokenType} ${token}`,
          },
        });

        if (!res.ok) {
          console.warn(
            '[MentorDashboard] 추천 멘토 API 응답 코드:',
            res.status,
          );
          setServerRecommended(null); // 실패 시 더미 추천 사용
          return;
        }

        const json = await res.json();
        const list = json.data || json;

        if (Array.isArray(list)) {
          setServerRecommended(list);
        } else {
          setServerRecommended(null);
        }
      } catch (err) {
        console.error('[MentorDashboard] 추천 멘토 API 호출 중 오류:', err);
        setServerRecommended(null);
      }
    };

    fetchRecommended();
  }, [user, profile.tags]);

  // ─────────────────────────────────────────────
  // [C] 태그 추가/삭제 및 제안 버튼 동작
  // ─────────────────────────────────────────────

  const handleTagRemove = (tag) => {
    setProfile((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (!value) return;
      if (!profile.tags.includes(value)) {
        setProfile((prev) => ({
          ...prev,
          tags: [...prev.tags, value],
        }));
      }
      e.target.value = '';
    }
  };

  const handlePropose = async (mentor) => {
    if (requestedMentorIds.includes(mentor.id)) return;

    // TODO: 실제 "멘토링 제안" 생성 API 호출 추가

    setRequestedMentorIds((prev) => [...prev, mentor.id]);
    setLastMessage(`"${mentor.name}" 멘토에게 멘토링 제안 요청을 보냈습니다.`);
  };

  // ─────────────────────────────────────────────
  // [D] 렌더링
  // ─────────────────────────────────────────────

  return (
    <div style={{ padding: '24px' }}>
      {/* 가운데 정렬 + 전체 폭 제한 */}
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
        }}
      >
        {/* 상단 타이틀 영역 */}
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          멘티 프로필 (Mentee_profiles)
        </h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
          태그 및 기본 정보를 기반으로 추천 멘토를 탐색할 수 있는 화면입니다.
        </p>

        {/* 메인 2열 레이아웃 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '24px', // 카드 사이 간격 조금 더 넓게
            alignItems: 'flex-start',
          }}
        >
          {/* 왼쪽: 프로필 카드 */}
          <section
            style={{
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px 22px',
              boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              👤 멘티 프로필
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                Mentee_profiles
              </span>
            </h2>

            {/* 이름 / 전공 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="이름"
                style={{
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  width: '100%',
                }}
              />
              <input
                type="text"
                value={profile.major}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, major: e.target.value }))
                }
                placeholder="전공"
                style={{
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  width: '100%',
                }}
              />
            </div>

            {/* 학년/설명 */}
            <textarea
              value={profile.grade}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, grade: e.target.value }))
              }
              placeholder="학년 및 추가 설명"
              rows={3}
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                resize: 'vertical',
                marginBottom: '16px',
              }}
            />

            {/* 관심 태그 */}
            <div
              style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}
            >
              관심 태그 (User subjects)
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '9999px',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '12px',
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              placeholder="태그 입력 후 Enter"
              onKeyDown={handleTagAdd}
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
              }}
            />

            {/* 최근 안내 메시지 */}
            {lastMessage && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  backgroundColor: '#ecfdf5',
                  color: '#166534',
                }}
              >
                {lastMessage}
              </div>
            )}
          </section>

          {/* 오른쪽: 추천 멘토 카드 */}
          <section
            style={{
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px 22px',
              boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>🔍 추천 멘토 (태그·시간대 기반)</span>
            </h2>

            {recommendedMentors.length === 0 ? (
              <div
                style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                }}
              >
                조건에 맞는 추천 멘토가 아직 없습니다. 태그를 추가해보세요.
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {recommendedMentors.map((mentor) => {
                  const alreadyRequested = requestedMentorIds.includes(
                    mentor.id,
                  );
                  return (
                    <div
                      key={mentor.id}
                      style={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '14px 16px',
                        backgroundColor: '#f9fafb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            marginBottom: '4px',
                          }}
                        >
                          {mentor.name}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                          }}
                        >
                          {mentor.title}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '4px',
                          }}
                        >
                          {mentor.description}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePropose(mentor)}
                        disabled={alreadyRequested}
                        style={{
                          flexShrink: 0,
                          padding: '8px 14px',
                          borderRadius: '9999px',
                          border: 'none',
                          backgroundColor: alreadyRequested
                            ? '#9ca3af'
                            : '#2563eb',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: alreadyRequested ? 'default' : 'pointer',
                        }}
                      >
                        {alreadyRequested ? '제안 완료' : '제안'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
