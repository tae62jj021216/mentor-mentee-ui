// src/components/AutoMatchingSection.jsx   (FRONTEND)

import React, { useState } from 'react';
import { fetchAutoMatching } from '../api/matchingApi';

/**
 * programId 를 기반으로 자동 매칭(추천 멘토 모집글)을 조회해서 보여주는 컴포넌트
 *
 * props:
 *  - programId: number (필수)
 */
const AutoMatchingSection = ({ programId }) => {
  const [autoRecommended, setAutoRecommended] = useState([]);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState('');
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const handleLoad = async () => {
    if (!programId) {
      alert('프로그램이 선택되지 않았습니다.');
      return;
    }

    setAutoLoading(true);
    setAutoError('');
    setHasLoadedOnce(true);

    try {
      const list = await fetchAutoMatching(programId);
      console.log('[자동 매칭 결과]', list);

      setAutoRecommended(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('[AutoMatchingSection] 자동 추천 오류:', err);
      setAutoError('자동 추천 결과를 불러오는 중 오류가 발생했습니다.');
      setAutoRecommended([]);
    } finally {
      setAutoLoading(false);
    }
  };

  return (
    <section
      style={{
        marginBottom: '16px',
        padding: '14px 16px',
        borderRadius: '14px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
      }}
    >
      {/* 헤더 + 버튼 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '2px',
            }}
          >
            자동 추천 멘토
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            현재 선택된 프로그램 기준으로 추천된 멘토 모집글입니다.
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoad}
          disabled={autoLoading}
          style={{
            padding: '6px 12px',
            borderRadius: '9999px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            cursor: autoLoading ? 'default' : 'pointer',
            opacity: autoLoading ? 0.7 : 1,
          }}
        >
          {autoLoading ? '추천 불러오는 중…' : '자동 추천 보기'}
        </button>
      </div>

      {/* 에러 메시지 */}
      {autoError && (
        <div
          style={{
            marginBottom: '10px',
            padding: '8px 10px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            fontSize: '12px',
          }}
        >
          {autoError}
        </div>
      )}

      {/* 아직 한 번도 안 눌렀을 때 안내 문구 */}
      {!hasLoadedOnce && !autoLoading && !autoError && (
        <div
          style={{
            fontSize: '12px',
            color: '#9ca3af',
          }}
        >
          아직 추천 결과가 없습니다. 버튼을 눌러 자동 추천을 실행해 보세요.
        </div>
      )}

      {/* 불러왔는데도 추천이 없을 때 */}
      {hasLoadedOnce &&
        !autoLoading &&
        !autoError &&
        autoRecommended.length === 0 && (
          <div
            style={{
              fontSize: '12px',
              color: '#9ca3af',
            }}
          >
            현재 조건에 맞는 추천 멘토 모집글이 없습니다.
          </div>
        )}

      {/* 추천 결과 리스트 */}
      {!autoLoading && autoRecommended.length > 0 && (
        <>
          <div
            style={{
              fontSize: '11px',
              color: '#9ca3af',
              marginBottom: '6px',
            }}
          >
            총 {autoRecommended.length}건의 추천 결과
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {autoRecommended.map((item) => {
              const {
                postId,
                title,
                mentorName,
                score,
                type,
              } = item;

              const typeLabel =
                type === 'MENTOR_RECRUIT'
                  ? '멘토 모집글'
                  : type === 'MENTEE_REQUEST'
                  ? '멘티 요청글'
                  : type || '';

              const hasScore =
                typeof score === 'number' && !Number.isNaN(score);
              const scoreText = hasScore
                ? `매칭 점수 ${(score * 100).toFixed(1)}점`
                : null;

              return (
                <div
                  key={postId}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        marginBottom: '2px',
                      }}
                    >
                      {title || '제목 없음'}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                      }}
                    >
                      {mentorName || '멘토'}
                      {typeLabel && ` · ${typeLabel}`}
                      {scoreText && ` · ${scoreText}`}
                    </div>
                  </div>

                  {/* 나중에 원하면 상세 페이지로 이동 버튼도 추가 가능 */}
                  {/* <button ...>상세보기</button> */}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default AutoMatchingSection;
