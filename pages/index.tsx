import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

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

interface BannerPost {
  postId: string;
  title: string;
  summary: string;
  category: number;
  creatorName: string;
  creatorThumbnailPath: string;
  postThumbnail: {
    path: string;
    width: number;
    height: number;
  };
}

const DarkBackground = styled.div`
  background-color: #0d0d0d;
  color: #fff;
  min-height: 100vh;
`;

const HeaderContainer = styled.header`
  background-color: #000000;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #222;
`;

const LeftNavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const ConnectLogo = styled.span`
  display: inline-block;
  width: 80px;
  height: 16px;
  background: url('https://storagefiles.clo-set.com/public/connect/common/connect-desktop-header-bi.svg') no-repeat;
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${(props) => (props.active ? '#ffffff' : '#aaaaaa')};
  text-decoration: none;
  font-size: 15px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  
  &:hover {
    color: #ffffff;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 60px;
  cursor: pointer;

  .dropdown-menu {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    background-color: #000000;
    border: 1px solid #333;
    padding: 10px 0;
    min-width: 160px;
    z-index: 100;
  }

  .arrow-up {
    display: none;
  }

  &:hover {
    color: #00e5ff;
    
    .dropdown-menu {
      display: flex;
      flex-direction: column;
    }
    .dropdown-title {
      color: #00e5ff;
    }
    .arrow-down {
      display: none;
    }
    .arrow-up {
      display: inline-block;
      fill: #00e5ff;
    }
  }
`;

const DropdownTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #aaaaaa;
  font-size: 15px;
  font-weight: bold;
`;

const DropdownItem = styled(Link)`
  color: #cccccc;
  text-decoration: none;
  padding: 12px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    color: #ffffff;
    background-color: #1a1a1a;
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 16px;
  background-color: #333333;
`;

const RightAuthGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LoginLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
`;

const SignUpButton = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  border: 1px solid #ffffff;
  border-radius: 20px;
  padding: 6px 16px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const GridIconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  color: #aaaaaa;

  &:hover {
    color: #ffffff;
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  max-width: 1440px;
  margin: 30px auto;
  padding: 0 20px;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding-bottom: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselCard = styled.div<{ bg: string }>`
  box-sizing: border-box;
  min-width: 340px;
  height: 380px;
  border-radius: 16px;
  background: url(${(props) => props.bg}) center/cover no-repeat;
  background-color: #1a1a1a;
  scroll-snap-align: start;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    
    .hover-content {
      opacity: 1;
    }
  }
`;

const CardHoverOverlay = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
`;

const CategoryBadge = styled.div`
  align-self: flex-start;
  background-color: rgba(122, 110, 94, 0.85);
  color: #f1ebd9;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
`;

const CardBottomInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  color: #ffffff;
  font-weight: bold;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardSummary = styled.p`
  margin: 0;
  font-size: 15px;
  color: #dddddd;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;

const CreatorAvatar = styled.div<{ bg: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: url(${(props) => props.bg}) center/cover no-repeat;
  background-color: #444;
`;

const CreatorName = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`;

const CarouselNavBtn = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.direction === 'left' ? 'left: 5px;' : 'right: 5px;')}
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
`;

const SidebarWrapper = styled.aside`
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidebarDivider = styled.hr`
  border: 0;
  border-top: 1px solid #222;
  margin: 0;
  width: 100%;
`;

const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SidebarGroupTitle = styled.div`
  color: #666666;
  font-size: 14px;
  font-weight: bold;
`;

const SidebarItemBtn = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 0 0 0 16px;
  color: ${(props) => (props.active ? '#ffffff' : '#aaaaaa')};
  font-size: 16px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  height: 24px;

  &:hover {
    color: #ffffff;
  }

  ${(props) =>
    props.active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 2px;
      height: 18px;
      background-color: #ffffff;
    }
  `}
`;

const PostCard = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 5px;
`;

const getCategoryName = (categoryId: number) => {
  const categoryMap: Record<number, string> = {
    210: '프로젝트 & 과정',
    215: '자유 게시판',
    220: '팁 & 트릭',
    230: '질문 & 답변',
  };
  return categoryMap[categoryId] || '게시판';
};

async function getBanners(): Promise<BannerPost[]> {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/search?isBanner=true&pageSize=12&sortBy=5&language=2%20%3D%20KO', {
    headers: {
      'accept': 'text/plain'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch banners');
  const data = await res.json();
  return data.posts || [];
}

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
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      
      const handlePopState = () => {
        setCurrentPath(window.location.pathname);
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const currentPage = (router.query.page as string) || '1';

  const tabTitleMap: Record<string, string> = {
    '/': '전체 게시판',
    '/notice': '공지사항',
    '/user-spotlight': '유저 스포트라이트',
    '/general': '자유 게시판',
    '/challenge': '챌린지',
    '/project-and-steps': '프로젝트 & 과정',
    '/tips-and-tricks': '팁 & 트릭',
    '/qna': 'QnA',
    '/user-feedback': '유저 피드백',
    '/job-board': '구인구직',
    '/community-guide': '커뮤니티 가이드',
  };

  const currentTitle = tabTitleMap[currentPath] || '전체 게시판';

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', currentPage, currentPath],
    queryFn: () => getPosts(currentPage),
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = 360;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handlePathClick = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  return (
    <DarkBackground>
      <HeaderContainer>
        <LeftNavGroup>
          <Link href="/ko" style={{ textDecoration: 'none', display: 'flex' }}>
            <ConnectLogo aria-label="Go to Connect Main Page" />
          </Link>
          
          <NavLink href="/store">스토어</NavLink>
          <NavLink href="/gallery">갤러리</NavLink>
          <NavLink href="/contest">콘테스트</NavLink>
          <NavLink href="/community" active>커뮤니티</NavLink>

          <DropdownWrapper>
            <DropdownTitle className="dropdown-title">
              앱
              <svg className="arrow-down" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
              <svg className="arrow-up" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>
            </DropdownTitle>
            <div className="dropdown-menu">
              <DropdownItem href="/everywear">EveryWear</DropdownItem>
              <DropdownItem href="/livesync">LiveSync</DropdownItem>
              <DropdownItem href="/ar-filter">AR 필터</DropdownItem>
              <DropdownItem href="/jinny">JINNY</DropdownItem>
            </div>
          </DropdownWrapper>

          <VerticalDivider />

          <DropdownWrapper>
            <DropdownTitle className="dropdown-title">
              Gamewear
              <svg className="arrow-down" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
              <svg className="arrow-up" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>
            </DropdownTitle>
            <div className="dropdown-menu">
              <DropdownItem href="https://inzoi.com" target="_blank">
                inZOI
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
              </DropdownItem>
              <DropdownItem href="https://vrchat.com" target="_blank">
                VRChat
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
              </DropdownItem>
            </div>
          </DropdownWrapper>
        </LeftNavGroup>

        <RightAuthGroup>
          <LoginLink href="/login">로그인</LoginLink>
          <SignUpButton href="/signup">회원가입</SignUpButton>
          <GridIconBtn>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
            </svg>
          </GridIconBtn>
        </RightAuthGroup>
      </HeaderContainer>

      <CarouselWrapper>
        <CarouselNavBtn direction="left" onClick={() => scrollCarousel('left')}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </CarouselNavBtn>
        
        <CarouselTrack ref={trackRef}>
          {banners && banners.map((item) => {
            const bgImage = item.postThumbnail?.path || `https://picsum.photos/seed/${item.postId.slice(0, 5)}/400/500`;
            const avatarImage = item.creatorThumbnailPath || `https://picsum.photos/seed/${item.creatorName}/100/100`;
            
            return (
              <CarouselCard key={item.postId} bg={bgImage}>
                <CardHoverOverlay className="hover-content">
                  <CategoryBadge>{getCategoryName(item.category)}</CategoryBadge>
                  
                  <CardBottomInfo>
                    <CardTitle>{item.title}</CardTitle>
                    {item.summary && <CardSummary>{item.summary}</CardSummary>}
                    <CreatorInfo>
                      <CreatorAvatar bg={avatarImage} />
                      <CreatorName>{item.creatorName}</CreatorName>
                    </CreatorInfo>
                  </CardBottomInfo>
                </CardHoverOverlay>
              </CarouselCard>
            );
          })}
        </CarouselTrack>

        <CarouselNavBtn direction="right" onClick={() => scrollCarousel('right')}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </CarouselNavBtn>
      </CarouselWrapper>

      <FlexContainer>
        <SidebarWrapper>
          <SidebarItemBtn 
            active={currentPath === '/'} 
            onClick={() => handlePathClick('/')}
          >
            전체 게시판
          </SidebarItemBtn>

          <SidebarDivider />

          <SidebarGroup>
            <SidebarGroupTitle>공식 계정</SidebarGroupTitle>
            <SidebarItemBtn 
              active={currentPath === '/notice'} 
              onClick={() => handlePathClick('/notice')}
            >
              공지사항
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/user-spotlight'} 
              onClick={() => handlePathClick('/user-spotlight')}
            >
              유저 스포트라이트
            </SidebarItemBtn>
          </SidebarGroup>

          <SidebarDivider />

          <SidebarGroup>
            <SidebarGroupTitle>주제</SidebarGroupTitle>
            <SidebarItemBtn 
              active={currentPath === '/general'} 
              onClick={() => handlePathClick('/general')}
            >
              자유 게시판
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/challenge'} 
              onClick={() => handlePathClick('/challenge')}
            >
              챌린지
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/project-and-steps'} 
              onClick={() => handlePathClick('/project-and-steps')}
            >
              프로젝트 & 과정
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/tips-and-tricks'} 
              onClick={() => handlePathClick('/tips-and-tricks')}
            >
              팁 & 트릭
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/qna'} 
              onClick={() => handlePathClick('/qna')}
            >
              QnA
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/user-feedback'} 
              onClick={() => handlePathClick('/user-feedback')}
            >
              유저 피드백
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/job-board'} 
              onClick={() => handlePathClick('/job-board')}
            >
              구인구직
            </SidebarItemBtn>
          </SidebarGroup>

          <SidebarDivider />

          <SidebarItemBtn 
            active={currentPath === '/community-guide'} 
            onClick={() => handlePathClick('/community-guide')}
          >
            커뮤니티 가이드
          </SidebarItemBtn>
        </SidebarWrapper>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span>{currentTitle}</span>
            <input type="text" placeholder={`${currentTitle}에서 검색`} style={{ padding: '5px' }} />
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