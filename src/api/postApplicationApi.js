// src/api/postApplicationApi.js
// postApi에 구현된 PostApplication 관련 함수를 그대로 재사용하는 래퍼

import {
  createPostApplication as _createPostApplication,
  fetchMySentApplications as _fetchMySentApplications,
  fetchMyReceivedApplications as _fetchMyReceivedApplications,
  acceptPostApplication as _acceptPostApplication,
  rejectPostApplication as _rejectPostApplication,
} from './postApi'

/**
 * 신청 생성
 */
export const createPostApplication = (payload) =>
  _createPostApplication(payload)

/**
 * 내가 보낸 신청 목록
 */
export const fetchMySentApplications = () => _fetchMySentApplications()

/**
 * 내가 받은 신청 목록
 */
export const fetchMyReceivedApplications = () => _fetchMyReceivedApplications()

/**
 * 신청 수락
 */
export const acceptPostApplication = (applicationId) =>
  _acceptPostApplication(applicationId)

/**
 * 신청 거절
 */
export const rejectPostApplication = (applicationId) =>
  _rejectPostApplication(applicationId)
