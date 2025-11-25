// src/api/menteeApi.js

// 지금은 임시 더미 데이터.
// 나중에 백엔드 완성되면 이 함수 안만 실제 서버 호출 코드로 교체하면 된다.
export async function fetchMentees() {
  // 예: 나중에는 이렇게 바뀔 예정
  // const res = await fetch('http://localhost:8080/api/mentees');
  // return await res.json();

  return [
    {
      id: 1,
      name: '박멘티',
      studentId: '20213456',
      major: '항공소프트웨어공학과',
      interest: '취업 상담, 진로 탐색',
      matchStatus: '매칭 완료',
    },
    {
      id: 2,
      name: '최멘티',
      studentId: '20225678',
      major: '항공기계정비',
      interest: '전공 공부, 자격증 준비',
      matchStatus: '매칭 대기',
    },
  ]
}
