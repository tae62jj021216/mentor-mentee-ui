// src/api/authApi.js
/**
 * 로그인 API
 *  - POST /auth/login
 *  - body: { email, password }
 *  - 응답이 { data: {...} } 형태이든, 바로 {...} 이든 둘 다 대응
 */

const AUTH_BASE_URL = '/auth';

export const login = async (email, password) => {
  const url = `${AUTH_BASE_URL}/login`;

  console.log('[authApi] 로그인 요청 시작', url, { email });

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch (e) {
    console.error('[authApi] fetch 자체에서 에러 발생', e);
    throw e;
  }

  console.log('[authApi] 응답 도착, status =', res.status);

  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('[authApi] 로그인 응답 JSON 파싱 실패:', e, text);
      data = null;
    }
  }

  if (!res.ok) {
    const error = new Error('로그인 요청 실패');
    error.response = { status: res.status, data };
    throw error;
  }

  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }

  return data;
};
