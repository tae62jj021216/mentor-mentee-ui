// src/api/profileApi.js
import httpClient from './httpClient';

/**
 * 내 프로필 조회
 *  - GET /api/profile/me
 *  - 백엔드가 ApiResponse<T> 형태를 쓰면 { success, data } 구조일 수 있으므로 둘 다 대응
 */
export async function fetchMyProfile() {
  const res = await httpClient('/api/profile/me', {
    method: 'GET',
  });

  const raw = res?.data ?? res ?? {};

  // tags가 문자열로 올 수도 있고, 배열로 올 수도 있으니 방어적으로 처리
  let tags = [];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags;
  } else if (typeof raw.tags === 'string') {
    tags = raw.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  return {
    name: raw.name ?? '',
    major: raw.major ?? '',
    grade: raw.grade ?? '',
    tags,
  };
}

/**
 * 내 프로필 수정
 *  - PUT /api/profile/me
 *  - payload: { name, major, grade, tags }
 */
export async function updateMyProfile(payload) {
  const body = {
    name: payload.name ?? '',
    major: payload.major ?? '',
    grade: payload.grade ?? '',
    tags: payload.tags ?? [],
  };

  const res = await httpClient('/api/profile/me', {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  // ApiResponse 래핑 여부에 따라 둘 다 대응
  return res?.data ?? res;
}
