// src/pages/PostDetailPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchPost } from '../api/postApi';
import { createPostApplication } from '../api/postApplicationApi';
import { useAuth } from '../context/AuthContext';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPost(postId);
        setPost(data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    }
    load();
  }, [postId]);

  if (!post) return <div style={{ padding: 24 }}>불러오는 중…</div>;

  // -----------------------------------------
  // ⭐ 신청하기 기능
  // -----------------------------------------
  const handleApply = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await createPostApplication({
        postId: Number(postId),
        fromUserId: user.id,
        toUserId: post.authorId,
      });

      alert("신청이 정상적으로 전송되었습니다!");
    } catch (err) {
      console.error("신청 실패:", err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "신청 처리 중 오류가 발생했습니다.";

      alert(msg);
    }
  };
  // -----------------------------------------

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

      {/* -----------------------------------------
          ⭐ 신청하기 버튼
      ------------------------------------------ */}
      <button
        type="button"
        onClick={handleApply}
        style={{
          padding: '10px 16px',
          borderRadius: 8,
          border: 'none',
          backgroundColor: '#22c55e',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 15,
        }}
      >
        이 멘토링에 신청하기
      </button>
    </div>
  );
}
