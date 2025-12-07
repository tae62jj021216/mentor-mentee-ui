// src/api/matchingApi.js   (FRONTEND)

import httpClient from './httpClient';

/**
 * 프로그램 단위 자동 매칭(추천 멘토 모집글) 조회
 * GET /api/programs/{programId}/matching/recommendations
 */
export async function fetchAutoMatching(programId) {
  const res = await httpClient(
    `/api/programs/${programId}/matching/recommendations`,
    {
      method: 'GET',
    },
  );

  // res 형태에 따라 배열만 뽑아서 반환
  // 1) [{...}, {...}] 인 경우
  if (Array.isArray(res)) return res;

  // 2) { data: [...] } 인 경우  ← 지금 네 백엔드 응답 형태
  if (res && Array.isArray(res.data)) return res.data;

  // 3) { content: [...] } 같은 페이징 형태일 수도 있으니 방어적으로 처리
  if (res && Array.isArray(res.content)) return res.content;

  return [];
}
