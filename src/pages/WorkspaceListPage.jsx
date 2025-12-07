// src/pages/WorkspaceListPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchMyWorkspaces,
  fetchAdminWorkspaces,
} from '../api/workspaceApi';

export default function WorkspaceListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoading(true);
      setErrorMsg('');

      try {
        // ADMIN이면 전체 목록, 나머지는 내가 속한 목록
        const data = isAdmin
          ? await fetchAdminWorkspaces()
          : await fetchMyWorkspaces();

        setWorkspaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('WorkspaceListPage load error:', err);
        setErrorMsg('워크스페이스 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, isAdmin]);

  const formatDate = (value) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleDateString('ko-KR');
    } catch {
      return String(value);
    }
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        워크스페이스 관리
      </h2>

      <p
        style={{
          marginBottom: 16,
          fontSize: 13,
          color: '#6b7280',
        }}
      >
        전체 멘토링 팀(워크스페이스)의 상태를 한눈에 확인하고 관리할 수 있는 화면입니다.
        {isAdmin
          ? ' (관리자 계정에서는 모든 워크스페이스가 표시됩니다.)'
          : ' (로그인한 계정이 속한 워크스페이스만 표시됩니다.)'}
      </p>

      {loading && (
        <div style={{ fontSize: 13, marginTop: 16 }}>불러오는 중입니다…</div>
      )}

      {!loading && errorMsg && (
        <div
          style={{
            fontSize: 13,
            marginTop: 16,
            color: '#b91c1c',
          }}
        >
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && workspaces.length === 0 && (
        <div
          style={{
            fontSize: 13,
            marginTop: 16,
            color: '#6b7280',
          }}
        >
          등록된 워크스페이스가 없습니다.
        </div>
      )}

      {!loading && !errorMsg && workspaces.length > 0 && (
        <div
          style={{
            marginTop: 12,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
          }}
        >
          {/* 헤더 행 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1.5fr 120px 120px 160px',
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <div>워크스페이스 ID</div>
            <div>프로그램명</div>
            <div>내 역할</div>
            <div>상태</div>
            <div>최근 업데이트</div>
          </div>

          {/* 데이터 행 */}
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => navigate(`/workspaces/${ws.id}`)}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1.5fr 120px 120px 160px',
                padding: '10px 16px',
                fontSize: 13,
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
              }}
            >
              <div>{ws.id}</div>
              <div>{ws.programName || ws.title || '-'}</div>
              <div>{isAdmin ? '관리자' : ws.myRole || '-'}</div>
              <div>{ws.status || '-'}</div>
              <div>{formatDate(ws.updatedAt || ws.createdAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
