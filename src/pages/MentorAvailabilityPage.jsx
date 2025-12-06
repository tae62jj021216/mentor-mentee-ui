// src/pages/MentorAvailabilityPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchMyAvailability,
  updateMyAvailability,
} from '../api/userApi';

export default function MentorAvailabilityPage() {
  // 지금은 /users/me 기반 API라 user를 직접 쓰지는 않지만, 향후 확장을 위해 유지
  const { user } = useAuth();

  const [availabilities, setAvailabilities] = useState([]);
  const [form, setForm] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 내 가용 시간 조회
  const loadAvailabilities = async () => {
    setLoading(true);
    try {
      const list = await fetchMyAvailability();

      let slots = [];
      if (Array.isArray(list)) {
        slots = list;
      } else if (list && Array.isArray(list.slots)) {
        // 혹시 백엔드가 { slots: [...] } 형태로 줄 경우
        slots = list.slots;
      }
      setAvailabilities(slots);
    } catch (error) {
      console.error('멘토 가능 시간 조회 실패:', error);
      // 알림창(alert)은 없애고, 화면은 빈 목록으로만 처리
      setAvailabilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilities();
  }, []);

  // 폼 값 변경
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 가능 시간 추가 → 전체 배열 PUT
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.startTime || !form.endTime) {
      alert('시작 시간과 종료 시간을 모두 입력해 주세요.');
      return;
    }

    const nextSlots = [
      ...availabilities,
      {
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        endTime: form.endTime,
      },
    ];

    setSubmitting(true);
    try {
      await updateMyAvailability(nextSlots);
      setAvailabilities(nextSlots);
      setForm((prev) => ({
        ...prev,
        startTime: '',
        endTime: '',
      }));
    } catch (error) {
      console.error('멘토 가능 시간 추가 실패:', error);
      alert('멘토 가능 시간을 저장하는 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 가능 시간 삭제 → 전체 배열 PUT
  const handleDelete = async (index) => {
    const confirmed = window.confirm('해당 가능 시간을 삭제하시겠습니까?');
    if (!confirmed) return;

    const nextSlots = availabilities.filter((_, i) => i !== index);

    try {
      await updateMyAvailability(nextSlots);
      setAvailabilities(nextSlots);
    } catch (error) {
      console.error('멘토 가능 시간 삭제 실패:', error);
      alert('삭제 후 저장하는 중 오류가 발생했습니다.');
    }
  };

  // 요일 한글 라벨
  const dayLabel = (day) => {
    const map = {
      MONDAY: '월',
      TUESDAY: '화',
      WEDNESDAY: '수',
      THURSDAY: '목',
      FRIDAY: '금',
      SATURDAY: '토',
      SUNDAY: '일',
    };
    return map[day] || day;
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>
        멘토 가능 시간 관리
      </h2>

      {/* 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <select
          name="dayOfWeek"
          value={form.dayOfWeek}
          onChange={handleChange}
          style={{
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
          }}
        >
          <option value="MONDAY">월요일</option>
          <option value="TUESDAY">화요일</option>
          <option value="WEDNESDAY">수요일</option>
          <option value="THURSDAY">목요일</option>
          <option value="FRIDAY">금요일</option>
          <option value="SATURDAY">토요일</option>
          <option value="SUNDAY">일요일</option>
        </select>

        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          style={{
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
          }}
        />

        <span>~</span>

        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          style={{
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
          }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {submitting ? '저장 중...' : '가능 시간 추가'}
        </button>
      </form>

      {/* 목록 영역 */}
      {loading ? (
        <p>가능 시간을 불러오는 중입니다...</p>
      ) : availabilities.length === 0 ? (
        <p>등록된 가능 시간이 없습니다. 위에서 새로 추가해 주세요.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #e5e7eb',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <th
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                요일
              </th>
              <th
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                시간
              </th>
              <th
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {availabilities.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px', fontSize: '14px' }}>
                  {dayLabel(item.dayOfWeek)}
                </td>
                <td style={{ padding: '10px', fontSize: '14px' }}>
                  {item.startTime} ~ {item.endTime}
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #ef4444',
                      backgroundColor: 'white',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
