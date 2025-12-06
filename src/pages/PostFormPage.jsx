// src/pages/PostFormPage.jsx
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost, fetchPost } from '../api/postApi';
import { useEffect } from 'react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PostFormPage() {
  const navigate = useNavigate();
  const { postId } = useParams();           // 수정 모드면 값이 존재
  const query = useQuery();
  const initialType = query.get('type') || 'MENTOR_RECRUIT';

  const isEdit = !!postId;

  const [form, setForm] = useState({
    programId: 1,
    type: initialType,
    title: '',
    content: '',
    targetLevel: '',
    maxMembers: 3,
    expectedWeeks: 8,
    expectedSessionsTotal: 8,
    expectedSessionsPerWeek: 1,
    preferredMode: 'ONLINE',
    preferredTimeNote: '',
    tagIds: [],
  });

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (!isEdit) return;

    async function loadPost() {
      const data = await fetchPost(postId);
      setForm({
        programId: data.programId,
        type: data.type,
        title: data.title,
        content: data.content,
        targetLevel: data.targetLevel,
        maxMembers: data.maxMembers,
        expectedWeeks: data.expectedWeeks,
        expectedSessionsTotal: data.expectedSessionsTotal,
        expectedSessionsPerWeek: data.expectedSessionsPerWeek,
        preferredMode: data.preferredMode,
        preferredTimeNote: data.preferredTimeNote,
        tagIds: data.tags?.map((t) => t.id) || [],
      });
    }
    loadPost();
  }, [isEdit, postId]);

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updatePost(postId, form);
    } else {
      await createPost(form);
    }
    navigate('/posts?type=' + form.type);
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>
        {isEdit
          ? '게시글 수정'
          : form.type === 'MENTOR_RECRUIT'
          ? '멘토 모집글 작성'
          : '멘티 요청글 작성'}
      </h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>제목</label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>내용</label>
          <textarea
            value={form.content}
            onChange={handleChange('content')}
            rows={8}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            대상 수준
          </label>
          <input
            type="text"
            value={form.targetLevel}
            onChange={handleChange('targetLevel')}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>
              최대 인원
            </label>
            <input
              type="number"
              value={form.maxMembers}
              onChange={handleChange('maxMembers')}
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>
              예상 주차
            </label>
            <input
              type="number"
              value={form.expectedWeeks}
              onChange={handleChange('expectedWeeks')}
              style={{ width: '100%', padding: 8 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            선호 진행 방식
          </label>
          <select
            value={form.preferredMode}
            onChange={handleChange('preferredMode')}
          >
            <option value="ONLINE">온라인</option>
            <option value="OFFLINE">오프라인</option>
            <option value="HYBRID">혼합</option>
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            선호 시간대 메모
          </label>
          <input
            type="text"
            value={form.preferredTimeNote}
            onChange={handleChange('preferredTimeNote')}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {isEdit ? '수정 완료' : '등록하기'}
        </button>
      </form>
    </div>
  );
}
