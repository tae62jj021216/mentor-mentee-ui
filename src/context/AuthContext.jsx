// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

// accessToken(JWT)에서 payload를 파싱하는 유틸 함수
function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    // atob 로 Base64 디코딩 후 JSON 파싱
    const payload = JSON.parse(atob(base64Payload));

    // 예시 payload: { sub: 이메일, uid: 1, role: 'ADMIN', ... }
    return {
      username: payload.sub,   // 이메일
      role: payload.role,      // ADMIN / MENTOR / MENTEE
      uid: payload.uid,
    };
  } catch (e) {
    console.error('[AuthContext] JWT 파싱 실패:', e);
    return null;
  }
}

// 로그인 상태와 권한 정보를 전역에서 관리하기 위한 Context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 앱 시작 시 localStorage 에 저장된 accessToken 이 있으면 바로 user 상태 복원
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) return null;

    const parsed = parseJwt(storedToken);
    if (!parsed) return null;

    return parsed; // { username, role, uid }
  });

  /**
   * 로그인 시 호출하는 함수
   * - accessToken 을 인자로 받거나
   * - 인자가 없으면 localStorage 에서 accessToken 을 읽어 user 상태만 갱신
   */
  const login = (accessToken) => {
    const token = accessToken || localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      return;
    }

    const parsed = parseJwt(token);
    if (!parsed) {
      setUser(null);
      return;
    }

    setUser(parsed);
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 편하게 쓰기 위한 커스텀 훅
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}
