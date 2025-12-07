// src/pages/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminDashboardSummary,
  fetchAdminDashboardKpi,
} from '../api/adminApi';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // 로그인 정보가 아직 없을 때
  if (!user) {
    return <div>로그인 정보를 확인하는 중입니다...</div>;
  }

  const isAdmin = user.role === 'ADMIN';

  const [summary, setSummary] = useState(null);
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 관리자가 아니면 관리자 대시보드 API를 호출하지 않음
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryData, kpiData] = await Promise.all([
          fetchAdminDashboardSummary(),
          fetchAdminDashboardKpi(),
        ]);

        setSummary(summaryData);
        setKpi(kpiData);
      } catch (e) {
        console.error('[AdminDashboard] 대시보드 데이터 로딩 실패', e);
        setError(e.message ?? '대시보드 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAdmin]);

  // 관리자 계정이 아니면 안내 문구만 표시
  if (!isAdmin) {
    return (
      <div style={{ padding: '24px', color: '#4b5563' }}>
        이 페이지는 <strong>관리자 전용 대시보드</strong>입니다.
        <br />
        멘토와 멘티는 왼쪽 메뉴에서 프로필, 멘토 찾기, 매칭/요청, 세션/출석평가,
        멘토링 게시판 기능을 이용하세요.
      </div>
    );
  }

  if (loading) {
    return <div>대시보드 데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>대시보드 로딩 오류: {error}</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>관리자 대시보드</h2>
      <p style={{ marginBottom: '24px', color: '#6b7280' }}>
        전체 멘토·멘티 현황과 세션 진행 상황, 핵심 KPI 지표를 한눈에 확인할 수 있는
        화면입니다.
      </p>

      {/* 상단 기본 통계 카드들 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <StatCard title="전체 사용자 수" value={summary.totalUsers} />
        <StatCard title="전체 게시글 수" value={summary.totalPosts} />
        <StatCard title="전체 워크스페이스 수" value={summary.totalWorkspaces} />
        <StatCard title="전체 세션 수" value={summary.totalSessions} />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <StatCard title="전체 과제 수" value={summary.totalAssignments} />
        <StatCard title="전체 제출 수" value={summary.totalSubmissions} />
        <StatCard title="전체 피드백 수" value={summary.totalFeedbacks} />
      </div>

      {/* KPI 카드들 */}
      <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>핵심 KPI</h3>
      <div style={{ display: 'flex', gap: '16px' }}>
        <StatCard
          title="매칭 성공률"
          value={`${kpi.matchingSuccessRate.toFixed(1)} %`}
        />
        <StatCard
          title="세션 완료율"
          value={`${kpi.sessionCompletionRate.toFixed(1)} %`}
        />
        <StatCard
          title="과제 제출률"
          value={`${kpi.assignmentSubmissionRate.toFixed(1)} %`}
        />
        <StatCard
          title="평균 출석률"
          value={`${kpi.averageAttendanceRate.toFixed(1)} %`}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 600 }}>{value}</div>
    </div>
  );
}
