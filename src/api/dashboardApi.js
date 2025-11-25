// src/api/dashboardApi.js

// 지금은 임시 더미 데이터.
// 나중에 백엔드 완성되면 이 함수 안만 실제 fetch 코드로 교체.
export async function fetchDashboardSummary() {

  // 현재는 임시 값만 반환
  return {
    totalMentors: 24,
    totalMentees: 68,
    ongoingSessions: 12,
    pendingRequests: 5,
  }
}
