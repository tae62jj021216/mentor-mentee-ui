// src/api/dashboardApi.js
import httpClient from './httpClient'

// 관리자 대시보드 합계 정보 가져오기
// 백엔드 엔드포인트: GET /api/admin/dashboard
export async function fetchAdminDashboardSummary() {
  try {
    const response = await httpClient.get('/admin/dashboard')

    // 백엔드가 ApiResponse 형태로 내려준다고 가정
    // { success, data, message, errorCode }
    const result = response.data

    if (!result.success) {
      // 서버 쪽에서 비즈니스 에러를 준 경우
      throw new Error(result.message || '대시보드 데이터를 불러오지 못했습니다.')
    }

    // data 안에 실제 합계 값들 있음
    return result.data
  } catch (error) {
    console.error('관리자 대시보드 조회 실패:', error)
    throw error
  }
}
