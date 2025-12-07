// src/api/postApi.js
import { API_BASE_URL } from './config';

/**
 * 공통: 인증 헤더 생성
 */
const buildAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';

  if (!token) return {};
  return {
    Authorization: `${tokenType} ${token}`,
  };
};

/**
 * 공통: GET 호출
 *  - params 객체를 쿼리 스트링으로 변환해서 붙여준다.
 */
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

  // 백엔드가 ApiResponse<T> 형태로 감싸서 줄 수도 있으므로 data.data 우선 사용
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
};

/**
 * 공통: POST 호출
 */
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
 * 공통: PUT 호출 (게시글 수정용)
 */
const apiPut = async (path, body) => {
  const url = new URL(API_BASE_URL + path, window.location.origin);

  const res = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(),
    },
    body: JSON.stringify(body ?? {}),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const error = new Error('API PUT error');
    error.response = { status: res.status, data };
    throw error;
  }

  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
};

/**
 * 공통: DELETE 호출 (게시글 삭제용)
 */
const apiDelete = async (path) => {
  const url = new URL(API_BASE_URL + path, window.location.origin);

  const res = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const error = new Error('API DELETE error');
    error.response = { status: res.status, data };
    throw error;
  }

  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
};

/* ------------------------------------------------------------------ */
/* 게시판(post) 전용 API 래퍼                                         */
/* ------------------------------------------------------------------ */

/**
 * 게시글 목록 조회
 *
 * @param {Object} options
 * @param {number} [options.programId] - 프로그램 ID (필요 시)
 * @param {"MENTOR_RECRUIT"|"MENTEE_REQUEST"} [options.type] - 글 유형
 * @param {"OPEN"|"MATCHED"|"CLOSED"} [options.status] - 모집 상태
 * @param {number} [options.page] - 페이지 번호 (0-base)
 * @param {number} [options.size] - 페이지당 개수
 *
 * 백엔드가 PageResponse<PostResponse> 를 주는 경우 그대로 반환하고,
 * 단순 배열을 주는 경우에는 배열 그대로 반환한다.
 */
export const fetchPosts = async (options = {}) => {
  try {
    const result = await apiGet('/posts', options);

    // 배열이면 그대로, 객체면 그대로 돌려보내고 호출하는 쪽에서 content 등을 사용
    if (Array.isArray(result)) {
      return result;
    }
    return result;
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      console.warn(
        '[postApi] GET /posts 404 응답 → 게시글 없음으로 간주하고 빈 결과 반환',
      );
      return { content: [], totalPages: 0, page: 0, totalElements: 0 };
    }
    throw error;
  }
};

/**
 * 게시글 상세 조회
 */
export const fetchPostById = async (postId) => {
  return apiGet(`/posts/${postId}`);
};

/**
 * 옛날 코드에서 fetchPost 이름을 쓸 수도 있으니,
 * fetchPostById 와 같은 함수로 별칭을 하나 더 내보낸다.
 */
export const fetchPost = fetchPostById;

/**
 * 게시글 생성
 *  - payload는 Backend 명세의 PostCreateRequest 형태
 */
export const createPost = async (payload) => {
  return apiPost('/posts', payload);
};

/**
 * 게시글 수정
 *  - PUT /api/posts/{postId}
 */
export const updatePost = async (postId, payload) => {
  return apiPut(`/posts/${postId}`, payload);
};

/**
 * 게시글 삭제 (Soft Delete)
 *  - DELETE /api/posts/{postId}
 */
export const deletePost = async (postId) => {
  return apiDelete(`/posts/${postId}`);
};

/* ------------------------------------------------------------------ */
/* PostApplication(신청) 전용 API 래퍼                                */
/* ------------------------------------------------------------------ */

/**
 * 신청 생성
 *  - POST /api/post-applications
 *  - body: PostApplicationRequest
 *
 * 예:
 * {
 *   "postId": 10,
 *   "message": "멘티로 참여하고 싶습니다!"
 * }
 */
export const createPostApplication = async (payload) => {
  return apiPost('/post-applications', payload);
};

/**
 * 내가 보낸 신청 목록
 *  - GET /api/post-applications/me/sent
 */
export const fetchMySentApplications = async () => {
  return apiGet('/post-applications/me/sent');
};

/**
 * 내가 받은 신청 목록
 *  - GET /api/post-applications/me/received
 */
export const fetchMyReceivedApplications = async () => {
  return apiGet('/post-applications/me/received');
};

/**
 * 신청 수락
 *  - POST /api/post-applications/{applicationId}/accept
 *  - body 없음
 */
export const acceptPostApplication = async (applicationId) => {
  return apiPost(`/post-applications/${applicationId}/accept`, {});
};

/**
 * 신청 거절
 *  - POST /api/post-applications/{applicationId}/reject
 *  - body 없음
 */
export const rejectPostApplication = async (applicationId) => {
  return apiPost(`/post-applications/${applicationId}/reject`, {});
};
