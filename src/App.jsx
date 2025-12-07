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

// 멘티 프로필 페이지 (파일명 변경 완료)
import MenteeProfilePage from './pages/MenteeProfilePage';

// 멘티 전용 페이지들
import MenteeMentorSearchPage from './pages/MenteeMentorSearchPage';
import MenteeMatchingPage from './pages/MenteeMatchingPage';
import MenteeSessionsPage from './pages/MenteeSessionsPage';

// 멘토 가능 시간 페이지
import MentorAvailabilityPage from './pages/MentorAvailabilityPage';

// 학사 관리(ADMIN 전용)
import AdminAcademicPage from './pages/AdminAcademicPage';

// 게시판
import PostListPage from './pages/PostListPage';
import PostFormPage from './pages/PostFormPage';

function App() {
  return (
    <Routes>
      {/* 로그인 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 보호된 라우트(레이아웃 포함) */}
      <Route element={<MainLayout />}>
        {/* 기본 경로 → 관리자/멘토 대시보드로 이동 */}
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

        {/* 🔹 ADMIN 전용 학사 관리 */}
        <Route
          path="/admin-academic"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAcademicPage />
            </ProtectedRoute>
          }
        />

        {/* 관리자/멘토 권한 */}
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
            <ProtectedRoute allowedRoles={['ADMIN']}>
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

        {/* 🔹 멘티 전용 */}
        <Route
          path="/mentee-profile"
          element={
            <ProtectedRoute allowedRoles={['MENTEE']}>
              <MenteeProfilePage />
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

        {/* 🔹 멘토 전용 */}
        <Route
          path="/mentor/availability"
          element={
            <ProtectedRoute allowedRoles={['MENTOR']}>
              <MentorAvailabilityPage />
            </ProtectedRoute>
          }
        />

        {/* 🔹 게시판 (전체 조회 가능) */}
        <Route
          path="/posts"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR', 'MENTEE']}>
              <PostListPage />
            </ProtectedRoute>
          }
        />

        {/* 게시글 작성/수정 — 멘토/멘티만 */}
        <Route
          path="/posts/new"
          element={
            <ProtectedRoute allowedRoles={['MENTOR', 'MENTEE']}>
              <PostFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:postId/edit"
          element={
            <ProtectedRoute allowedRoles={['MENTOR', 'MENTEE']}>
              <PostFormPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 기타 → 로그인으로 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
