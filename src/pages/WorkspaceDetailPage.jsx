// src/pages/WorkspaceDetailPage.jsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchWorkspaceDetail } from '../api/workspaceApi'

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams()

  const [workspace, setWorkspace] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWorkspaceDetail(workspaceId)
      .then((data) => {
        setWorkspace(data)
      })
      .catch((err) => {
        setError(err.message || '불러오기 오류')
      })
  }, [workspaceId])

  if (error) {
    return (
      <div
        style={{
          background: '#fee2e2',
          padding: '16px',
          borderRadius: '8px',
          color: '#b91c1c',
        }}
      >
        워크스페이스 정보를 불러오지 못했습니다.
        <br />
        {error}
      </div>
    )
  }

  if (!workspace) {
    return <p>워크스페이스 정보를 불러오는 중...</p>
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>워크스페이스 상세 정보</h2>

      <div
        style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <p>
          <strong>ID:</strong> {workspace.workspaceId}
        </p>
        <p>
          <strong>프로그램:</strong> {workspace.programName}
        </p>
        <p>
          <strong>상태:</strong> {workspace.status}
        </p>

        <p style={{ marginTop: '12px', fontWeight: 'bold' }}>멘토</p>
        <p>
          {workspace.mentor?.name} (ID: {workspace.mentor?.userId})
        </p>

        <p style={{ marginTop: '12px', fontWeight: 'bold' }}>멘티</p>
        <p>
          {workspace.mentee?.name} (ID: {workspace.mentee?.userId})
        </p>
      </div>
    </div>
  )
}
