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

    if (Array.isArray(data)) {
      return data
    }
    if (Array.isArray(data?.data)) {
      return data.data
    }
    return []
  } catch (error) {
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
    const data = await httpClient(`/api/workspaces/${workspaceId}`, {
      method: 'GET',
    })

    if (data && data.data) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('fetchWorkspaceDetail error:', error)
    throw error
  }
}

/**
 * 🟦 관리자용: 전체 워크스페이스 목록 조회
 * GET /api/admin/workspaces
 * - AdminDashboard에서 사용하는 관리자 리스트라고 보면 된다.
 */
export async function fetchAdminWorkspaces() {
  try {
    const data = await httpClient('/api/workspaces/admin', {
      method: 'GET',
    });


    // data가 바로 배열인 경우
    if (Array.isArray(data)) {
      return data;
    }

    // ApiResponse<{ data: [...] }> 형태 대비
    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('fetchAdminWorkspaces error:', error);
    throw error;
  }
}

