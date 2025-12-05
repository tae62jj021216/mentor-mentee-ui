// src/api/menteeApi.js
import httpClient from './httpClient'

// 멘티 리스트 조회
// 백엔드: GET /api/users?role=MENTEE&page=0&size=20 를 기대하지만
// 실제로는 모든 유저를 내려주는 것 같아서, 프론트에서 role=MENTEE만 필터링한다.
export async function fetchMenteeList({ page = 0, size = 20 } = {}) {
  const query = `?role=MENTEE&page=${page}&size=${size}`

  const res = await httpClient(`/users${query}`, {
    method: 'GET',
  })

  if (!res || res.success === false) {
    const msg = res?.message || '멘티 목록을 불러오지 못했습니다.'
    throw new Error(msg)
  }

  const pageData = res.data || {}
  const allUsers = pageData.content || []

  const mentees = allUsers.filter((u) => u.role === 'MENTEE')

  const totalElements = mentees.length
  const pageSize = size || pageData.size || 20
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize))

  return {
    ...pageData,
    content: mentees,
    totalElements,
    totalPages,
    number: 0,
    size: pageSize,
  }
}
