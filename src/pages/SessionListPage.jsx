// src/pages/SessionListPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { fetchSessions } from '../api/sessionApi'

export default function SessionListPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 필터 상태
  const [statusFilter, setStatusFilter] = useState('') // '', '진행 중', '대기', '완료' 등
  const [keyword, setKeyword] = useState('')
  const [searchText, setSearchText] = useState('') // 인풋에 보이는 값

  // 최초 로딩
  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchSessions()
        setSessions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('세션 목록 로딩 실패:', err)
        const message =
          err?.response?.data?.message ||
          err.message ||
          '세션 목록을 불러오는 중 오류가 발생했습니다.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadSessions()
  }, [])

  // 검색 버튼 클릭 시 keyword 상태 반영
  const handleSearch = () => {
    setKeyword(searchText.trim())
  }

  // 상단 요약 카드용 통계
  const stats = useMemo(() => {
    const total = sessions.length

    // 상태 값은 DB/백엔드 ENUM과 한글 상태를 모두 고려해서 분류
    const plannedKeywords = ['PLANNED', '계획', '대기']
    const doneKeywords = ['DONE', '완료']
    const canceledKeywords = ['CANCELED', '취소']
    const inProgressKeywords = ['IN_PROGRESS', '진행 중']

    const matchStatus = (s, keywords) => {
      if (!s?.status) return false
      const raw = String(s.status).toUpperCase()
      return keywords.some((k) => raw.includes(k.toUpperCase()))
    }

    const planned = sessions.filter((s) => matchStatus(s, plannedKeywords)).length
    const done = sessions.filter((s) => matchStatus(s, doneKeywords)).length
    const canceled = sessions.filter((s) => matchStatus(s, canceledKeywords)).length
    const inProgress = sessions.filter((s) => matchStatus(s, inProgressKeywords)).length

    return { total, planned, done, canceled, inProgress }
  }, [sessions])

  // 필터/검색이 적용된 세션 목록
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // 상태 필터
      if (statusFilter && s.status !== statusFilter) {
        return false
      }

      // 키워드 필터 (멘토 이름, 멘티 이름, 주제)
      if (keyword) {
        const lower = keyword.toLowerCase()
        const mentor = (s.mentorName || '').toLowerCase()
        const mentee = (s.menteeName || '').toLowerCase()
        const topic = (s.topic || '').toLowerCase()
        const workspaceTitle = (s.workspaceTitle || s.workspace_name || '').toLowerCase()

        if (
          !mentor.includes(lower) &&
          !mentee.includes(lower) &&
          !topic.includes(lower) &&
          !workspaceTitle.includes(lower)
        ) {
          return false
        }
      }

      return true
    })
  }, [sessions, statusFilter, keyword])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* 페이지 타이틀 영역 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            marginBottom: '16px',
          }}
        >
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
            }}
          >
            상담/세션 관리
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
            }}
          >
            프로그램에 등록된 멘토-멘티 상담/세션 목록입니다. 세션 일정과 상태를 한 화면에서
            관리할 수 있습니다.
          </p>
        </div>

        {/* 상단 요약 카드 영역 (보고서 2.2.2 관리자 화면 느낌) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <SummaryCard label="전체 세션" value={stats.total} />
          <SummaryCard label="예정(PLANNED)" value={stats.planned} />
          <SummaryCard label="진행 중" value={stats.inProgress} />
          <SummaryCard label="완료 / 취소" value={stats.done + stats.canceled} />
        </div>

        {/* 필터 + 검색 영역 */}
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 6px rgba(15,23,42,0.06)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
            }}
          >
            <option value="">전체 상태</option>
            <option value="PLANNED">PLANNED (예정)</option>
            <option value="IN_PROGRESS">진행 중</option>
            <option value="DONE">DONE (완료)</option>
            <option value="CANCELED">CANCELED (취소)</option>
            {/* 필요하면 한글 상태도 추가 */}
            <option value="대기">대기</option>
            <option value="완료">완료</option>
            <option value="진행 중">진행 중</option>
          </select>

          <input
            type="text"
            placeholder="멘토/멘티 이름, 워크스페이스, 주제로 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            style={{
              flex: 1,
              minWidth: '0',
              padding: '9px 10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
            }}
          />

          <button
            type="button"
            onClick={handleSearch}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#111827',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            검색
          </button>
        </div>

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
            세션 목록을 불러오는 중입니다...
          </div>
        )}

        {/* 오류 상태 */}
        {!loading && error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
              fontSize: '14px',
            }}
          >
            세션 목록을 불러오지 못했습니다.
            <br />
            <span style={{ fontSize: '13px', color: '#991b1b' }}>{error}</span>
          </div>
        )}

        {/* 테이블 영역 */}
        {!loading && !error && (
          <div
            style={{
              marginTop: '8px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={thStyle}>멘토</th>
                  <th style={thStyle}>멘티</th>
                  <th style={thStyle}>주제</th>
                  <th style={thStyle}>상태</th>
                  <th style={thStyle}>일자</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'center',
                        color: '#9ca3af',
                        fontSize: '13px',
                      }}
                    >
                      조건에 맞는 세션이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id}>
                      <td style={tdStyle}>{session.mentorName || '-'}</td>
                      <td style={tdStyle}>{session.menteeName || '-'}</td>
                      <td style={tdStyle}>{session.topic || '-'}</td>
                      <td style={tdStyle}>
                        <StatusBadge status={session.status} />
                      </td>
                      <td style={tdStyle}>{session.date || '-'}</td>
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

function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <span style={{ fontSize: '12px', color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: '20px', fontWeight: 700 }}>{value}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  if (!status) {
    return <span style={{ fontSize: '13px', color: '#6b7280' }}>-</span>
  }

  const raw = String(status).toUpperCase()

  let bg = '#e5e7eb'
  let color = '#111827'
  let label = status

  if (raw.includes('PLANNED') || raw.includes('대기')) {
    bg = '#eff6ff'
    color = '#1d4ed8'
  } else if (raw.includes('IN_PROGRESS') || raw.includes('진행')) {
    bg = '#ecfdf3'
    color = '#15803d'
  } else if (raw.includes('DONE') || raw.includes('완료')) {
    bg = '#f0fdf4'
    color = '#166534'
  } else if (raw.includes('CANCELED') || raw.includes('취소')) {
    bg = '#fef2f2'
    color = '#b91c1c'
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: bg,
        color,
      }}
    >
      {label}
    </span>
  )
}

const thStyle = {
  padding: '10px 12px',
  fontSize: '13px',
  color: '#4b5563',
  textAlign: 'left',
  borderBottom: '1px solid #e5e7eb',
}

const tdStyle = {
  padding: '10px 12px',
  fontSize: '13px',
  color: '#111827',
  borderBottom: '1px solid #f3f4f6',
}
