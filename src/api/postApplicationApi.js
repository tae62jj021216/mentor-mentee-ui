// src/api/postApplicationApi.js
import { API_BASE_URL } from './config';

// 공통: 토큰 헤더 생성
const buildAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';

  if (!token) return {};
  return {
    Authorization: `${tokenType} ${token}`,
  };
};

// 공통: GET 호출
const apiGet = async (path, params = {}) => {
  const url = new URL(API_BASE_URL + path, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const error = new Error('API GET error');
    error.response = { status: res.status, data };
    throw error;
  }

  // ApiResponse 래핑/비래핑 모두 대응
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
};

// 공통: POST 호출
const apiPost = async (path, body) => {
  const url = new URL(API_BASE_URL + path, window.location.origin);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(),
    },
    body: JSON.stringify(body ?? {}),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const error = new Error('API POST error');
    error.response = { status: res.status, data };
    throw error;
  }

  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
};

/**
 * 1) 멘티/멘토가 특정 게시글에 신청 생성
 *    POST /api/post-applications
 *    body: { postId: number }
 */
export const createPostApplication = async (postId) => {
  return apiPost('/posts-applications', { postId });
};

/**
 * 2) 내가 보낸 신청 목록
 *    GET /api/post-applications/me/sent
 */
export const fetchMySentApplications = async () => {
  const list = await apiGet('/post-applications/me/sent');
  return Array.isArray(list) ? list : [];
};

/**
 * 3) 내가 받은 신청 목록
 *    GET /api/post-applications/me/received
 */
export const fetchMyReceivedApplications = async () => {
  const list = await apiGet('/post-applications/me/received');
  return Array.isArray(list) ? list : [];
};

/**
 * 4) 신청 수락
 *    POST /api/post-applications/{applicationId}/accept
 */
export const acceptPostApplication = async (applicationId) => {
  return apiPost(`/post-applications/${applicationId}/accept`);
};

/**
 * 5) 신청 거절
 *    POST /api/post-applications/{applicationId}/reject
 */
export const rejectPostApplication = async (applicationId) => {
  return apiPost(`/post-applications/${applicationId}/reject`);
};
