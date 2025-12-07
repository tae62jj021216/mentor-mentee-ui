// src/pages/WorkspaceDetailPage.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchWorkspaceDetail } from '../api/workspaceApi'
import { useAuth } from '../context/AuthContext';

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ✅ 목록으로 버튼 클릭 시 동작
  const handleGoBack = () => {
    if (user?.role === 'ADMIN') {
      // 관리자 → 관리자 워크스페이스 관리 페이지
      navigate('/workspaces')
    } else {
      // 멘토/멘티 → 본인 워크스페이스 목록
      navigate('/workspaces')
    }
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await fetchWorkspaceDetail(workspaceId)
        setWorkspace(data)
      } catch (e) {
        console.error('fetchWorkspaceDetail error:', e)
        setError('워크스페이스 정보를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId) {
      load()
    }
  }, [workspaceId])

  const w = workspace

  return (
    <div style={{ padding: '24px 32px' }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        워크스페이스 상세
        {w && (
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              marginLeft: 8,
              color: '#6b7280',
            }}
          >
            ID: {w.id}
          </span>
        )}
      </h2>

      <p
        style={{
          fontSize: 13,
          color: '#6b7280',
          marginBottom: 16,
        }}
      >
        선택한 워크스페이스의 기본 정보와 구성원, 연락처 정보를 확인할 수 있는 화면입니다.
      </p>

      {/* ✅ 여기 onClick만 handleGoBack으로 변경 */}
      <button
        type="button"
        onClick={handleGoBack}
        style={{
          padding: '6px 12px',
          borderRadius: 9999,
          border: '1px solid #d1d5db',
          backgroundColor: '#f9fafb',
          fontSize: 13,
          marginBottom: 18,
          cursor: 'pointer',
        }}
      >
        ← 목록으로
      </button>

      {loading && (
        <div style={{ fontSize: 13, color: '#6b7280' }}>불러오는 중입니다…</div>
      )}

      {error && !loading && (
        <div
          style={{
            marginTop: 8,
            marginBottom: 16,
            padding: '10px 12px',
            borderRadius: 10,
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.2fr)',
            gap: 16,
          }}
        >
          {/* 기본 정보 카드 */}
          <section
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '18px 20px',
              boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              기본 정보
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px minmax(0, 1fr)',
                rowGap: 6,
                columnGap: 8,
                fontSize: 13,
              }}
            >
              <div style={{ color: '#6b7280' }}>프로그램</div>
              <div>{w?.programName || '-'}</div>

              <div style={{ color: '#6b7280' }}>제목</div>
              <div>{w?.title || '-'}</div>

              <div style={{ color: '#6b7280' }}>상태</div>
              <div>{w?.status || '-'}</div>

              <div style={{ color: '#6b7280' }}>시작일</div>
              <div>{w?.startDate || '-'}</div>

              <div style={{ color: '#6b7280' }}>종료일</div>
              <div>{w?.endDate || '-'}</div>
            </div>

            <div style={{ marginTop: 14, fontSize: 13, color: '#6b7280' }}>
              설명
            </div>
            <div
              style={{
                marginTop: 6,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                fontSize: 13,
                minHeight: 60,
                whiteSpace: 'pre-wrap',
              }}
            >
              {w?.description && w.description.trim().length > 0
                ? w.description
                : '설명이 등록되어 있지 않습니다.'}
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: '#9ca3af',
              }}
            >
              생성일: {w?.createdAt || '-'}
            </div>
          </section>

          {/* 구성원 카드 */}
          <section
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: '18px 20px',
              boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              구성원
            </h3>
            <p
              style={{
                fontSize: 13,
                color: '#6b7280',
                marginBottom: 12,
              }}
            >
              워크스페이스에 참여 중인 멘토·멘티의 역할과 연락처 정보를 확인할 수 있습니다.
            </p>

            {!w?.members || w.members.length === 0 ? (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                  color: '#6b7280',
                }}
              >
                등록된 구성원이 없습니다.
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  maxHeight: 280,
                  overflowY: 'auto',
                }}
              >
                {w.members.map((m) => (
                  <div
                    key={m.userId}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb',
                      fontSize: 13,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                      <span
                        style={{
                          fontSize: 12,
                          padding: '2px 8px',
                          borderRadius: 9999,
                          backgroundColor:
                            m.role === 'MENTOR' ? '#eff6ff' : '#fef3c7',
                          color:
                            m.role === 'MENTOR' ? '#1d4ed8' : '#92400e',
                        }}
                      >
                        {m.role === 'MENTOR' ? '멘토' : '멘티'}
                      </span>
                    </div>

                    {m.contacts && m.contacts.length > 0 ? (
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: 16,
                          fontSize: 12,
                          color: '#4b5563',
                        }}
                      >
                        {m.contacts.map((c, idx) => (
                          <li key={idx}>
                            {c.type}: {c.value}
                            {c.primary && ' (기본)'}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div
                        style={{
                          fontSize: 12,
                          color: '#9ca3af',
                        }}
                      >
                        등록된 연락처가 없습니다.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
