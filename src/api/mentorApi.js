// src/api/mentorApi.js
import httpClient from './httpClient'

// 멘토 리스트 조회 (관리자 또는 멘토용)
// 백엔드: GET /api/users?role=MENTOR&page=0&size=20 를 기대하지만
// 실제로는 모든 유저를 내려주는 것 같아서, 프론트에서 role=MENTOR만 필터링한다.
export async function fetchMentorList({ page = 0, size = 20 } = {}) {
  const query = `?role=MENTOR&page=${page}&size=${size}`

  const res = await httpClient(`/users${query}`, {
    method: 'GET',
  })

  if (!res || res.success === false) {
    const msg = res?.message || '멘토 목록을 불러오지 못했습니다.'
    throw new Error(msg)
  }

  const pageData = res.data || {}
  const allUsers = pageData.content || []

  const mentors = allUsers.filter((u) => u.role === 'MENTOR')

  const totalElements = mentors.length
  const pageSize = size || pageData.size || 20
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize))

  // 지금은 데이터가 적으니까 한 페이지에 다 보여주는 식으로 단순하게 맞춘다.
  return {
    ...pageData,
    content: mentors,
    totalElements,
    totalPages,
    number: 0, // 0페이지 (1페이지)로 고정
    size: pageSize,
  }
}

/**
 * 추천 멘토 모집글 조회
 * GET /api/programs/{programId}/matching/recommendations
 * Response: List<MatchingSuggestionResponse>
 */
export async function fetchRecommendedMentorPosts(programId) {
  if (!programId) {
    throw new Error('programId가 필요합니다.')
  }

  const res = await httpClient(`/programs/${programId}/matching/recommendations`, {
    method: 'GET',
  })

  if (!res || res.success === false) {
    const msg = res?.message || '추천 멘토 목록을 불러오지 못했습니다.'
    throw new Error(msg)
  }

  // 백엔드 명세상 data가 List<MatchingSuggestionResponse>
  // (postId, title, type, mentorId, mentorName, score ...)
  return res.data || []
}

export const fetchMentorAvailabilities = (mentorId) => {
  return httpClient
    .get(`/mentors/${mentorId}/availabilities`)
    .then((res) => res.data);
};

export const createMentorAvailability = (mentorId, payload) => {
  return httpClient
    .post(`/mentors/${mentorId}/availabilities`, payload)
    .then((res) => res.data);
};

export const deleteMentorAvailability = (mentorId, availabilityId) => {
  return httpClient.delete(
    `/mentors/${mentorId}/availabilities/${availabilityId}`,
  );
};
