// src/pages/MentorListPage.jsx
import { useState } from 'react'

export default function MentorListPage() {
  const [form, setForm] = useState({
    name: '',
    employeeId: '',
    department: '',
    expertise: '',
    status: '활동 중',
  })

  // 검색어 상태
  const [search, setSearch] = useState('')

  const [mentors, setMentors] = useState([
    {
      id: 1,
      name: '김멘토',
      employeeId: 'P2023001',
      department: '항공소프트웨어공학과',
      expertise: '진로 상담, 프로젝트 멘토링',
      status: '활동 중',
    },
    {
      id: 2,
      name: '이멘토',
      employeeId: 'P2023002',
      department: '항공기계정비',
      expertise: '정비 실습 지도, 자격증 준비',
      status: '활동 중',
    },
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      alert('멘토 이름을 입력하세요.')
      return
    }

    const newMentor = {
      id: mentors.length + 1,
      ...form,
    }

    setMentors((prev) => [...prev, newMentor])

    setForm({
      name: '',
      employeeId: '',
      department: '',
      expertise: '',
      status: '활동 중',
    })
  }

  // 검색 필터
  const filteredMentors = mentors.filter((m) => {
    const keyword = search.toLowerCase()
    return (
      m.name.toLowerCase().includes(keyword) ||
      m.employeeId.toLowerCase().includes(keyword) ||
      m.department.toLowerCase().includes(keyword) ||
      m.expertise.toLowerCase().includes(keyword) ||
      m.status.toLowerCase().includes(keyword)
    )
  })

  // 한 줄에 두 개씩, 각 input 폭을 줄이기 위한 공통 스타일
  const rowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '10px',
  }

  const fieldColStyle = {
    flex: '0 0 260px', // 가로폭 줄이기 (약 260px)
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
  }

  return (
    <div>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>멘토 관리</h2>

      {/* 멘토 등록 카드 */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
          marginBottom: '20px',
          maxWidth: '620px', // 카드 폭
        }}
      >
        <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>멘토 등록</h3>

        <form onSubmit={handleSubmit}>
          {/* 이름 / 사번 */}
          <div style={rowStyle}>
            <div style={fieldColStyle}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                이름
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="멘토 이름"
                style={inputStyle}
              />
            </div>

            <div style={fieldColStyle}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                사번
              </label>
              <input
                type="text"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                placeholder="사번"
                style={inputStyle}
              />
            </div>
          </div>

          {/* 소속 / 전문 분야 */}
          <div style={rowStyle}>
            <div style={fieldColStyle}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                소속(전공)
              </label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="예: 항공소프트웨어공학과"
                style={inputStyle}
              />
            </div>

            <div style={fieldColStyle}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                전문 분야
              </label>
              <input
                type="text"
                name="expertise"
                value={form.expertise}
                onChange={handleChange}
                placeholder="예: 진로 상담, 프로젝트 멘토링"
                style={inputStyle}
              />
            </div>
          </div>

          {/* 활동 상태 */}
          <div style={{ marginBottom: '16px', maxWidth: '260px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
              활동 상태
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="활동 중">활동 중</option>
              <option value="일시 중단">일시 중단</option>
              <option value="활동 종료">활동 종료</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#111827',
              color: '#ffffff',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            멘토 등록
          </button>
        </form>
      </div>

      {/* 멘토 목록 + 검색 카드 */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
          maxWidth: '620px',
        }}
      >
        {/* 🔍 검색 입력 (폭 제한) */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름, 사번, 소속, 전문 분야, 상태로 검색"
          style={{
            width: '100%',
            maxWidth: '400px', // 검색란 가로 길이 줄이기
            padding: '10px 12px',
            marginBottom: '12px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
          }}
        />

        <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>멘토 목록</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>이름</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>사번</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>소속(전공)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>전문 분야</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>활동 상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentors.map((m) => (
              <tr key={m.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px' }}>{m.name}</td>
                <td style={{ padding: '8px' }}>{m.employeeId}</td>
                <td style={{ padding: '8px' }}>{m.department}</td>
                <td style={{ padding: '8px' }}>{m.expertise}</td>
                <td style={{ padding: '8px' }}>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
