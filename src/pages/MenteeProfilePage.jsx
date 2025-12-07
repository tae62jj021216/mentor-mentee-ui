// src/pages/MenteeProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMyProfile, updateMyProfile } from '../api/profileApi';
import { fetchRecommendedMentors } from '../api/menteeApi';

const MenteeProfilePage = () => {
  const { user } = useAuth();

  // 1) 프로필 상태 (DB에서 불러올 값)
  const [profile, setProfile] = useState({
    name: '',
    major: '',
    grade: '',
    tags: [],
  });

  // 2) 추천 멘토 (DB 기반)
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendedError, setRecommendedError] = useState('');

  // 3) 제안한 멘토 ID 목록 + 안내 메시지 + 저장 상태 메시지
  const [requestedMentorIds, setRequestedMentorIds] = useState([]);
  const [lastMessage, setLastMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // ─────────────────────────────────────────────
  // [A] 프로필: DB에서 불러오기
  // ─────────────────────────────────────────────

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoadingProfile(true);

        const data = await fetchMyProfile();

        setProfile({
          name: data.name || user?.username || user?.name || '',
          major: data.major || '',
          grade: data.grade || '',
          tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : [],
        });
      } catch (err) {
        console.error('[MenteeProfilePage] 프로필 로딩 오류:', err);

        setProfile((prev) => ({
          ...prev,
          name: prev.name || user?.username || user?.name || '',
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
  // [B] 관심 태그 기반 추천 멘토 (DB 연동)
  // ─────────────────────────────────────────────

  useEffect(() => {
    async function loadRecommendedFromServer() {
      // 태그가 없으면 서버 호출도 하지 않고 초기화
      if (!profile.tags || profile.tags.length === 0) {
        setRecommendedMentors([]);
        setRecommendedError('');
        setRecommendedLoading(false);
        return;
      }

      try {
        setRecommendedLoading(true);
        setRecommendedError('');

        // menteeApi.fetchRecommendedMentors: tags 배열을 받아 DB에서 추천 멘토 조회
        const data = await fetchRecommendedMentors(profile.tags);

        // 응답이 배열 또는 { content: [...] } 형태 모두 수용
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.content)) {
          list = data.content;
        }

        setRecommendedMentors(list || []);
      } catch (err) {
        console.error('[MenteeProfilePage] 추천 멘토 조회 오류:', err);
        setRecommendedError('추천 멘토를 불러오는 중 오류가 발생했습니다.');
        setRecommendedMentors([]);
      } finally {
        setRecommendedLoading(false);
      }
    }

    loadRecommendedFromServer();
  }, [profile.tags]);

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

    // TODO: 실제 "멘토링 제안 생성" API 연결 예정
    setRequestedMentorIds((prev) => [...prev, mentor.id]);
    setLastMessage(`"${mentor.name || mentor.mentorName || '멘토'}" 멘토에게 멘토링 제안 요청을 보냈습니다.`);
  };

  // ─────────────────────────────────────────────
  // [D] 프로필 저장(UPDATE) → DB 연동
  // ─────────────────────────────────────────────

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setSaveMessage('');

      await updateMyProfile(profile);

      setSaveMessage('프로필이 성공적으로 저장되었습니다.');
      // 태그가 변경되었을 수도 있으니, 저장 후에도 추천 목록은 useEffect에서 자동 갱신
    } catch (err) {
      console.error('[MenteeProfilePage] 프로필 저장 오류:', err);
      setSaveMessage('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setSavingProfile(false);
    }
  };

  // ─────────────────────────────────────────────
  // [E] 렌더링
  // ─────────────────────────────────────────────

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
        }}
      >
        {/* 상단 타이틀 영역 */}
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          멘티 프로필 (Mentee_profiles)
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '20px',
          }}
        >
          태그 및 기본 정보를 기반으로 추천 멘토를 탐색하고, 추후 매칭 기능과 연동될
          멘티 전용 프로필 화면입니다.
        </p>

        {loadingProfile && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '13px',
            }}
          >
            프로필 정보를 불러오는 중입니다…
          </div>
        )}

        {/* 메인 2열 레이아웃 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '24px',
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
              <span
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                }}
              >
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
              style={{
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: 600,
              }}
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
                marginBottom: '12px',
              }}
            />

            {/* 프로필 저장 버튼 + 메시지 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '8px',
              }}
            >
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: savingProfile ? '#9ca3af' : '#2563eb',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: savingProfile ? 'default' : 'pointer',
                }}
              >
                {savingProfile ? '저장 중…' : '프로필 저장'}
              </button>

              {saveMessage && (
                <span
                  style={{
                    fontSize: '12px',
                    color: saveMessage.includes('오류') ? '#b91c1c' : '#15803d',
                  }}
                >
                  {saveMessage}
                </span>
              )}
            </div>

            {/* 최근 안내 메시지 (멘토 제안 관련) */}
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
              <span>🔍 추천 멘토 (태그 기반)</span>
            </h2>

            {/* 로딩 메시지 */}
            {recommendedLoading && (
              <div
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '8px',
                }}
              >
                추천 멘토를 불러오는 중입니다…
              </div>
            )}

            {/* 에러 메시지 */}
            {recommendedError && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#b91c1c',
                  marginBottom: '8px',
                }}
              >
                {recommendedError}
              </div>
            )}

            {/* 실제 추천 목록 */}
            {!recommendedLoading && recommendedMentors.length === 0 ? (
              <div
                style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                }}
              >
                조건에 맞는 추천 멘토가 아직 없습니다. 관심 태그를 추가해보세요.
              </div>
            ) : (
              !recommendedLoading && (
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
                    const displayName =
                      mentor.name ||
                      mentor.mentorName ||
                      mentor.fullName ||
                      '멘토';

                    const subtitle =
                      mentor.title ||
                      mentor.majorName ||
                      mentor.departmentName ||
                      mentor.email ||
                      '멘토 소개';

                    const description =
                      mentor.description ||
                      mentor.profileSummary ||
                      mentor.introduction ||
                      '';

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
                            {displayName}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#6b7280',
                            }}
                          >
                            {subtitle}
                          </div>
                          {description && (
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                marginTop: '4px',
                              }}
                            >
                              {description}
                            </div>
                          )}
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
              )
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MenteeProfilePage;
