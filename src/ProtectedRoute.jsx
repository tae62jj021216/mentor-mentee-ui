// src/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

/**
 * 인증 + 선택적 역할 기반 접근 제어용 Protected Route
 *
 * 사용 예시:
 * <ProtectedRoute>
 *    <Dashboard />
 * </ProtectedRoute>
 *
 * <ProtectedRoute allowedRoles={['ADMIN']}>
 *    <AdminDashboard />
 * </ProtectedRoute>
 *
 * <ProtectedRoute allowedRoles={['MENTOR', 'ADMIN']}>
 *    <MentorWorkspace />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  /**
   * 1) 로그인 여부 체크
   * user 는 AuthContext에서 JWT 파싱 후 생성되므로
   * user === null 이면 로그인 상태가 아님.
   */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /**
   * 2) 역할(권한) 체크
   * allowedRoles 배열이 있을 때만 검사.
   *
   * 예:
   * allowedRoles=['ADMIN']
   * allowedRoles=['MENTOR','ADMIN']
   */
  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // 권한 없음 → 일단 dashboard 등으로 돌려보낸다.
      return <Navigate to="/dashboard" replace />;
      // 필요하면:
      // return <Navigate to="/403" replace />;
    }
  }

  /**
   * 3) 모두 통과 → 실제 페이지 출력
   */
  return children;
}
