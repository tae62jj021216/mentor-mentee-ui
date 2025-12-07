// src/pages/WorkspaceListPage.jsx
import { useEffect, useState } from 'react'
import { fetchAdminWorkspaces } from '../api/workspaceApi'

export default function WorkspaceListPage() {
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        setLoading(true)
        setError(null)

        // ✅ 이제 관리자용 전체 목록 API 사용
        const data = await fetchAdminWorkspaces()
        setWorkspaces(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('워크스페이스 목록 로딩 실패:', err)

        const message =
          err?.response?.data?.message ||
          err.message ||
          '워크스페이스 목록을 불러오는 중 오류가 발생했습니다.'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadWorkspaces()
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
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '8px',
          }}
        >
          워크스페이스 관리
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '16px',
          }}
        >
          전체 멘토링 팀(워크스페이스)의 상태를 한눈에 확인하고 관리하는 화면입니다.
          프로그램별 운영 현황, 참여 인원, 상태 등을 점검할 수 있습니다.
        </p>

        {/* 로딩 상태 */}
        {loading && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
              fontSize: '14px',
            }}
          >
            워크스페이스 목록을 불러오는 중입니다...
          </div>
        )}

        {/* 에러 상태 */}
        {!loading && error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
              fontSize: '14px',
              marginBottom: '12px',
            }}
          >
            워크스페이스 목록을 불러오지 못했습니다.
            <br />
            <span style={{ fontSize: '13px', color: '#991b1b' }}>{error}</span>
          </div>
        )}

        {/* 테이블 영역 */}
        {!loading && !error && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead
                style={{
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <tr>
                  <th style={thStyle}>워크스페이스 ID</th>
                  <th style={thStyle}>프로그램명</th>
                  <th style={thStyle}>내 역할</th>
                  <th style={thStyle}>상태</th>
                  <th style={thStyle}>최근 업데이트</th>
                </tr>
              </thead>
              <tbody>
                {workspaces.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        color: '#9ca3af',
                      }}
                    >
                      등록된 워크스페이스가 없습니다.
                    </td>
                  </tr>
                ) : (
                  workspaces.map((ws) => (
                    <tr key={ws.workspaceId}>
                      <td style={tdStyle}>{ws.workspaceId}</td>
                      <td style={tdStyle}>{ws.programName}</td>
                      <td style={tdStyle}>{ws.roleInWorkspace}</td>
                      <td style={tdStyle}>{ws.status}</td>
                      <td style={tdStyle}>
                        {ws.lastUpdatedAt
                          ? ws.lastUpdatedAt.replace('T', ' ').slice(0, 16)
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const thStyle = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '13px',
  color: '#4b5563',
  borderBottom: '1px solid #e5e7eb',
}

const tdStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid #f3f4f6',
  color: '#374151',
  fontSize: '14px',
}
