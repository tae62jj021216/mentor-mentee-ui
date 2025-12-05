// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react'
import { fetchAdminDashboardSummary } from '../api/dashboardApi'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)

        // 관리자 대시보드 합계 조회
        const data = await fetchAdminDashboardSummary()
        // data 예시:
        // { totalUsers, totalPosts, totalWorkspaces, totalSessions, totalAssignments, totalSubmissions, totalFeedbacks }

        setSummary(data)
      } catch (err) {
        console.error('대시보드 로딩 중 오류:', err)

        // 401/403 같은 권한 문제일 수도 있으니, 메시지 정리
        const message =
          err.response?.data?.message ||
          err.message ||
          '대시보드 데이터를 불러오는 중 오류가 발생했습니다.'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
          }}
        >
          관리자 대시보드
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '20px',
          }}
        >
          멘토·멘티 프로그램 운영 현황 요약입니다.
        </p>

        {/* 로딩 상태 */}
        {loading && (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
              fontSize: '14px',
            }}
          >
            대시보드 데이터를 불러오는 중입니다...
          </div>
        )}

        {/* 오류 상태 */}
        {!loading && error && (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            대시보드 데이터를 불러오지 못했습니다.
            <br />
            <span style={{ fontSize: '13px', color: '#991b1b' }}>{error}</span>
          </div>
        )}

        {/* 정상 데이터 표시 */}
        {!loading && !error && summary && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <StatCard
              label="전체 사용자 수"
              value={summary.totalUsers}
              description="멘토·멘티 및 관리자 계정 수"
            />
            <StatCard
              label="게시글 수"
              value={summary.totalPosts}
              description="멘토 모집글 / 멘티 요청글 포함"
            />
            <StatCard
              label="워크스페이스 수"
              value={summary.totalWorkspaces}
              description="실제 매칭되어 운영 중인 공간"
            />
            <StatCard
              label="세션 수"
              value={summary.totalSessions}
              description="등록된 멘토링 회차 수"
            />
            <StatCard
              label="과제 수"
              value={summary.totalAssignments}
              description="등록된 과제 총 개수"
            />
            <StatCard
              label="과제 제출 수"
              value={summary.totalSubmissions}
              description="멘티가 제출한 과제 수"
            />
            <StatCard
              label="피드백 수"
              value={summary.totalFeedbacks}
              description="프로그램/멘토/멘티에 대한 평가 수"
            />
          </div>
        )}

        {/* summary 자체도 없고 loading/error도 아닌 극단적 예외 케이스 */}
        {!loading && !error && !summary && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
              fontSize: '14px',
            }}
          >
            표시할 대시보드 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, description }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '16px 18px',
        boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '4px',
        }}
      >
        {value ?? '-'}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: '#9ca3af',
        }}
      >
        {description}
      </div>
    </div>
  )
}
