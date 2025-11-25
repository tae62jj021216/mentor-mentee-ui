// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MentorListPage from './pages/MentorListPage'
import MenteeListPage from './pages/MenteeListPage.jsx'
import SessionListPage from './pages/SessionListPage.jsx'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <Routes>
      {/* 기본 홈 화면 */}
      <Route
        path="/"
        element={
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                textAlign: 'center',
                width: '420px',
              }}
            >
              <h1 style={{ marginBottom: '16px' }}>멘토·멘티 관리 시스템</h1>
              <p style={{ marginBottom: '8px' }}>
                이 화면은 React로 만든 <strong>UI 초기 화면</strong>입니다.
              </p>
              <p>
                앞으로 여기에서 로그인 화면, 대시보드, 멘토/멘티 목록 같은
                실제 페이지들을 하나씩 추가해 갈 거예요.
              </p>
            </div>
          </div>
        }
      />

      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 메인 레이아웃 적용되는 페이지 */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mentors" element={<MentorListPage />} />
        <Route path="/mentees" element={<MenteeListPage />} />
        <Route path="/sessions" element={<SessionListPage />} />
      </Route>
    </Routes>
  )
}

export default App
