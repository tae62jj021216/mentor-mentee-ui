// src/pages/MenteeListPage.jsx
import { useState } from 'react'

export default function MenteeListPage() {
  const [form, setForm] = useState({
    name: '',
    studentId: '',
    major: '',
    interest: '',
    matchStatus: '매칭 대기',
  })

  const [search, setSearch] = useState('')

  const [mentees, setMentees] = useState([
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
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      alert('멘티 이름을 입력하세요.')
      return
    }

    const newMentee = {
      id: mentees.length + 1,
      ...form,
    }

    setMentees((prev) => [...prev, newMentee])

    setForm({
      name: '',
      studentId: '',
      major: '',
      interest: '',
      matchStatus: '매칭 대기',
    })
  }

  const filteredMentees = mentees.filter((m) => {
    const keyword = search.toLowerCase()
    return (
      m.name.toLowerCase().includes(keyword) ||
      m.studentId.toLowerCase().includes(keyword) ||
      m.major.toLowerCase().includes(keyword) ||
      m.interest.toLowerCase().includes(keyword) ||
      m.matchStatus.toLowerCase().includes(keyword)
    )
  })

  const rowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '10px',
  }

  const fieldColStyle = {
    flex: '0 0 260px',
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
  }

  return (
    <div>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>멘티 관리</h2>

      {/* 멘티 등록 카드 */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
          marginBottom: '20px',
          maxWidth: '620px',
        }}
      >
        <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>멘티 등록</h3>

        <form onSubmit={handleSubmit}>
          {/* 이름 / 학번 */}
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
                placeholder="멘티 이름"
                style={inputStyle}
              />
            </div>

            <div style={fieldColStyle}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                학번
              </label>
              <input
                type="text"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="학번"
                style={inputStyle}
              />
            </div>
          </div>

          {/* 전공 / 관심 분야 */}
          <div style={rowStyle}>
            <div style={fieldColStyle}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                전공
              </label>
              <input
                type="text"
                name="major"
                value={form.major}
                onChange={handleChange}
                placeholder="예: 항공소프트웨어공학과"
                style={inputStyle}
              />
            </div>

            <div style={fieldColStyle}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                관심 분야
              </label>
              <input
                type="text"
                name="interest"
                value={form.interest}
                onChange={handleChange}
                placeholder="예: 취업 상담, 진로 탐색"
                style={inputStyle}
              />
            </div>
          </div>

          {/* 매칭 상태 */}
          <div style={{ marginBottom: '16px', maxWidth: '260px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
              멘토 매칭 상태
            </label>
            <select
              name="matchStatus"
              value={form.matchStatus}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="매칭 대기">매칭 대기</option>
              <option value="매칭 진행 중">매칭 진행 중</option>
              <option value="매칭 완료">매칭 완료</option>
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
            멘티 등록
          </button>
        </form>
      </div>

      {/* 검색 + 목록 카드 */}
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
          placeholder="이름, 학번, 전공, 관심 분야, 상태로 검색"
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

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>이름</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>학번</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>전공</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>관심 분야</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>멘토 매칭 상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentees.map((m) => (
              <tr key={m.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px' }}>{m.name}</td>
                <td style={{ padding: '8px' }}>{m.studentId}</td>
                <td style={{ padding: '8px' }}>{m.major}</td>
                <td style={{ padding: '8px' }}>{m.interest}</td>
                <td style={{ padding: '8px' }}>{m.matchStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
