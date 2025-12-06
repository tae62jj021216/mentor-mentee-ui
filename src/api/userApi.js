// src/api/userApi.js
import httpClient from './httpClient';

/**
 * 내 태그 목록 조회
 * GET /api/users/me/tags
 * 예상 응답: [{ name: 'Java', type: 'WANT_TO_LEARN', level: 3 }, ...]
 */
export const fetchMyTags = async () => {
  const res = await httpClient.get('/users/me/tags');
  return res.data;
};

/**
 * 내 태그 목록 저장(전체 교체)
 * PUT /api/users/me/tags
 * body 예: [{ name, type, level }, ...]
 */
export const updateMyTags = async (tags) => {
  const res = await httpClient.put('/users/me/tags', tags);
  return res.data;
};

/**
 * 내 가용 시간 조회
 * GET /api/users/me/availability
 * 예상 응답: [{ dayOfWeek: 'MONDAY', startTime: '18:00', endTime: '21:00' }, ...]
 *
 * ✅ 백엔드가 404를 반환하는 경우(아직 등록된 가용 시간이 없음)는
 *    "에러"가 아니라 "빈 배열"로 처리한다.
 */
export const fetchMyAvailability = async () => {
  try {
    const res = await httpClient.get('/users/me/availability');
    return res.data;
  } catch (error) {
    const status = error?.response?.status;

    if (status === 404) {
      // 아직 한 번도 가용 시간을 등록하지 않은 사용자
      console.warn(
        '[userApi] /users/me/availability 404 응답 → 빈 목록으로 처리합니다.',
      );
      return [];
    }

    // 그 외(500, 401 등)는 그대로 던져서 페이지에서 처리
    throw error;
  }
};

/**
 * 내 가용 시간 저장(전체 교체)
 * PUT /api/users/me/availability
 * body 예: [{ dayOfWeek, startTime, endTime }, ...]
 */
export const updateMyAvailability = async (slots) => {
  const res = await httpClient.put('/users/me/availability', slots);
  return res.data;
};
