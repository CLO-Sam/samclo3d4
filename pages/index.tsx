import { useRouter } from 'next/router';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

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

interface PostItemData {
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
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  registeredDate: string;
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
  flex-shrink: 0;
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

const MainPanel = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopFilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TopFilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SelectBox = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 8px 16px;
  border-radius: 20px;
  color: #aaaaaa;
  font-size: 14px;
  cursor: pointer;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
`;

const TagBtn = styled.button`
  background-color: #222;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  color: #ccc;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background-color: #333;
    color: #fff;
  }
`;

const SearchInputBox = styled.div`
  background-color: #222;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 260px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: #fff;
  outline: none;
  width: 100%;
  font-size: 14px;

  &::placeholder {
    color: #888;
  }
`;

const BoardContainer = styled.div`
  background-color: #161616;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #2a2a2a;
`;

const BoardTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: #fff;
`;

const BoardHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #aaa;
  font-size: 14px;
`;

const PinnedPost = styled.div`
  padding: 16px 20px;
  background-color: #1f1f1f;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PinnedLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PostListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostListItem = styled.div`
  display: flex;
  padding: 24px 20px;
  border-bottom: 1px solid #2a2a2a;
  gap: 24px;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #1a1a1a;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const PostContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SmallBadge = styled.div`
  align-self: flex-start;
  background-color: rgba(255, 255, 255, 0.08);
  color: #e0a3b8;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const ItemTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #ffffff;
  font-weight: 600;
`;

const ItemSummary = styled.p`
  margin: 0 0 16px 0;
  font-size: 15px;
  color: #aaaaaa;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #888888;
`;

const SmallAvatar = styled.div<{ bg: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: url(${(props) => props.bg}) center/cover no-repeat;
  background-color: #444;
`;

const ItemThumbnailWrapper = styled.div`
  width: 140px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #222;
  flex-shrink: 0;
`;

const ItemThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FloatingWriteBtn = styled.button`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  color: #000000;
  padding: 12px 32px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 15px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 50;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const getCategoryName = (categoryId: number) => {
  const categoryMap: Record<number, string> = {
    210: '프로젝트 & 과정',
    215: '자유 게시판',
    220: '팁 & 트릭',
    230: 'QnA',
  };
  return categoryMap[categoryId] || '게시판';
};

function formatTimeAgo(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
}

async function getBanners(): Promise<BannerPost[]> {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/search?isBanner=true&pageSize=12&sortBy=5&language=2%20%3D%20KO', {
    headers: { 'accept': 'text/plain' }
  });
  if (!res.ok) throw new Error('Failed to fetch banners');
  const data = await res.json();
  return data.posts || [];
}

async function fetchPosts({ pageParam = 1, queryKey }: any) {
  const [_key, path] = queryKey;
  
  const categoryMapping: Record<string, string> = {
    '/general': '215',
    '/project-and-steps': '210',
    '/tips-and-tricks': '220',
    '/qna': '230'
  };
  
  const catId = categoryMapping[path] || '';
  const catQuery = catId ? `&category=${catId}` : '';
  
  const res = await fetch(`https://test-connect-community.api.clo-set.com/api/post/search?sortBy=4&keyword=&pageSize=24&language=ko&pageNumber=${pageParam}${catQuery}`, {
    headers: { 'accept': 'text/plain' }
  });
  
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return data;
}

export default function CommunityPage() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      const handlePopState = () => setCurrentPath(window.location.pathname);
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

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

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['posts', currentPath],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.posts && lastPage.posts.length === 24) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

        <MainPanel>
          <TopFilterBar>
            <TopFilterLeft>
              <SelectBox>소프트웨어 | 전체 ▼</SelectBox>
              <TagList>
                <TagBtn>CLO-SET</TagBtn>
                <TagBtn>CONNECT</TagBtn>
                <TagBtn>EveryWear</TagBtn>
                <TagBtn>LiveSync</TagBtn>
              </TagList>
            </TopFilterLeft>
            <SearchInputBox>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#888"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <SearchInput placeholder="전체 게시판에서 검색" />
            </SearchInputBox>
          </TopFilterBar>

          <BoardContainer>
            <BoardHeader>
              <BoardTitle>{currentTitle}</BoardTitle>
              <BoardHeaderRight>
                <span>뷰 ▼</span>
                <span>최근 활동순 ▼</span>
              </BoardHeaderRight>
            </BoardHeader>

            <PinnedPost>
              <PinnedLeft>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#aaa"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                <span style={{ color: '#00e5ff', fontSize: '13px' }}>팁 & 트릭</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>🎉 300 Free Patterns for You!</span>
              </PinnedLeft>
              <div style={{ color: '#aaa' }}>{'< >'}</div>
            </PinnedPost>

            <PostListWrapper>
              {status === 'pending' ? (
                <div style={{ padding: '24px', color: '#aaa', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>
              ) : status === 'error' ? (
                <div style={{ padding: '24px', color: '#ff6b6b', textAlign: 'center' }}>데이터를 불러오지 못했습니다.</div>
              ) : (
                postData.pages.map((page, pageIndex) => (
                  <div key={pageIndex}>
                    {page.posts && page.posts.map((post: PostItemData) => {
                      const badgeBg = post.category === 230 ? 'rgba(255,100,150,0.1)' : 'rgba(255,255,255,0.08)';
                      const badgeColor = post.category === 230 ? '#ffb3c6' : '#ccc';
                      const avatarImg = post.creatorThumbnailPath || `https://picsum.photos/seed/${post.creatorName}/50/50`;
                      const thumbImg = post.postThumbnail?.path;

                      return (
                        <PostListItem key={post.postId}>
                          <PostContentArea>
                            <SmallBadge style={{ backgroundColor: badgeBg, color: badgeColor }}>
                              {getCategoryName(post.category)}
                            </SmallBadge>
                            <ItemTitle>{post.title}</ItemTitle>
                            <ItemSummary>{post.summary}</ItemSummary>
                            
                            <ItemMeta>
                              <SmallAvatar bg={avatarImg} />
                              <span>{post.creatorName}</span>
                              <span>·</span>
                              <span>{formatTimeAgo(post.registeredDate)}</span>
                              <span>·</span>
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                              <span>{post.viewCount}</span>
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                              <span>{post.likesCount}</span>
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                              <span>{post.commentsCount}</span>
                            </ItemMeta>
                          </PostContentArea>

                          {thumbImg && (
                            <ItemThumbnailWrapper>
                              <ItemThumbnail src={thumbImg} alt="thumbnail" />
                            </ItemThumbnailWrapper>
                          )}
                        </PostListItem>
                      );
                    })}
                  </div>
                ))
              )}
              
              <div ref={loadMoreRef} style={{ height: '20px' }}>
                {isFetchingNextPage && <div style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>추가 데이터를 불러오는 중...</div>}
              </div>
            </PostListWrapper>
          </BoardContainer>
        </MainPanel>
      </FlexContainer>

      <FloatingWriteBtn>글쓰기</FloatingWriteBtn>
    </DarkBackground>
  );
}