// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MentorListPage from './pages/MentorListPage';
import MenteeListPage from './pages/MenteeListPage';
import SessionListPage from './pages/SessionListPage';
import WorkspaceListPage from './pages/WorkspaceListPage';
import WorkspaceDetailPage from './pages/WorkspaceDetailPage';
import MenteeDashboard from './pages/MenteeDashboard';  // 🔹 새로 추가
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 메인 레이아웃 안에 전체 페이지 포함 */}
      <Route element={<MainLayout />}>
        {/* 기본 경로: dashboard 로 이동 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 로그인 사용자만 접근 가능 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 목록/관리 페이지 */}
        <Route path="/mentors" element={<MentorListPage />} />
        <Route path="/mentees" element={<MenteeListPage />} />
        <Route path="/sessions" element={<SessionListPage />} />
        <Route path="/workspaces" element={<WorkspaceListPage />} />
        <Route
          path="/workspaces/:workspaceId"
          element={<WorkspaceDetailPage />}
        />

        {/* 멘티 전용 대시보드: 오직 MENTEE 만 */}
        <Route
          path="/mentee-dashboard"
          element={
            <ProtectedRoute allowedRoles={['MENTEE']}>
              <MenteeDashboard />   {/* 🔹 여기 반영됨 */}
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 그 외 경로는 모두 로그인으로 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
