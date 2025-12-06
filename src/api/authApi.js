// src/api/authApi.js
import { API_BASE_URL } from './config';

/**
 * 로그인 API
 *  - POST /auth/login
 *  - body: { email, password }
 *  - 응답이 { data: {...} } 형태이든, 바로 {...} 이든 둘 다 대응
 */
export const login = async (email, password) => {
  console.log(
    '[authApi] 로그인 요청 시작',
    `${API_BASE_URL}/auth/login`,
    { email }
  );

  let res;
  try {
    res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,    // 백엔드가 email 필드를 기대
        password, // 백엔드가 password 필드를 기대
      }),
    });
  } catch (e) {
    console.error('[authApi] fetch 자체에서 에러 발생', e);
    throw e;
  }

  console.log('[authApi] 응답 도착, status =', res.status);

  // 응답 바디가 비어 있을 수도 있으니 text로 먼저 읽고 나서 파싱
  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // JSON 파싱 실패해도 전체 앱이 죽지 않도록 방어
      console.error('[authApi] 로그인 응답 JSON 파싱 실패:', e, text);
      data = null;
    }
  }

  if (!res.ok) {
    // 4xx, 5xx 모두 여기로 들어옴
    const error = new Error('로그인 요청 실패');
    error.response = { status: res.status, data };
    throw error;
  }

  // 백엔드가 ApiResponse<T> 형태({ data: {...} })로 감싸서 주는 경우
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }

  // 아니면 그대로 반환
  return data;
};
