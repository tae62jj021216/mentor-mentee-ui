// src/pages/PostListPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchPosts } from '../api/postApi';
import { useAuth } from '../context/AuthContext';

export default function PostListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  // 기본 type: 멘티라면 MENTOR_RECRUIT, 멘토라면 MENTEE_REQUEST
  const defaultType =
    user?.role === 'MENTEE' ? 'MENTOR_RECRUIT' : 'MENTEE_REQUEST';

  const type = searchParams.get('type') || defaultType;
  const status = searchParams.get('status') || 'OPEN';
  const page = Number(searchParams.get('page') || 0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchPosts({ type, status, page });
        // PageResponse<PostResponse> 기준 예시
        setPosts(data.content || []);
        setPageInfo({
          page: data.page || page,
          totalPages: data.totalPages || 0,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type, status, page]);

  const handleChangeType = (nextType) => {
    setSearchParams({ type: nextType, status, page: 0 });
  };

  const handleChangeStatus = (nextStatus) => {
    setSearchParams({ type, status: nextStatus, page: 0 });
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>모집글 / 요청글 목록</h2>

      {/* 필터 영역 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <select
          value={type}
          onChange={(e) => handleChangeType(e.target.value)}
        >
          <option value="MENTOR_RECRUIT">멘토 모집글</option>
          <option value="MENTEE_REQUEST">멘티 요청글</option>
        </select>

        <select
          value={status}
          onChange={(e) => handleChangeStatus(e.target.value)}
        >
          <option value="OPEN">모집 중</option>
          <option value="MATCHED">매칭 완료</option>
          <option value="CLOSED">마감</option>
        </select>

        <button
          type="button"
          onClick={() => navigate('/posts/new?type=' + type)}
          style={{
            marginLeft: 'auto',
            padding: '8px 14px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          새 글 작성
        </button>
      </div>

      {/* 목록 영역 */}
      {loading ? (
        <div>불러오는 중…</div>
      ) : posts.length === 0 ? (
        <div>등록된 글이 없습니다.</div>
      ) : (
        <div
          style={{
            borderRadius: 12,
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                {post.targetLevel} · 최대 {post.maxMembers}명 · {post.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 간단한 페이징 */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button
          type="button"
          disabled={pageInfo.page <= 0}
          onClick={() =>
            setSearchParams({ type, status, page: pageInfo.page - 1 })
          }
        >
          이전
        </button>
        <div>
          {pageInfo.page + 1} / {pageInfo.totalPages || 1}
        </div>
        <button
          type="button"
          disabled={pageInfo.page + 1 >= pageInfo.totalPages}
          onClick={() =>
            setSearchParams({ type, status, page: pageInfo.page + 1 })
          }
        >
          다음
        </button>
      </div>
    </div>
  );
}
