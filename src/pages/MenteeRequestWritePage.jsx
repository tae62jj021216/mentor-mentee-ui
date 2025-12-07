// src/pages/MenteeRequestWritePage.jsx
import React, { useState } from 'react';
import { createMenteeRequestPost } from '../api/postApi';

/**
 * 멘티 요청글 작성 페이지
 *  - POST /api/posts (type = MENTEE_REQUEST) 를 호출한다.
 *  - 지금은 최소 필드(programId, title, content)만 사용하고,
 *    나머지 옵션 필드는 천천히 확장해도 된다.
 */
const MenteeRequestWritePage = () => {
  // 최소 필드
  const [programId, setProgramId] = useState('1'); // TODO: 추후 드롭다운으로 교체
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 선택 필드 (지금은 필수 아님)
  const [targetLevel, setTargetLevel] = useState('');
  const [maxMembers, setMaxMembers] = useState(1);
  const [expectedWeeks, setExpectedWeeks] = useState('');
  const [expectedSessionsTotal, setExpectedSessionsTotal] = useState('');
  const [expectedSessionsPerWeek, setExpectedSessionsPerWeek] = useState('');
  const [preferredMode, setPreferredMode] = useState('');
  const [preferredTimeNote, setPreferredTimeNote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!programId || !title.trim() || !content.trim()) {
      setErrorMessage('프로그램, 제목, 내용을 모두 입력해 주세요.');
      return;
    }

    try {
      setSubmitting(true);

      await createMenteeRequestPost({
        programId: Number(programId),
        title: title.trim(),
        content: content.trim(),
        targetLevel: targetLevel || null,
        maxMembers: maxMembers ? Number(maxMembers) : null,
        expectedWeeks: expectedWeeks ? Number(expectedWeeks) : null,
        expectedSessionsTotal: expectedSessionsTotal
          ? Number(expectedSessionsTotal)
          : null,
        expectedSessionsPerWeek: expectedSessionsPerWeek
          ? Number(expectedSessionsPerWeek)
          : null,
        preferredMode: preferredMode || null,
        preferredTimeNote: preferredTimeNote || null,
        tagIds: [], // 태그 기능은 나중 단계에서 붙인다.
      });

      setSuccessMessage('멘티 요청글이 성공적으로 등록되었습니다.');
      // TODO: 나중에 목록 페이지로 이동 로직 추가 예정
      // navigate('/mentee/requests'); 이런 식으로
    } catch (err) {
      console.error('[MenteeRequestWritePage] create error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        '요청글 등록 중 오류가 발생했습니다.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          멘티 요청글 작성
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '20px',
          }}
        >
          프로그램, 학습 수준, 선호 방식을 입력하고 도움을 받고 싶은 내용을
          자유롭게 작성해 주세요.
        </p>

        {errorMessage && (
          <div
            style={{
              marginBottom: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              fontSize: '13px',
            }}
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              marginBottom: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#166534',
              fontSize: '13px',
            }}
          >
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px 22px',
            boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* 프로그램 ID (임시 숫자 입력 → 나중에 드롭다운으로 교체) */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              프로그램 ID
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </label>
            <input
              type="number"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              placeholder="예: 1"
              style={{
                width: '100%',
                padding: '9px 11px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 제목 */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              제목
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: RTOS 과제 멘토링을 받고 싶습니다."
              style={{
                width: '100%',
                padding: '9px 11px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 내용 */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              내용
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="어떤 부분이 어려운지, 언제까지 도움이 필요한지 등을 자세히 적어 주세요."
              rows={6}
              style={{
                width: '100%',
                padding: '9px 11px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>

          {/* 선택 항목 묶음 (필요 시만 채워도 됨) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                대상 수준 (예: 초급, 중급)
              </label>
              <input
                type="text"
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                최대 인원 수
              </label>
              <input
                type="number"
                min={1}
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                예상 기간(주)
              </label>
              <input
                type="number"
                min={1}
                value={expectedWeeks}
                onChange={(e) => setExpectedWeeks(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                총 세션 수
              </label>
              <input
                type="number"
                min={1}
                value={expectedSessionsTotal}
                onChange={(e) => setExpectedSessionsTotal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                주당 세션 수
              </label>
              <input
                type="number"
                min={1}
                value={expectedSessionsPerWeek}
                onChange={(e) =>
                  setExpectedSessionsPerWeek(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                선호 방식 (온라인/오프라인 등)
              </label>
              <input
                type="text"
                value={preferredMode}
                onChange={(e) => setPreferredMode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                선호 시간대 / 기타 메모
              </label>
              <input
                type="text"
                value={preferredTimeNote}
                onChange={(e) => setPreferredTimeNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            {/* 나중에 취소 버튼에서 목록 페이지로 이동 로직을 넣어도 됨 */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: submitting ? '#9ca3af' : '#2563eb',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: submitting ? 'default' : 'pointer',
              }}
            >
              {submitting ? '등록 중…' : '요청글 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenteeRequestWritePage;
