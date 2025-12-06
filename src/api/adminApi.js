// src/api/adminApi.js
import { API_BASE_URL } from './config';

const buildAuthHeaders = () => {
  const headers = {};

  // 로그인 시 저장해 둔 토큰 키 이름에 맞게 수정해 주세요.
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const parseJson = async (res) => {
  const text = await res.text();

  if (!res.ok) {
    console.error('[adminApi] 대시보드 API 오류', {
      url: res.url,
      status: res.status,
      body: text,
    });
    throw new Error(`관리자 대시보드 API 호출에 실패했습니다.`);
  }

  const body = text ? JSON.parse(text) : {};
  return body.data ?? body;
};

export const fetchAdminDashboardSummary = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
    credentials: 'include', // 세션 쿠키도 함께 보냄
  });

  return parseJson(res);
};

export const fetchAdminDashboardKpi = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard/kpi`, {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
    credentials: 'include',
  });

  return parseJson(res);
};
