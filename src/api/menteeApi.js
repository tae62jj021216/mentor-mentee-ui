// src/api/menteeApi.js
import httpClient from './httpClient'

/**
 * 멘티 리스트 조회 (관리자/멘토용)
 * 백엔드 스펙:
 *   GET /api/users?role=MENTEE&page=0&size=20
 *   → 실제로는 모든 유저를 내려줘도, 프론트에서 role === 'MENTEE' 만 사용
 */
export async function fetchMenteeList({ page = 0, size = 20 } = {}) {
  const query = `?role=MENTEE&page=${page}&size=${size}`

  // 멘토 리스트와 동일하게 /api/users 경로 사용
  const res = await httpClient(`/api/users${query}`, {
    method: 'GET',
  })

  if (!res || res.success === false) {
    const msg = res?.message || '멘티 목록을 불러오지 못했습니다.'
    throw new Error(msg)
  }

  // httpClient가 ApiResponse를 감싸서 주는 경우와 그대로 주는 경우 모두 대응
  const pageData =
    res && res.data && (res.data.content || res.data.totalElements != null)
      ? res.data
      : res || {}

  const rawContent = pageData.content || []

  // 🔹 멘티만 필터링
  const content = rawContent.filter((u) => u.role === 'MENTEE')

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
 * 내 멘티 프로필 조회 (멘티 본인이 쓰는 API)
 * 가정: GET /api/users/me  → { success, data: { ...내 정보... } }
 */
export async function fetchMyMenteeProfile() {
  const res = await httpClient('/api/users/me', {
    method: 'GET',
  })

  if (!res || res.success === false) {
    const msg = res?.message || '멘티 프로필을 불러오지 못했습니다.'
    throw new Error(msg)
  }

  // ApiResponse 래핑일 때와 아닐 때 둘 다 대응
  const data = res.data || res
  return data || {}
}

/**
 * 추천 멘토 조회 (멘티 프로필 우측 카드)
 * 가정: GET /api/mentors/recommend?tags=java,spring
 *  - tags: 문자열 배열
 */
export async function fetchRecommendedMentors(tags = []) {
  const query =
    tags && tags.length > 0
      ? `?tags=${encodeURIComponent(tags.join(','))}`
      : ''

  const res = await httpClient(`/api/mentors/recommend${query}`, {
    method: 'GET',
  })

  if (!res || res.success === false) {
    const msg = res?.message || '추천 멘토 목록을 불러오지 못했습니다.'
    throw new Error(msg)
  }

  // 응답이 { data: [...] } 이거나 바로 [...] 이거나 둘 다 대응
  return res.data ?? res
}
