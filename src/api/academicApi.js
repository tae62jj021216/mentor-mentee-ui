// src/api/academicApi.js

import { API_BASE_URL } from './config';

/**
 * 인증 헤더 생성
 */
const buildAuthHeaders = () => {
  const headers = {};
  const token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken');

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * 공통 JSON 파서
 * - 응답이 { data: ... } 형태든, 바로 {...} 이든 둘 다 대응
 */
const parseJson = async (res) => {
  const text = await res.text();

  if (!res.ok) {
    console.error('[academicApi] Academic API error', {
      url: res.url,
      status: res.status,
      body: text,
    });
    throw new Error('Academic API 호출 실패');
  }

  const body = text ? JSON.parse(text) : {};
  return body.data ?? body;
};

const BASE_URL = `${API_BASE_URL}/academic`;

/* ------------------------- 프로그램(Program) ------------------------- */

export const fetchPrograms = async () => {
  const res = await fetch(`${BASE_URL}/programs`, {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
    credentials: 'include',
  });

  return parseJson(res);
};

/* --------------------------- 전공(Major) ---------------------------- */

export const fetchMajors = async () => {
  const res = await fetch(`${BASE_URL}/majors`, {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
    credentials: 'include',
  });

  return parseJson(res);
};

/* --------------------------- 학기(Semester) ------------------------- */

/**
 * 학기 목록 조회
 *  - GET /api/academic/semesters?activeOnly=true|false
 *  - activeOnly: true 이면 활성 학기만, false 이면 전체
 */
export const fetchSemesters = async (activeOnly = false) => {
  const res = await fetch(
    `${BASE_URL}/semesters?activeOnly=${activeOnly}`,
    {
      method: 'GET',
      headers: {
        ...buildAuthHeaders(),
      },
      credentials: 'include',
    },
  );

  return parseJson(res);
};

/**
 * 새 학기 생성
 *  - POST /api/academic/semesters
 *  - body: { name, startDate, endDate, isActive }
 */
export const createSemester = async (semester) => {
  const res = await fetch(`${BASE_URL}/semesters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(semester),
  });

  return parseJson(res);
};

/* ------------------------------------------------------------------- */

const academicApi = {
  fetchPrograms,
  fetchMajors,
  fetchSemesters,
  createSemester,
};

export default academicApi;
