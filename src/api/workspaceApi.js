// src/api/workspaceApi.js
import httpClient from './httpClient'

/**
 * 내가 속한 워크스페이스 목록 조회
 * GET /api/workspaces/me
 */
export async function fetchMyWorkspaces() {
  try {
    const data = await httpClient('/api/workspaces/me', {
      method: 'GET',
    })
    // 백엔드가 ApiResponse로 감싸주는 구조라면 data.data 안에 실제 목록이 있을 수도 있음
    // 상황에 따라 아래 둘 중 하나를 쓰면 됩니다.
    // 여기서는 data.data가 배열이면 그걸, 아니면 data 자체를 반환하도록 방어적으로 처리
    if (Array.isArray(data)) {
      return data
    }
    if (Array.isArray(data?.data)) {
      return data.data
    }
    return []
  } catch (error) {
    // 콘솔에만 찍고, 상위에서 에러 메시지를 쓰도록 그대로 던짐
    console.error('fetchMyWorkspaces error:', error)
    throw error
  }
}

/**
 * 단일 워크스페이스 상세 조회
 * GET /api/workspaces/{workspaceId}
 */
export async function fetchWorkspaceDetail(workspaceId) {
  try {
    // ⚠ 여기서 반드시 매개변수 이름과 내부에서 쓰는 이름을 일치시켜야 함
    const data = await httpClient(`/api/workspaces/${workspaceId}`, {
      method: 'GET',
    })

    // 마찬가지로 ApiResponse 래핑 여부에 따라 분기
    if (data && data.data) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('fetchWorkspaceDetail error:', error)
    throw error
  }
}
