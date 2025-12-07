// src/api/academicApi.js
import { API_BASE_URL } from './config';

/**
 * 로그인 토큰을 Authorization 헤더에 실어 보내기
 */
const buildAuthHeaders = () => {
  const headers = {};

  // 로그인 시 저장해 둔 토큰 키 이름에 맞게 (현재 구조에 맞춤)
  const token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken');

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * 백엔드 공통 응답 { success, data, message, errorCode } 처리
 */
const parseJson = async (res) => {
  const text = await res.text();

  if (!res.ok) {
    console.error('[academicApi] Academic API 오류', {
      url: res.url,
      status: res.status,
      body: text,
    });
    throw new Error('Academic API 호출에 실패했습니다.');
  }

  const body = text ? JSON.parse(text) : {};
  // { success, data, ... } 형식이면 data, 아니면 전체 body 반환
  return body.data ?? body;
};

/**
 * 여기 핵심: 문서 기준 경로
 *   외부: GET /api/academic/programs
 *   내부(스프링): /academic/programs  로 들어감
 */
const BASE_URL = `${API_BASE_URL}/academic`; // => '/api/academic'

/**
 * 프로그램 목록 조회
 *  - GET /api/academic/programs
 */
export const fetchPrograms = async () => {
  const res = await fetch(`${BASE_URL}/programs`, {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
    credentials: 'include', // 세션 쿠키도 같이 보냄
  });

  return parseJson(res);
};

const academicApi = {
  fetchPrograms,
};

export default academicApi;
