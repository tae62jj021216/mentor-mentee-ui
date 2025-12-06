// src/pages/MenteeMatchingPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchMySentApplications,
  fetchMyReceivedApplications,
  acceptPostApplication,
  rejectPostApplication,
} from '../api/postApplicationApi';

const MenteeMatchingPage = () => {
  const { user } = useAuth();

  // SENT: 내가 보낸 신청, RECEIVED: 나에게 온 신청
  const [activeTab, setActiveTab] = useState('SENT');

  const [sentList, setSentList] = useState([]);
  const [receivedList, setReceivedList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  // ─────────────────────────────────────
  // 신청 상태 표시용
  // ─────────────────────────────────────
  const renderStatusBadge = (statusRaw) => {
    if (!statusRaw) {
      return (
        <span
          style={{
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '11px',
            backgroundColor: '#e5e7eb',
            color: '#4b5563',
          }}
        >
          미정
        </span>
      );
    }

    const status = String(statusRaw).toUpperCase();

    let label = status;
    let bg = '#e5e7eb';
    let color = '#4b5563';

    if (status === 'PENDING') {
      label = '대기';
      bg = '#eff6ff';
      color = '#1d4ed8';
    } else if (status === 'ACCEPTED') {
      label = '수락';
      bg = '#dcfce7';
      color = '#15803d';
    } else if (status === 'REJECTED') {
      label = '거절';
      bg = '#fee2e2';
      color = '#b91c1c';
    } else if (status === 'CANCELED') {
      label = '취소';
      bg = '#fef9c3';
      color = '#92400e';
    }

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '9999px',
          fontSize: '11px',
          backgroundColor: bg,
          color,
        }}
      >
        {label}
      </span>
    );
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      const yyyy = d.getFullYear();
      const MM = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
    } catch {
      return String(value);
    }
  };

  const formatPostType = (type) => {
    if (!type) return '';
    const t = String(type).toUpperCase();
    if (t === 'MENTOR_RECRUIT') return '멘토 모집글';
    if (t === 'MENTEE_REQUEST') return '멘티 요청글';
    return type;
  };

  // ─────────────────────────────────────
  // 목록 로딩
  // ─────────────────────────────────────
  const loadAllApplications = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const [sent, received] = await Promise.all([
        fetchMySentApplications(),
        fetchMyReceivedApplications(),
      ]);

      setSentList(Array.isArray(sent) ? sent : []);
      setReceivedList(Array.isArray(received) ? received : []);
    } catch (err) {
      console.error('[MenteeMatchingPage] 신청 목록 조회 실패:', err);
      setErrorMessage('신청 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllApplications();
    }
  }, [user]);

  // ─────────────────────────────────────
  // 수락 / 거절
  // ─────────────────────────────────────
  const handleAccept = async (applicationId) => {
    if (!window.confirm('이 신청을 수락하시겠습니까?')) return;

    setActionLoadingId(applicationId);
    try {
      await acceptPostApplication(applicationId);
      alert('신청을 수락했습니다. 워크스페이스가 생성되면 관련 화면에서 확인할 수 있습니다.');
      await loadAllApplications();
    } catch (err) {
      console.error('[MenteeMatchingPage] 신청 수락 실패:', err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        null;
      if (backendMessage) {
        alert(`수락 실패: ${backendMessage}`);
      } else {
        alert('신청을 수락하는 중 오류가 발생했습니다.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (applicationId) => {
    if (!window.confirm('이 신청을 거절하시겠습니까?')) return;

    setActionLoadingId(applicationId);
    try {
      await rejectPostApplication(applicationId);
      alert('신청을 거절했습니다.');
      await loadAllApplications();
    } catch (err) {
      console.error('[MenteeMatchingPage] 신청 거절 실패:', err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        null;
      if (backendMessage) {
        alert(`거절 실패: ${backendMessage}`);
      } else {
        alert('신청을 거절하는 중 오류가 발생했습니다.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // ─────────────────────────────────────
  // 카드 렌더링
  // ─────────────────────────────────────
  const renderApplicationCard = (app, type) => {
    // type: 'SENT' | 'RECEIVED'
    const status = app.status || app.applicationStatus;
    const postTitle = app.postTitle || app.post?.title || '(제목 없음)';
    const postType = app.postType || app.post?.type;
    const programName =
      app.programName || app.post?.programName || app.post?.program?.name;

    const createdAt =
      app.createdAt || app.created_at || app.appliedAt || app.requestedAt;

    const fromName =
      app.fromUserName ||
      app.fromUser?.name ||
      app.applicantName ||
      '신청자';

    const toName =
      app.toUserName || app.toUser?.name || app.receiverName || '대상자';

    const isPending = String(status || '').toUpperCase() === 'PENDING';
    const showButtons = type === 'RECEIVED' && isPending;

    return (
      <div
        key={app.id}
        style={{
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '14px 16px',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: 1,
          }}
        >
          {/* 상단: 글 제목 + 유형태그 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '2px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {postTitle}
            </div>
            {postType && (
              <span
                style={{
                  padding: '3px 7px',
                  borderRadius: '9999px',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '11px',
                }}
              >
                {formatPostType(postType)}
              </span>
            )}
          </div>

          {/* 두 번째 줄: from → to + 상태 */}
          <div
            style={{
              fontSize: '12px',
              color: '#6b7280',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignItems: 'center',
            }}
          >
            <span>
              {type === 'SENT'
                ? `내가 ${toName}에게 보낸 신청`
                : `${fromName}이(가) 나에게 보낸 신청`}
            </span>
            <span>·</span>
            <span>{programName ? programName : '프로그램 미지정'}</span>
            <span>·</span>
            <span>{formatDateTime(createdAt)}</span>
            <span>·</span>
            {renderStatusBadge(status)}
          </div>
        </div>

        {/* 우측 버튼 영역 */}
        {showButtons && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              disabled={actionLoadingId === app.id}
              onClick={() => handleAccept(app.id)}
              style={{
                padding: '7px 12px',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: '#16a34a',
                color: '#ffffff',
                cursor:
                  actionLoadingId === app.id ? 'default' : 'pointer',
              }}
            >
              {actionLoadingId === app.id ? '처리 중...' : '수락'}
            </button>
            <button
              type="button"
              disabled={actionLoadingId === app.id}
              onClick={() => handleReject(app.id)}
              style={{
                padding: '7px 12px',
                borderRadius: '9999px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: '#ffffff',
                color: '#374151',
                cursor:
                  actionLoadingId === app.id ? 'default' : 'pointer',
              }}
            >
              거절
            </button>
          </div>
        )}
      </div>
    );
  };

  const currentList = activeTab === 'SENT' ? sentList : receivedList;

  // ─────────────────────────────────────
  // 렌더링
  // ─────────────────────────────────────
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        {/* 타이틀 */}
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          매칭 / 요청
        </h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '18px' }}>
          멘토·멘티 사이에 오간 신청 내역을 한 곳에서 관리하고, 받은 신청에 대해
          수락/거절을 처리할 수 있는 화면입니다.
        </p>

        {/* 탭 스위치 */}
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
            onClick={() => setActiveTab('SENT')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor:
                activeTab === 'SENT' ? '#ffffff' : 'transparent',
              boxShadow:
                activeTab === 'SENT'
                  ? '0 1px 3px rgba(0,0,0,0.08)'
                  : 'none',
            }}
          >
            내가 보낸 신청
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RECEIVED')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor:
                activeTab === 'RECEIVED' ? '#ffffff' : 'transparent',
              boxShadow:
                activeTab === 'RECEIVED'
                  ? '0 1px 3px rgba(0,0,0,0.08)'
                  : 'none',
            }}
          >
            나에게 온 신청
          </button>
        </div>

        {/* 목록 영역 */}
        <section
          style={{
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
          }}
        >
          <div
            style={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                {activeTab === 'SENT' ? '내가 보낸 신청 목록' : '나에게 온 신청 목록'}
              </h2>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                {activeTab === 'SENT'
                  ? '멘토/멘티에게 보낸 신청들의 상태를 확인할 수 있습니다.'
                  : '다른 사용자들이 나에게 보낸 신청을 확인하고 수락/거절할 수 있습니다.'}
              </p>
            </div>
          </div>

          {loading ? (
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              신청 목록을 불러오는 중입니다...
            </p>
          ) : currentList.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              {activeTab === 'SENT'
                ? '아직 보낸 신청이 없습니다. 멘토 찾기 / 요청글에서 관심 있는 글에 신청해 보세요.'
                : '아직 받은 신청이 없습니다. 멘토 또는 멘티로 모집글/요청글을 등록하면 신청이 도착합니다.'}
            </p>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {currentList.map((app) =>
                renderApplicationCard(app, activeTab),
              )}
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                fontSize: '12px',
              }}
            >
              {errorMessage}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MenteeMatchingPage;
