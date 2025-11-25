// src/api/mentorApi.js

// 지금은 임시 더미 데이터.
// 나중에 백엔드 완성되면 이 함수 안만 실제 서버 호출(fetch/axios) 코드로 교체하면 된다.
export async function fetchMentors() {
  // 예시: 나중에는 이렇게 바뀔 예정
  // const res = await fetch('http://localhost:8080/api/mentors');
  // return await res.json();

  // 현재는 UI 개발을 위해 임시 값만 반환
  return [
    {
      id: 1,
      name: '김태윤',
      studentId: '202100014',
      major: '항공소프트웨어공학과',
      field: '전공 공부, 진로 상담',
      status: '활동 중',
    },
    {
      id: 2,
      name: '임성준',
      studentId: '202100192',
      major: '항공소프트웨어공학과',
      field: '학술제 준비, 전공 공부',
      status: '대기',
    },
  ]
}
