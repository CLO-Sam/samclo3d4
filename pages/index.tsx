import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import Link from 'next/link';

interface Post {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  timeAgo: string;
  views: number;
  likes: number;
  comments: number;
}

const DarkBackground = styled.div`
  background-color: #0d0d0d;
  color: #fff;
  min-height: 100vh;
`;

const FlexContainer = styled.div`
  display: flex;
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
`;

const PostCard = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 5px;
`;

const ConnectLogo = styled.span`
  display: inline-block;
  width: 80px;
  height: 16px;
  background: url('https://storagefiles.clo-set.com/public/connect/common/connect-desktop-header-bi.svg') no-repeat;
`;

async function getPosts(page: string): Promise<Post[]> {
  return [
    {
      id: 1,
      category: '팁 & 트릭',
      title: '2D Snapshot 1:1 no longer outputs to scale',
      content: 'Hi Community! I recently upgraded to CLO 2026...',
      author: '@hothonbigsby',
      timeAgo: '3시간 전',
      views: 2,
      likes: 0,
      comments: 0,
    },
    {
      id: 2,
      category: '팁 & 트릭',
      title: 'Animation',
      content: 'Dear Melody, I have a problem with the animation...',
      author: '@tina.a.sauer',
      timeAgo: '하루 전',
      views: 14,
      likes: 0,
      comments: 2,
    }
  ];
}

export default function CommunityPage() {
  const router = useRouter();
  const currentPage = (router.query.page as string) || '1';

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => getPosts(currentPage),
  });

  return (
    <DarkBackground>
      <div style={{ backgroundColor: '#000', padding: '20px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center' }}>
        <Link href="/ko" style={{ textDecoration: 'none', display: 'flex' }}>
          <ConnectLogo aria-label="Go to Connect Main Page" />
        </Link>
      </div>

      <FlexContainer>
        <div style={{ width: '200px' }}>
          <h3>전체 게시판</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: '#aaa' }}>
            <li style={{ marginBottom: '10px' }}>공지사항</li>
            <li style={{ marginBottom: '10px', color: '#fff' }}>자유 게시판</li>
            <li style={{ marginBottom: '10px' }}>팁 & 트릭</li>
            <li style={{ marginBottom: '10px' }}>QnA</li>
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span>전체 게시판</span>
            <input type="text" placeholder="전체 게시판에서 검색" style={{ padding: '5px' }} />
          </div>

          {isLoading ? (
            <p>로딩중...</p>
          ) : (
            <div>
              {posts && posts.map((post) => (
                <PostCard key={post.id}>
                  <div style={{ color: '#00e5ff', fontSize: '12px', marginBottom: '5px' }}>
                    {post.category}
                  </div>
                  <h3 style={{ margin: '0 0 10px 0' }}>{post.title}</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>{post.content}</p>
                  <div style={{ marginTop: '15px', color: '#666', fontSize: '12px' }}>
                    {post.author} · {post.timeAgo} · 👁 {post.views} · 👍 {post.likes} · 💬 {post.comments}
                  </div>
                </PostCard>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '250px' }}>
          <h3>인기 게시물</h3>
          <div style={{ color: '#aaa', fontSize: '14px' }}>
            <p style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
              <strong style={{ color: '#fff' }}>공지사항</strong><br />
              Notice: a recent issue...
            </p>
            <p>
              <strong style={{ color: '#fff' }}>구인구직</strong><br />
              [Job] Storm Creek...
            </p>
          </div>
        </div>
      </FlexContainer>
    </DarkBackground>
  );
}