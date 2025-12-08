// src/api/httpClient.js

import { API_BASE_URL } from './config';

/**
 * 공통 HTTP 클라이언트
 *
 *  - path 예시:
 *      '/users'
 *      '/academic/majors'
 *      '/workspaces/admin'
 *    👉 절대 '/api/...' 를 넣지 않는다. ('/api' 는 API_BASE_URL 에서 붙여줌)
 *
 *  - options: fetch 옵션(메서드, 헤더, 바디 등)
 *  - 응답이 { success, data, message, ... } 형태인 경우 data 를 꺼내서 반환
 */
export default async function httpClient(path, options = {}) {
  // path 형식 보정
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  // 혹시 실수로 '/api/...' 를 넘긴 경우 자동으로 정정 + 경고 로그
  if (path.startsWith('/api/')) {
    console.warn(
      '[httpClient] path 에 "/api" 가 중복 포함되어 있습니다. 자동으로 제거합니다.',
      path,
    );
    path = path.replace(/^\/api/, '');
  }

  const token = localStorage.getItem('accessToken');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';

  const headers = {
    ...(options.headers || {}),
  };

  // FormData 가 아닐 때만 JSON Content-Type 기본 설정
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `${tokenType} ${token}`;
  }

  const url = `${API_BASE_URL}${path}`;

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (e) {
    console.error('[httpClient] fetch 에러', url, e);
    throw e;
  }

  const text = await res.text();
  let json = null;

  if (text) {
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error('[httpClient] JSON 파싱 실패', e, text);
      json = null;
    }
  }

  if (!res.ok) {
    const err = new Error('요청 실패');
    err.response = { status: res.status, data: json };
    throw err;
  }

  // ApiResponse<T> 형태({ data: ... })면 data 만 반환
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data;
  }

  return json;
}
