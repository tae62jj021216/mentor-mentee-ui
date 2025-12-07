// src/pages/MenteeMentorSearchPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPosts, createPost, deletePost } from '../api/postApi';
import {
  createPostApplication,
  fetchMySentApplications,
} from '../api/postApplicationApi';

// src/pages/MenteeMentorSearchPage.jsx
import AutoMatchingSection from '../components/AutoMatchingSection';


const DEFAULT_PROGRAM_ID = 1; // POST 생성 시에만 사용

const MenteeMentorSearchPage = () => {
  const { user } = useAuth();

  // 현재 탭: 멘토 모집글 / 멘티 요청글
  const [activeType, setActiveType] = useState('MENTOR_RECRUIT');

  // 게시글 목록
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 작성 폼 on/off + 폼 내용
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    targetLevel: '',
    mode: 'ONLINE',
    preferredTime: '',
    tagsText: '',
    capacity: '3', // 멘토 모집글 정원 기본값
  });
  const [submitting, setSubmitting] = useState(false);

  // 내가 신청한 글 ID 목록
  const [appliedPostIds, setAppliedPostIds] = useState([]);
  // 화면 하단 안내 메시지
  const [lastMessage, setLastMessage] = useState('');

  // -------------------------------------------------------
  // 권한 체크
  // -------------------------------------------------------
  // 작성 가능 여부
  const canWrite = (() => {
    if (!user) return false;
    const role = user.role;

    if (activeType === 'MENTOR_RECRUIT') {
      // 멘토 모집글은 멘토 / BOTH / 관리자만 작성
      return role === 'MENTOR' || role === 'BOTH' || role === 'ADMIN';
    }
    // 멘티 요청글은 멘티 / BOTH / 관리자만 작성
    return role === 'MENTEE' || role === 'BOTH' || role === 'ADMIN';
  })();

  // 현재 탭에서 "신청하기" 버튼을 누를 수 있는지
  const canApplyToCurrentTab = () => {
    if (!user) return false;
    const role = user.role;

    if (activeType === 'MENTOR_RECRUIT') {
      // 멘토 모집글 → 멘티 / BOTH 가 신청
      return role === 'MENTEE' || role === 'BOTH';
    }
    if (activeType === 'MENTEE_REQUEST') {
      // 멘티 요청글 → 멘토 / BOTH 가 신청
      return role === 'MENTOR' || role === 'BOTH';
    }
    return false;
  };

  // 현재 로그인 유저가 글 작성자인지
  const isMyPost = (post) => {
    const userId = user?.id ?? user?.userId;
    const authorId = post.authorId ?? post.author?.id;

    if (!userId || !authorId) return false;
    return String(userId) === String(authorId);
  };

  // 삭제 가능 여부: 본인 글 또는 관리자
  const canDeletePost = (post) => {
    if (!user) return false;
    return isMyPost(post) || user.role === 'ADMIN';
  };

  // 상단 제목/설명
  const headerTitle =
    activeType === 'MENTOR_RECRUIT'
      ? '멘토 모집글 (MENTOR_RECRUIT)'
      : '멘티 요청글 (MENTEE_REQUEST)';

  const headerDescription =
    activeType === 'MENTOR_RECRUIT'
      ? '멘토들이 개설한 튜터링/스터디 모집글 목록입니다. 관심 있는 주제를 선택해 신청할 수 있습니다.'
      : '멘티들이 올린 학습 요청글입니다. 도와줄 수 있는 멘토는 이 글을 보고 신청할 수 있습니다.';

  // -------------------------------------------------------
  // 내가 보낸 신청 목록 → appliedPostIds
  // -------------------------------------------------------
  useEffect(() => {
    const loadSentApplications = async () => {
      if (!user) return;
      try {
        const list = await fetchMySentApplications();
        const ids = Array.isArray(list)
          ? list
              .map((a) => a.postId ?? a.post_id)
              .filter((id) => id !== null && id !== undefined)
          : [];
        setAppliedPostIds(ids);
      } catch (error) {
        console.error('내가 보낸 신청 목록 조회 실패:', error);
      }
    };

    loadSentApplications();
  }, [user]);

  // -------------------------------------------------------
  // 게시글 목록 로딩 (탭 변경 시마다)
  // -------------------------------------------------------
  const loadPosts = async () => {
    setLoading(true);
    try {
      const result = await fetchPosts(); // /api/posts 전체 조회
      const list = Array.isArray(result)
        ? result
        : result?.content && Array.isArray(result.content)
        ? result.content
        : [];

      // 1) 현재 탭 타입만 남기고
      // 2) soft delete 된 글(status === 'DELETED') 은 숨긴다
      const filtered = list.filter((p) => {
        if (p.type !== activeType) return false;
        if (p.status && String(p.status).toUpperCase() === 'DELETED') {
          return false;
        }
        return true;
      });

      setPosts(filtered);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    setShowForm(false);
    setForm({
      title: '',
      content: '',
      targetLevel: '',
      mode: 'ONLINE',
      preferredTime: '',
      tagsText: '',
      capacity: '3',
    });
    setLastMessage('');
  }, [activeType]);

  // -------------------------------------------------------
  // 폼 입력
  // -------------------------------------------------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // "새 글 작성" / "작성 취소" 토글
  const handleClickWrite = () => {
    if (!canWrite) return;
    setShowForm((prev) => !prev);
    setLastMessage('');
  };

  // 글 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    const tags =
      form.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0) || [];

    const capacityNumber =
      activeType === 'MENTOR_RECRUIT' && form.capacity.trim() !== ''
        ? Number(form.capacity)
        : null;

    const payload = {
      programId: DEFAULT_PROGRAM_ID,
      type: activeType,
      title: form.title.trim(),
      content: form.content.trim(),
      targetLevel: form.targetLevel.trim() || null,
      mode: form.mode,
      preferredTime: form.preferredTime.trim() || null,
      tags,
      capacity: capacityNumber,
    };

    setSubmitting(true);
    try {
      await createPost(payload);
      alert('게시글이 등록되었습니다.');
      setShowForm(false);
      setForm({
        title: '',
        content: '',
        targetLevel: '',
        mode: 'ONLINE',
        preferredTime: '',
        tagsText: '',
        capacity: '3',
      });
      await loadPosts();
    } catch (error) {
      const status = error?.response?.status;
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        null;

      console.error(
        '[MenteeMentorSearchPage] 게시글 등록 실패:',
        status,
        error?.response?.data || error,
      );

      if (backendMessage) {
        alert(`게시글 등록 실패: ${backendMessage}`);
      } else if (status) {
        alert(`게시글 등록 실패 (상태코드 ${status})`);
      } else {
        alert('게시글 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 신청하기
  const handleApply = async (post) => {
    if (!canApplyToCurrentTab()) return;
    if (appliedPostIds.includes(post.id)) return;

    try {
      await createPostApplication(post.id);
      setAppliedPostIds((prev) => [...prev, post.id]);
      setLastMessage(`"${post.title}" 글에 신청을 보냈습니다.`);
    } catch (error) {
      const status = error?.response?.status;
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        null;

      console.error(
        '[MenteeMentorSearchPage] 게시글 신청 실패:',
        status,
        error?.response?.data || error,
      );

      if (backendMessage) {
        alert(`신청 실패: ${backendMessage}`);
      } else if (status) {
        alert(`신청 실패 (상태코드 ${status})`);
      } else {
        alert('신청을 보내는 중 오류가 발생했습니다.');
      }
    }
  };

  // 삭제하기 (본인 글 + 관리자만 버튼 노출)
  const handleDelete = async (post) => {
    if (!canDeletePost(post)) return;
    if (!window.confirm(`"${post.title}" 글을 삭제하시겠습니까?`)) return;

    try {
      await deletePost(post.id);

      // 프론트 쪽 목록에서도 즉시 제거
      setPosts((prev) =>
        prev.filter((p) => p.id !== post.id),
      );

      setLastMessage(`"${post.title}" 글이 삭제되었습니다.`);
    } catch (error) {
      console.error('[MenteeMentorSearchPage] 게시글 삭제 실패:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  // -------------------------------------------------------
  // 카드 렌더링
  // -------------------------------------------------------
  const renderPostCard = (post) => {
    const createdAt =
      post.createdAt || post.created_at || post.registeredAt || null;

    const displayMode =
      post.mode === 'OFFLINE'
        ? '오프라인'
        : post.mode === 'MIXED'
        ? '온·오프라인 병행'
        : '온라인';

    const canApply = canApplyToCurrentTab();
    const alreadyApplied = appliedPostIds.includes(post.id);
    const deletable = canDeletePost(post);

    return (
      <div
        key={post.id}
        style={{
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '14px 16px',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: '15px',
              fontWeight: 600,
              marginBottom: '2px',
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            {post.authorName || post.writerName || '작성자 미정'} · {displayMode}
            {post.targetLevel ? ` · 대상: ${post.targetLevel}` : ''}
            {post.capacity ? ` · 정원: ${post.capacity}명` : ''}
          </div>
          {post.preferredTime && (
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              시간대: {post.preferredTime}
            </div>
          )}
          <div
            style={{
              fontSize: '13px',
              color: '#4b5563',
              marginTop: '4px',
            }}
          >
            {post.content}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginTop: '6px',
              }}
            >
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '11px',
                  }}
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          )}
          {createdAt && (
            <div
              style={{
                fontSize: '11px',
                color: '#9ca3af',
                marginTop: '4px',
              }}
            >
              {String(createdAt).slice(0, 16)}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {canApply && (
            <button
              type="button"
              onClick={() => handleApply(post)}
              disabled={alreadyApplied}
              style={{
                padding: '8px 14px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: alreadyApplied ? '#9ca3af' : '#2563eb',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: alreadyApplied ? 'default' : 'pointer',
              }}
            >
              {alreadyApplied ? '신청 완료' : '신청하기'}
            </button>
          )}

          {deletable && (
            <button
              type="button"
              onClick={() => handleDelete(post)}
              style={{
                padding: '6px 10px',
                borderRadius: '9999px',
                border: '1px solid #fecaca',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------
  // 렌더링
  // -------------------------------------------------------
  const writeButtonLabel =
    activeType === 'MENTOR_RECRUIT' ? '새 모집글 작성' : '새 요청글 작성';

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
        멘토 찾기 / 요청글
      </h1>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
        프로그램, 태그, 가용 시간 정보를 바탕으로 멘토·멘티를 찾는 게시판입니다.
      </p>

      {/* 상단 탭 */}
      <div
        style={{
          display: 'inline-flex',
          borderRadius: '9999px',
          backgroundColor: '#e5e7eb',
          padding: '4px',
          marginBottom: '16px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveType('MENTOR_RECRUIT')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor:
              activeType === 'MENTOR_RECRUIT' ? '#ffffff' : 'transparent',
            boxShadow:
              activeType === 'MENTOR_RECRUIT'
                ? '0 1px 3px rgba(0,0,0,0.08)'
                : 'none',
          }}
        >
          멘토 모집글
        </button>
        <button
          type="button"
          onClick={() => setActiveType('MENTEE_REQUEST')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor:
              activeType === 'MENTEE_REQUEST' ? '#ffffff' : 'transparent',
            boxShadow:
              activeType === 'MENTEE_REQUEST'
                ? '0 1px 3px rgba(0,0,0,0.08)'
                : 'none',
          }}
        >
          멘티 요청글
        </button>
      </div>
      <AutoMatchingSection programId={DEFAULT_PROGRAM_ID} />

      {/* 헤더 + 작성 버튼 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            {headerTitle}
          </h2>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            {headerDescription}
          </p>
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={handleClickWrite}
            style={{
              padding: '8px 14px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {showForm ? '작성 취소' : writeButtonLabel}
          </button>
        )}
      </div>

      {/* 작성 폼 : 두 탭 모두에서, canWrite && showForm 이면 표시 */}
      {showForm && canWrite && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '18px',
            padding: '16px 18px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            {activeType === 'MENTOR_RECRUIT'
              ? '멘토 모집글 작성'
              : '멘티 요청글 작성'}
          </div>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="제목"
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
            }}
          />

          <textarea
            name="content"
            value={form.content}
            onChange={handleFormChange}
            placeholder={
              activeType === 'MENTOR_RECRUIT'
                ? '어떤 내용을 다룰지, 학습 목표, 대상 수준, 기간/회차, 진행 방식 등을 구체적으로 작성해 주세요.'
                : '공부하고 싶은 내용, 현재 수준, 목표, 희망 방식/시간대를 구체적으로 작성해 주세요.'
            }
            rows={4}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
              resize: 'vertical',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '8px',
            }}
          >
            <input
              type="text"
              name="targetLevel"
              value={form.targetLevel}
              onChange={handleFormChange}
              placeholder="대상 수준 (예: 1~2학년, 기초 등)"
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
              }}
            />
            <select
              name="mode"
              value={form.mode}
              onChange={handleFormChange}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
              }}
            >
              <option value="ONLINE">온라인</option>
              <option value="OFFLINE">오프라인</option>
              <option value="MIXED">온·오프라인 병행</option>
            </select>
            <input
              type="text"
              name="preferredTime"
              value={form.preferredTime}
              onChange={handleFormChange}
              placeholder="희망 시간대 (예: 수·목 18~21시)"
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
              }}
            />
          </div>

          {activeType === 'MENTOR_RECRUIT' && (
            <input
              type="number"
              min="1"
              max="50"
              name="capacity"
              value={form.capacity}
              onChange={handleFormChange}
              placeholder="정원 (예: 3)"
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
              }}
            />
          )}

          <input
            type="text"
            name="tagsText"
            value={form.tagsText}
            onChange={handleFormChange}
            placeholder="태그 (쉼표로 구분, 예: C, 기초, 임베디드)"
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '6px',
              gap: '8px',
            }}
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                fontSize: '13px',
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {submitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      )}

      {/* 게시글 리스트 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {loading ? (
          <p>게시글을 불러오는 중입니다...</p>
        ) : posts.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            아직 등록된 게시글이 없습니다.
            {canWrite && ' 상단의 새 글 작성 버튼을 눌러 첫 글을 등록해 보세요.'}
          </p>
        ) : (
          posts.map((post) => renderPostCard(post))
        )}
      </div>

      {lastMessage && (
        <div
          style={{
            marginTop: '16px',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: '#ecfdf5',
            color: '#166534',
            fontSize: '12px',
          }}
        >
          {lastMessage}
        </div>
      )}
    </div>
  );
};

export default MenteeMentorSearchPage;
