// src/pages/MenteeSessionsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MenteeSessionsPage = () => {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [onceAlerted, setOnceAlerted] = useState(false);

  // ─────────────────────────────────────
  // 공통: Authorization 헤더 생성
  // ─────────────────────────────────────
  const buildAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    if (!token) return {};
    return {
      Authorization: `${tokenType} ${token}`,
    };
  };

  // ─────────────────────────────────────
  // 워크스페이스 목록 + 첫 번째 세션 목록 로드
  // ─────────────────────────────────────
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/workspaces/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...buildAuthHeaders(),
          },
        });

        const text = await res.text();
        const json = text ? JSON.parse(text) : null;
        const data = json && typeof json === 'object' && 'data' in json ? json.data : json;

        if (!res.ok) {
          throw new Error(
            `워크스페이스 조회 실패 (status=${res.status}, message=${json?.message || ''})`,
          );
        }

        const list = Array.isArray(data) ? data : [];
        setWorkspaces(list);

        if (list.length > 0) {
          const firstId = list[0].id;
          setSelectedWorkspaceId(firstId);
          await fetchSessionsForWorkspace(firstId);
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error('[MenteeSessionsPage] /api/workspaces/me 로드 오류:', err);
        setErrorMessage('워크스페이스 정보를 불러오는 중 오류가 발생했습니다.');
        if (!onceAlerted) {
          alert('워크스페이스 정보를 불러오는 중 오류가 발생했습니다.');
          setOnceAlerted(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWorkspaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ─────────────────────────────────────
  // 특정 워크스페이스의 세션 목록 로드
  // ─────────────────────────────────────
  const fetchSessionsForWorkspace = async (workspaceId) => {
    if (!workspaceId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(),
        },
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;
      const data = json && typeof json === 'object' && 'data' in json ? json.data : json;

      if (!res.ok) {
        throw new Error(
          `세션 목록 조회 실패 (status=${res.status}, message=${json?.message || ''})`,
        );
      }

      const list = Array.isArray(data) ? data : [];
      setSessions(list);
      setErrorMessage('');
    } catch (err) {
      console.error(
        `[MenteeSessionsPage] /api/workspaces/${workspaceId}/sessions 로드 오류:`,
        err,
      );
      setSessions([]);
      setErrorMessage('세션 / 출석 정보를 불러오는 중 오류가 발생했습니다.');
      if (!onceAlerted) {
        alert('세션 / 출석 정보를 불러오는 중 오류가 발생했습니다.');
        setOnceAlerted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // 워크스페이스 선택 변경
  // ─────────────────────────────────────
  const handleWorkspaceChange = (e) => {
    const workspaceId = Number(e.target.value) || null;
    setSelectedWorkspaceId(workspaceId);
    if (workspaceId) {
      fetchSessionsForWorkspace(workspaceId);
    } else {
      setSessions([]);
    }
  };

  // ─────────────────────────────────────
  // 출석 통계 (현재 선택된 워크스페이스 기준)
  // ─────────────────────────────────────
  const attendanceSummary = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        rate: 0,
      };
    }

    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    sessions.forEach((s) => {
      const status =
        (s.myAttendanceStatus ||
          s.attendanceStatus ||
          s.attendance ||
          '').toUpperCase();

      if (status === 'PRESENT') present += 1;
      else if (status === 'ABSENT') absent += 1;
      else if (status === 'LATE') late += 1;
      else if (status === 'EXCUSED') excused += 1;
    });

    const total = sessions.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, excused, rate };
  }, [sessions]);

  // ─────────────────────────────────────
  // 보조 렌더링 함수
  // ─────────────────────────────────────
  const formatDateTime = (value) => {
    if (!value) return '-';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      const yyyy = d.getFullYear();
      const MM = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
    } catch {
      return String(value);
    }
  };

  const formatMode = (mode) => {
    if (!mode) return '-';
    const upper = String(mode).toUpperCase();
    if (upper === 'ONLINE') return '온라인';
    if (upper === 'OFFLINE') return '오프라인';
    if (upper === 'MIXED') return '온·오프라인 병행';
    return mode;
  };

  const renderAttendanceBadge = (statusRaw) => {
    if (!statusRaw) {
      return (
        <span
          style={{
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '11px',
            backgroundColor: '#e5e7eb',
            color: '#4b5563',
          }}
        >
          미기록
        </span>
      );
    }

    const status = String(statusRaw).toUpperCase();
    let label = status;
    let bg = '#e5e7eb';
    let color = '#4b5563';

    if (status === 'PRESENT') {
      label = '출석';
      bg = '#dcfce7';
      color = '#15803d';
    } else if (status === 'ABSENT') {
      label = '결석';
      bg = '#fee2e2';
      color = '#b91c1c';
    } else if (status === 'LATE') {
      label = '지각';
      bg = '#fef9c3';
      color = '#92400e';
    } else if (status === 'EXCUSED') {
      label = '공결';
      bg = '#e0f2fe';
      color = '#075985';
    }

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '9999px',
          fontSize: '11px',
          backgroundColor: bg,
          color,
        }}
      >
        {label}
      </span>
    );
  };

  // ─────────────────────────────────────
  // 렌더링
  // ─────────────────────────────────────
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        {/* 제목 영역 */}
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          세션 / 출석평가
        </h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
          참여 중인 워크스페이스의 세션 일정과 본인의 출석 현황을 한눈에 확인할 수 있는
          화면입니다.
        </p>

        {/* 워크스페이스 선택 + 요약 카드 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: '18px',
            marginBottom: '20px',
          }}
        >
          {/* 좌측: 워크스페이스 선택 박스 */}
          <section
            style={{
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '16px 18px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              워크스페이스 선택
            </div>
            <p
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '10px',
              }}
            >
              현재 참여 중인 멘토링/학습공동체 워크스페이스를 선택하면, 해당 워크스페이스의
              세션 일정과 출석 현황이 아래에 표시됩니다.
            </p>

            {workspaces.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                참여 중인 워크스페이스가 없습니다. 매칭이 완료된 후 자동으로 표시됩니다.
              </p>
            ) : (
              <select
                value={selectedWorkspaceId ?? ''}
                onChange={handleWorkspaceChange}
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '13px',
                }}
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.programName
                      ? `[${ws.programName}] ${ws.title || ws.name || `워크스페이스 #${ws.id}`}`
                      : ws.title || ws.name || `워크스페이스 #${ws.id}`}
                  </option>
                ))}
              </select>
            )}
          </section>

          {/* 우측: 출석 요약 카드 */}
          <section
            style={{
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '16px 18px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              출석 요약
            </div>
            <p
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '10px',
              }}
            >
              선택한 워크스페이스 기준으로 계산된 개인 출석 통계입니다.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: '#6b7280' }}>총 세션 수</span>
                <div style={{ fontWeight: 600 }}>{attendanceSummary.total}회</div>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>출석</span>
                <div style={{ fontWeight: 600 }}>{attendanceSummary.present}회</div>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>지각</span>
                <div style={{ fontWeight: 600 }}>{attendanceSummary.late}회</div>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>공결</span>
                <div style={{ fontWeight: 600 }}>{attendanceSummary.excused}회</div>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>결석</span>
                <div style={{ fontWeight: 600 }}>{attendanceSummary.absent}회</div>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>출석률</span>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>
                  {attendanceSummary.rate}%
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 세션 목록 테이블 */}
        <section
          style={{
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                세션 목록
              </h2>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                각 회차의 주제, 일정, 진행 방식과 함께 본인의 출석 상태를 확인할 수 있습니다.
              </p>
            </div>
          </div>

          {loading ? (
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              세션 / 출석 정보를 불러오는 중입니다...
            </p>
          ) : sessions.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              아직 등록된 세션이 없습니다. 멘토가 세션을 계획하면 이곳에 자동으로 표시됩니다.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '12px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      주차
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      주제
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      일정
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      진행 방식
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      상태
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      출석
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => {
                    const attendanceRaw =
                      s.myAttendanceStatus || s.attendanceStatus || s.attendance;

                    const statusLabel =
                      s.status === 'PLANNED'
                        ? '예정'
                        : s.status === 'DONE'
                        ? '완료'
                        : s.status === 'CANCELED'
                        ? '취소'
                        : s.status || '-';

                    return (
                      <tr
                        key={s.id}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                        }}
                      >
                        <td style={{ padding: '8px' }}>
                          {s.weekIndex != null ? `${s.weekIndex}주차` : '-'}
                        </td>
                        <td style={{ padding: '8px' }}>
                          {s.topic || s.title || '(제목 미입력)'}
                        </td>
                        <td style={{ padding: '8px' }}>
                          {formatDateTime(s.scheduledAt || s.startAt)}
                        </td>
                        <td style={{ padding: '8px' }}>{formatMode(s.mode)}</td>
                        <td style={{ padding: '8px' }}>{statusLabel}</td>
                        <td style={{ padding: '8px' }}>
                          {renderAttendanceBadge(attendanceRaw)}
                        </td>
                        <td style={{ padding: '8px', color: '#6b7280' }}>
                          {s.note || s.comment || ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                fontSize: '12px',
              }}
            >
              {errorMessage}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MenteeSessionsPage;
