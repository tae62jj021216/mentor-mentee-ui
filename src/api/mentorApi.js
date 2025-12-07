// src/api/mentorApi.js
import httpClient from './httpClient'

/**
 * 멘토 리스트 조회 (관리자/멘토용)
 * 백엔드 스펙:
 *   GET /api/users?role=MENTOR&page=0&size=20
 *   → 실제로는 모든 유저를 내려줘도, 프론트에서 role === 'MENTOR' 만 사용
 */
export async function fetchMentorList({ page = 0, size = 20 } = {}) {
  const query = `?role=MENTOR&page=${page}&size=${size}`

  const res = await httpClient(`/api/users${query}`, {
    method: 'GET',
  })

  if (!res || res.success === false) {
    const msg = res?.message || '멘토 목록을 불러오지 못했습니다.'
    throw new Error(msg)
  }

  // httpClient가 ApiResponse를 감싸서 주는 경우와 그대로 주는 경우 모두 대응
  const pageData =
    res && res.data && (res.data.content || res.data.totalElements != null)
      ? res.data
      : res || {}

  const rawContent = pageData.content || []

  // 🔹 멘토만 필터링
  const content = rawContent.filter((u) => u.role === 'MENTOR')

  // 🔹 필터링된 데이터 기준으로 페이징 정보 재계산
  const pageSize = pageData.size || size
  const totalElements = content.length
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize))
  const number =
    pageData.number != null && !Number.isNaN(pageData.number)
      ? pageData.number
      : page

  return {
    ...pageData,
    content,
    totalElements,
    totalPages,
    number,
    size: pageSize,
  }
}

/**
 * 추천 멘토 모집글 조회
 * GET /api/programs/{programId}/matching/recommendations
 */
export async function fetchRecommendedMentorPosts(programId) {
  if (!programId) throw new Error('programId가 필요합니다.')

  const res = await httpClient(
    `/api/programs/${programId}/matching/recommendations`,
    { method: 'GET' },
  )

  if (!res || res.success === false) {
    throw new Error(res?.message || '추천 멘토 목록을 불러오지 못했습니다.')
  }

  return res.data || res || []
}

/**
 * 멘토 가능 시간 관련
 */
export const fetchMentorAvailabilities = (mentorId) =>
  httpClient
    .get(`/mentors/${mentorId}/availabilities`)
    .then((res) => res.data)

export const createMentorAvailability = (mentorId, payload) =>
  httpClient
    .post(`/mentors/${mentorId}/availabilities`, payload)
    .then((res) => res.data)

export const deleteMentorAvailability = (mentorId, availabilityId) =>
  httpClient.delete(`/mentors/${mentorId}/availabilities/${availabilityId}`)
