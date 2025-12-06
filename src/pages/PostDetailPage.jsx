// src/pages/PostDetailPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPost } from '../api/postApi';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchPost(postId);
      setPost(data);
    }
    load();
  }, [postId]);

  if (!post) return <div style={{ padding: 24 }}>불러오는 중…</div>;

  return (
    <div style={{ padding: '24px 32px' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 12 }}
      >
        ← 목록으로
      </button>

      <h2 style={{ fontSize: 22, marginBottom: 8 }}>{post.title}</h2>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        {post.type === 'MENTOR_RECRUIT' ? '멘토 모집글' : '멘티 요청글'} ·{' '}
        {post.targetLevel} · 최대 {post.maxMembers}명
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          marginBottom: 16,
          whiteSpace: 'pre-wrap',
        }}
      >
        {post.content}
      </div>

      {/* TODO: 여기서 post_application API와 연결해서 “신청하기” 버튼 구현 */}
      <button
        type="button"
        style={{
          padding: '10px 16px',
          borderRadius: 8,
          border: 'none',
          backgroundColor: '#22c55e',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        이 멘토링에 신청하기
      </button>
    </div>
  );
}
