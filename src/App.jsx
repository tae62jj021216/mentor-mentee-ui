// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

import AdminDashboard from './pages/AdminDashboard';
import MentorListPage from './pages/MentorListPage';
import MenteeListPage from './pages/MenteeListPage';
import SessionListPage from './pages/SessionListPage';
import WorkspaceListPage from './pages/WorkspaceListPage';
import WorkspaceDetailPage from './pages/WorkspaceDetailPage';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// 이미 만들어 둔 파일들
import MenteeDashboard from './pages/MenteeDashboard';
import MentorDashboard from './pages/MentorDashboard';

// 멘티 전용 새 페이지들
import MenteeMentorSearchPage from './pages/MenteeMentorSearchPage';
import MenteeMatchingPage from './pages/MenteeMatchingPage';
import MenteeSessionsPage from './pages/MenteeSessionsPage';

// 멘토 가능 시간 페이지
import MentorAvailabilityPage from './pages/MentorAvailabilityPage';

function App() {
  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 레이아웃 내 보호된 라우트 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 관리자/멘토 공용 대시보드 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 관리자/멘토 공용 */}
        <Route
          path="/mentors"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MentorListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentees"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR']}>
              <MenteeListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR']}>
              <SessionListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspaces"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR']}>
              <WorkspaceListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspaces/:workspaceId"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR']}>
              <WorkspaceDetailPage />
            </ProtectedRoute>
          }
        />

        {/* 멘티 전용 페이지 */}
        <Route
          path="/mentee-dashboard"
          element={
            <ProtectedRoute allowedRoles={['MENTEE']}>
              <MenteeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentee-mentor-search"
          element={
            <ProtectedRoute allowedRoles={['MENTEE']}>
              <MenteeMentorSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentee-profile"
          element={
            <ProtectedRoute allowedRoles={['MENTEE']}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor-availability"
          element={
            <ProtectedRoute allowedRoles={['MENTEE']}>
              <MentorAvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentee-matching"
          element={
            <ProtectedRoute allowedRoles={['MENTEE']}>
              <MenteeMatchingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentee-sessions"
          element={
            <ProtectedRoute allowedRoles={['MENTEE']}>
              <MenteeSessionsPage />
            </ProtectedRoute>
          }
        />

        {/* 멘토 전용 */}
        <Route
          path="/mentor/availability"
          element={
            <ProtectedRoute allowedRoles={['MENTOR']}>
              <MentorAvailabilityPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 나머지는 로그인으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
