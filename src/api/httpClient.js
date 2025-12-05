// src/api/httpClient.js
import { API_BASE_URL } from './config'

/**
 * 공통 HTTP 클라이언트
 * - 모든 요청에 API_BASE_URL(/api)을 prefix로 붙임
 * - JSON 응답 / 문자열 응답 모두 처리
 * - 네트워크 오류만 throw, 나머지는 호출한 쪽에서 판단
 */
export default async function httpClient(path, options = {}) {
  const url = `${API_BASE_URL}${path}`

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // 토큰 자동 포함
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken')

  if (token) {
    const trimmed = token.trim()
    headers.Authorization = trimmed.toLowerCase().startsWith('bearer ')
      ? trimmed
      : `Bearer ${trimmed}`
  }

  const config = {
    method: options.method || 'GET',
    headers,
  }

  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const res = await fetch(url, config)

    // 텍스트로 먼저 읽고, JSON 파싱을 시도
    const text = await res.text()
    if (!text) {
      return null
    }

    try {
      const data = JSON.parse(text)
      return data
    } catch {
      // JSON 이 아니면 그냥 문자열로 반환
      return text
    }
  } catch (err) {
    console.error('[httpClient] network error:', err)
    // 네트워크 자체 오류만 throw
    throw err
  }
}
