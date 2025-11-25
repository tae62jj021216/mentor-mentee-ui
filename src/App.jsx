// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MentorListPage from './pages/MentorListPage'
import MenteeListPage from './pages/MenteeListPage'
import SessionListPage from './pages/SessionListPage'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 메인 레이아웃 안에 관리자/멘토/멘티용 페이지들 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mentors" element={<MentorListPage />} />
        <Route path="/mentees" element={<MenteeListPage />} />
        <Route path="/sessions" element={<SessionListPage />} />
        <Route path="/mentee-dashboard" element={<MenteeListPage />} />
      </Route>

      {/* 그 외 주소 → 로그인으로 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
