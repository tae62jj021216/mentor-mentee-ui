// src/api/sessionApi.js

// 임시 더미 데이터
// 나중에 백엔드 연결되면 fetch로 교체하면 됨.
export async function fetchSessions() {
  // 실제 연결 시:
  // const res = await fetch('http://localhost:8080/api/sessions');
  // return await res.json();

  return [
    {
      id: 1,
      mentorName: '김멘토',
      menteeName: '박멘티',
      topic: '진로 상담',
      status: '진행 중',
      date: '2025-01-10',
    },
    {
      id: 2,
      mentorName: '이멘토',
      menteeName: '최멘티',
      topic: '전공 학습',
      status: '대기',
      date: '2025-01-08',
    },
  ]
}
