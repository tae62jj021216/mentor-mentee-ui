// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react'

// 로그인 상태와 권한 정보를 전역에서 관리하기 위한 Context
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // user 예시 형태:
  // { username: '관리자', role: 'ADMIN' }
  // { username: '김멘토', role: 'MENTOR' }
  // { username: '박멘티', role: 'MENTEE' }

  // 간단한 로그인 함수 (나중에 백엔드 연동 시 이 안만 바꾸면 됨)
  const login = ({ username, role }) => {
    const newUser = { username, role }
    setUser(newUser)

    // 필요하면 나중에 여기에 localStorage 저장도 추가할 수 있음
    // localStorage.setItem('authUser', JSON.stringify(newUser))
  }

  // 로그아웃 함수
  const logout = () => {
    setUser(null)
    // localStorage.removeItem('authUser')
  }

  const value = {
    user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 편하게 쓰기 위한 커스텀 훅
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
