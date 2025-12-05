// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth(); // AuthContext 의 login 함수

  const [loginId, setLoginId] = useState('');   // 아이디(=이메일)
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      // 🔐 로그인 요청 (authApi.js의 login 사용)
      const res = await loginApi(loginId, password);

      // authApi 가 이미 localStorage 에 accessToken 을 저장해 둠
      const accessToken = res?.data?.accessToken;

      // 🔐 AuthContext 에도 로그인 상태 반영 (JWT 파싱 → user 세팅)
      setAuthUser(accessToken);

      // 🔐 로그인 성공 시 대시보드로 이동
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('[LoginPage] 로그인 실패:', err);
      setError(err.message || '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(15,23,42,0.12)',
          padding: '32px 28px',
        }}
      >
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          멘토·멘티 시스템 로그인
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}
        >
          관리자, 멘토, 멘티 계정으로 로그인하여 멘토링 프로그램을 관리할 수 있습니다.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="loginId"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              아이디(이메일)
            </label>
            <input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoComplete="email"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: '16px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '4px',
              padding: '10px 0',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: loading ? '#6b7280' : '#111827',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
