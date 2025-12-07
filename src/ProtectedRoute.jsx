// src/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

/**
 * 인증 + 선택적 역할 기반 접근 제어용 Protected Route
 *
 * 사용 예시:
 *  <ProtectedRoute>
 *    <Dashboard />
 *  </ProtectedRoute>
 *
 *  <ProtectedRoute allowedRoles={['ADMIN']}>
 *    <AdminDashboard />
 *  </ProtectedRoute>
 *
 *  <ProtectedRoute allowedRoles={['MENTOR', 'ADMIN']}>
 *    <MentorWorkspace />
 *  </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // 1) 로그인 여부 체크: 로그인 안 되어 있으면 /login 으로
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2) 역할(권한) 체크: allowedRoles 가 주어진 경우에만 검사
  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // ❌ 권한 없음 → 이제는 /dashboard 로 리다이렉트하지 않고,
      //    현재 영역에 안내 문구만 출력
      let message = '이 메뉴에 접근할 권한이 없습니다.';

      if (allowedRoles.length === 1) {
        if (allowedRoles[0] === 'ADMIN') {
          message = '이 메뉴는 관리자 전용입니다.';
        } else if (allowedRoles[0] === 'MENTOR') {
          message = '이 메뉴는 멘토 전용입니다.';
        } else if (allowedRoles[0] === 'MENTEE') {
          message = '이 메뉴는 멘티 전용입니다.';
        }
      }

      return (
        <div style={{ padding: '24px', color: '#4b5563' }}>
          {message}
        </div>
      );
    }
  }

  // 3) 모두 통과 → 실제 페이지 렌더링
  return children;
}
