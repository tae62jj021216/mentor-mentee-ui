// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('ADMIN') // 기본 선택: 관리자
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      alert('아이디와 비밀번호를 입력하세요.')
      return
    }

    // (임시) 로그인 성공 처리
    login({ username, role })

    // 역할별 리다이렉트
    let redirectPath = '/dashboard'   // 관리자 기본 대시보드로 보냄

    if (role === 'MENTOR') {
      redirectPath = '/mentors'
    } else if (role === 'MENTEE') {
      redirectPath = '/mentee-dashboard'
    }

    navigate(redirectPath, { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px 28px',
          boxShadow: '0 10px 30px rgba(15,23,42,0.15)',
        }}
      >
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          멘토·멘티 관리 시스템
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          역할을 선택하고 로그인하여 시스템을 이용하세요.
        </p>

        <form onSubmit={handleSubmit}>
          {/* 아이디 */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                marginBottom: '4px',
              }}
            >
              아이디
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디 입력"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 비밀번호 */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                marginBottom: '4px',
              }}
            >
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 역할 선택 */}
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                marginBottom: '6px',
              }}
            >
              역할 선택
            </label>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                fontSize: '14px',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === 'ADMIN'}
                  onChange={(e) => setRole(e.target.value)}
                />
                관리자
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="radio"
                  name="role"
                  value="MENTOR"
                  checked={role === 'MENTOR'}
                  onChange={(e) => setRole(e.target.value)}
                />
                멘토
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="radio"
                  name="role"
                  value="MENTEE"
                  checked={role === 'MENTEE'}
                  onChange={(e) => setRole(e.target.value)}
                />
                멘티
              </label>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#111827',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}
