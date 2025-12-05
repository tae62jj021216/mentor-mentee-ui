// src/api/sessionApi.js
import httpClient from './httpClient'

/**
 * 상담/세션 목록 조회
 *
 * 백엔드 응답 형태는 두 가지를 모두 대비한다.
 * 1) ApiResponse 형태: { success, data, message, ... }
 * 2) 그냥 배열 또는 페이지 객체: [...], 혹은 { content: [...], totalElements, ... }
 *
 * httpClient 는 fetch 래퍼로,
 * - httpClient('/sessions') 처럼 "함수 호출" 형태로 사용하고
 * - 반환값이 곧 서버에서 내려준 JSON 또는 문자열이다.
 */
export async function fetchSessions() {
  try {
    // ❗예전 코드에서는 httpClient.get('/sessions') 를 썼는데,
    // httpClient는 함수이므로 이렇게 호출해야 한다.
    const result = await httpClient('/sessions') // 실제 호출: GET /api/sessions

    // 응답이 문자열(에러 메시지 텍스트 등)인 경우
    if (typeof result === 'string') {
      if (!result) {
        throw new Error('세션 목록을 불러오지 못했습니다.')
      }
      throw new Error(result)
    }

    // ApiResponse 래핑되어 있는 경우: { success, data, message, ... }
    if (typeof result?.success !== 'undefined' && !result.success) {
      throw new Error(result.message || '세션 목록을 불러오지 못했습니다.')
    }

    // result.data 가 있으면 우선 사용, 없으면 그대로 사용
    const rawData = result?.data ?? result

    // 페이지 정보가 있는 경우: { content: [...], totalElements, ... }
    const list = Array.isArray(rawData?.content) ? rawData.content : rawData

    if (!Array.isArray(list)) {
      console.error('세션 API 응답 형식이 예상과 다릅니다:', rawData)
      return []
    }

    // 프론트에서 쓰기 좋은 형태로 매핑
    const normalized = list.map((s) => {
      const mentorName =
        s.mentorName || s.mentor?.name || s.mentor_name || '알 수 없음'
      const menteeName =
        s.menteeName || s.mentee?.name || s.mentee_name || '알 수 없음'
      const topic = s.topic || s.title || s.subject || '주제 없음'
      const status = s.status || s.sessionStatus || '상태 없음'
      const dateRaw =
        s.date || s.sessionDate || s.scheduledAt || s.createdAt || ''

      const date =
        typeof dateRaw === 'string' && dateRaw.length >= 10
          ? dateRaw.slice(0, 10)
          : dateRaw

      return {
        id: s.id,
        mentorName,
        menteeName,
        topic,
        status,
        date,
      }
    })

    return normalized
  } catch (error) {
    console.error('세션 목록 조회 실패:', error)
    throw error
  }
}
