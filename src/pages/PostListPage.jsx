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
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const canCreatePost = user && !isAdmin;

  // 기본 type: 멘티라면 멘토 모집글, 멘토라면 멘티 요청글, 그 외(관리자 등)는 전체
  const defaultType =
    user?.role === 'MENTEE'
      ? 'MENTOR_RECRUIT'
      : user?.role === 'MENTOR'
      ? 'MENTEE_REQUEST'
      : '';

  const type = searchParams.get('type') ?? defaultType;
  const status = searchParams.get('status') ?? 'OPEN';
  const page = Number(searchParams.get('page') ?? 0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // '' 값은 apiGet에서 자동으로 쿼리에서 제거되므로
        // type/status가 빈 문자열이면 필터 없이 조회된다.
        const data = await fetchPosts({ type, status, page });

        // 1) 배열 형태(페이지 정보 없는 단순 리스트)
        if (Array.isArray(data)) {
          setPosts(data);
          setPageInfo({ page: 0, totalPages: 1 });
          return;
        }

        // 2) PageResponse<PostResponse> 형태
        setPosts(data.content || []);
        setPageInfo({
          page: data.page ?? page,
          totalPages: data.totalPages ?? 1,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, status, page]);

  const handleChangeType = (nextType) => {
    setSearchParams({
      type: nextType,
      status,
      page: 0,
    });
  };

  const handleChangeStatus = (nextStatus) => {
    setSearchParams({
      type,
      status: nextStatus,
      page: 0,
    });
  };

  const handleChangePage = (nextPage) => {
    setSearchParams({
      type,
      status,
      page: nextPage,
    });
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        멘토링 게시판
      </h2>
      <p
        style={{
          marginBottom: 16,
          fontSize: 13,
          color: '#6b7280',
        }}
      >
        멘토와 멘티가 서로를 찾기 위해 모집글을 올리고 신청하는 게시판입니다.
        역할과 상관없이 같은 게시글을 보되, 본인이 작성한 글과 받은 신청만
        관리할 수 있습니다.
      </p>

      {/* 필터 영역 */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <label style={{ fontSize: 13, color: '#4b5563' }}>
          유형
          <select
            value={type}
            onChange={(e) => handleChangeType(e.target.value)}
            style={{
              marginLeft: 6,
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 13,
            }}
          >
            {/* 전체 보기 옵션: 관리자뿐 아니라 필요하면 모두 사용 가능 */}
            <option value="">전체</option>
            <option value="MENTOR_RECRUIT">멘토 모집글</option>
            <option value="MENTEE_REQUEST">멘티 요청글</option>
          </select>
        </label>

        <label style={{ fontSize: 13, color: '#4b5563' }}>
          상태
          <select
            value={status}
            onChange={(e) => handleChangeStatus(e.target.value)}
            style={{
              marginLeft: 6,
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 13,
            }}
          >
            <option value="OPEN">모집 중</option>
            <option value="MATCHED">매칭 완료</option>
            <option value="CLOSED">마감</option>
            <option value="">전체 상태</option>
          </select>
        </label>

        {canCreatePost && (
          <button
            type="button"
            onClick={() => navigate('/posts/new?type=' + (type || 'MENTOR_RECRUIT'))}
            style={{
              marginLeft: 'auto',
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#fff',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            새 글 작성
          </button>
        )}
      </div>

      {/* 목록 영역 */}
      {loading ? (
        <div style={{ padding: '16px 4px', fontSize: 13 }}>불러오는 중…</div>
      ) : posts.length === 0 ? (
        <div style={{ padding: '16px 4px', fontSize: 13, color: '#6b7280' }}>
          등록된 글이 없습니다.
        </div>
      ) : (
        <div
          style={{
            borderRadius: 12,
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
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
              <div style={{ fontSize: 16, fontWeight: 600 }}>{post.title}</div>
              <div
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  marginTop: 4,
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span>{post.targetLevel}</span>
                <span>· 최대 {post.maxMembers}명</span>
                <span>· {post.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 간단한 페이징 */}
      {pageInfo.totalPages > 1 && (
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            fontSize: 13,
          }}
        >
          <button
            type="button"
            disabled={pageInfo.page <= 0}
            onClick={() => handleChangePage(pageInfo.page - 1)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              backgroundColor:
                pageInfo.page <= 0 ? '#f9fafb' : 'rgba(37,99,235,0.04)',
              cursor: pageInfo.page <= 0 ? 'default' : 'pointer',
            }}
          >
            이전
          </button>
          <div>
            {pageInfo.page + 1} / {pageInfo.totalPages}
          </div>
          <button
            type="button"
            disabled={pageInfo.page + 1 >= pageInfo.totalPages}
            onClick={() => handleChangePage(pageInfo.page + 1)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              backgroundColor:
                pageInfo.page + 1 >= pageInfo.totalPages
                  ? '#f9fafb'
                  : 'rgba(37,99,235,0.04)',
              cursor:
                pageInfo.page + 1 >= pageInfo.totalPages ? 'default' : 'pointer',
            }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
