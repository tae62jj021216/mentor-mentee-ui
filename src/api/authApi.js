// src/api/authApi.js
export async function login(email, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  let json = null;

  // JSON 파싱 시도
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // JSON이 아니면 서버가 준 텍스트 그대로 에러로 던짐
      throw new Error(text || '서버 응답 형식이 올바르지 않습니다.');
    }
  }

  // HTTP 에러 또는 success=false 처리
  if (!res.ok || json?.success === false) {
    const msg =
      json?.message ||
      text ||
      '요청 처리 중 오류가 발생했습니다.';
    throw new Error(msg);
  }

  const accessToken = json?.data?.accessToken;
  if (!accessToken) {
    throw new Error('로그인 응답에 accessToken이 없습니다.');
  }

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('tokenType', json?.data?.tokenType || 'Bearer');

  return json;
}
