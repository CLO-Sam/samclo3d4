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
  background-color: #131315;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  width: 100%;
  box-sizing: border-box;
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
  background-color: #1c1c1f;
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
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 20px;
  gap: 32px;
  flex: 1;
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
  border-top: 1px solid #2b2b30;
  margin: 0;
  width: 100%;
`;

const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SidebarGroupTitle = styled.div`
  color: #a1a1aa;
  font-size: 14px;
  font-weight: bold;
`;

const SidebarItemBtn = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 0 0 0 16px;
  color: ${(props) => (props.active ? '#ffffff' : '#a1a1aa')};
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
  min-width: 0;
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

const SoftwareSelectWrapper = styled.div`
  position: relative;
`;

const SoftwareButton = styled.button<{ isActive?: boolean }>`
  background-color: transparent;
  border: 1px solid ${(props) => (props.isActive ? '#55e6c1' : '#3f3f46')};
  color: ${(props) => (props.isActive ? '#55e6c1' : '#a1a1aa')};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => (props.isActive ? '#55e6c1' : '#71717a')};
  }
`;

const SoftwareDropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 40px;
  left: 0;
  background-color: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  padding: 8px;
  min-width: 200px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const SoftwareDropdownItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  color: #ffffff;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? '#1c3d3f' : 'transparent')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#1c3d3f' : '#3f3f46')};
  }
`;

const TopFilterDivider = styled.div`
  width: 1px;
  height: 14px;
  background-color: #3f3f46;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
`;

const TagBtn = styled.button<{ active?: boolean }>`
  background-color: ${(props) => (props.active ? '#3f3f46' : '#27272a')};
  border: 1px solid ${(props) => (props.active ? '#55e6c1' : 'transparent')};
  padding: 6px 12px;
  border-radius: 6px;
  color: ${(props) => (props.active ? '#55e6c1' : '#a1a1aa')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3f3f46;
    color: #fff;
  }
`;

const SearchInputBox = styled.div`
  background-color: #27272a;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 240px;
  border: 1px solid transparent;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #55e6c1; /* 하늘색 테두리 활성화 */
  }

  &:focus-within svg {
    fill: #ffffff; /* 아이콘을 흰색으로 강조 */
  }
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
  background-color: #1c1c1f;
  border-radius: 12px;
  border: 1px solid #2b2b30;
  display: flex;
  flex-direction: column;
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px 16px 48px;
  border-bottom: 1px solid #2b2b30;
`;

const BoardTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BoardTitleSub = styled.span`
  color: #a1a1aa;
  font-size: 14px;
  font-weight: normal;
`;

const BoardHeaderRight = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SortButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0;

  &:focus {
    outline: none;
  }
`;

const SortDropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 36px;
  right: 0;
  background-color: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  padding: 8px;
  min-width: 140px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const SortDropdownItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  color: #ffffff;
  font-size: 15px;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? '#1c3d3f' : 'transparent')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#1c3d3f' : '#3f3f46')};
  }
`;

const BoardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 24px;
`;

const PinnedPost = styled.div`
  padding: 16px 20px;
  margin: 0 48px 24px 48px;
  background-color: #27272a;
  border-radius: 8px;
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
  padding: 24px 0;
  margin: 0 48px;
  border-bottom: 1px solid #2b2b30;
  gap: 24px;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

const PostContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const SmallBadge = styled.div`
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
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
  font-size: 14px;
  color: #a1a1aa;
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
  color: #71717a;
`;

const SmallAvatar = styled.div<{ bg: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: url(${(props) => props.bg}) center/cover no-repeat;
  background-color: #444;
`;

const ItemThumbnailWrapper = styled.div`
  width: 160px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #27272a;
  flex-shrink: 0;
`;

const ItemThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RightSidebarWrapper = styled.aside`
  width: 280px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const RightSidebarTitle = styled.h3`
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
  margin: 0 0 24px 0;
`;

const PopularPostItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #2b2b30;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const PopularCategory = styled.div`
  font-size: 13px;
  color: #dddddd;
`;

const PopularTitle = styled.div`
  font-size: 16px;
  color: #ffffff;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PopularMeta = styled.div`
  font-size: 13px;
  color: #888888;
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
    100: '공지사항',
    110: '유저 스포트라이트',
    130: '커뮤니티 가이드',
    210: '자유 게시판',
    215: '챌린지',
    220: 'QnA',
    230: '프로젝트 & 과정',
    240: '팁 & 트릭',
    250: '유저 피드백',
    260: '구인구직',
  };
  return categoryMap[categoryId] || '게시판';
};

const getCategoryBadgeStyle = (categoryId: number) => {
  if (categoryId === 100) return { bg: '#2d3748', color: '#d6bcfa' };
  if (categoryId === 110) return { bg: '#2a4365', color: '#90cdf4' };
  if (categoryId === 130) return { bg: '#4a5568', color: '#e2e8f0' };
  if (categoryId === 210) return { bg: '#2e1f32', color: '#e3a0c4' };
  if (categoryId === 215) return { bg: '#742a2a', color: '#fbb6ce' };
  if (categoryId === 220) return { bg: '#382329', color: '#d696a6' };
  if (categoryId === 230) return { bg: '#3b321e', color: '#d8ba76' };
  if (categoryId === 240) return { bg: '#21332a', color: '#82c39e' };
  if (categoryId === 250) return { bg: '#2c7a7b', color: '#b2f5ea' };
  if (categoryId === 260) return { bg: '#276749', color: '#c6f6d5' };
  return { bg: '#27272a', color: '#a1a1aa' };
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

function formatDateKorean(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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
  const [_key, path, sortBy, searchKeyword, software, selectedTag] = queryKey;
  
  const categoryMapping: Record<string, string> = {
    '/notice': '100',
    '/user-spotlight': '110',
    '/general': '210',
    '/challenge': '215',
    '/project-and-steps': '230',
    '/tips-and-tricks': '240',
    '/qna': '220',
    '/user-feedback': '250',
    '/job-board': '260',
    '/community-guide': '130',
  };
  
  const catId = categoryMapping[path] || '';
  const catQuery = catId ? `&category=${catId}` : '';
  
  let combinedKeyword = searchKeyword || '';
  if (selectedTag) {
    combinedKeyword = combinedKeyword ? `${combinedKeyword} ${selectedTag}` : selectedTag;
  }
  const keywordQuery = combinedKeyword ? `&keyword=${encodeURIComponent(combinedKeyword)}` : '&keyword=';
  
  let tagsQuery = '';
  if (software === 'CLO') tagsQuery += '&tags=CLO';
  if (software === 'MarvelousDesigner') tagsQuery += '&tags=MavelousDesigner';
  
  const res = await fetch(`https://test-connect-community.api.clo-set.com/api/post/search?sortBy=${sortBy}${keywordQuery}${tagsQuery}&pageSize=24&language=ko&pageNumber=${pageParam}${catQuery}`, {
    headers: { 'accept': 'text/plain' }
  });
  
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return data;
}

async function fetchPopularPosts() {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/search?sortBy=4&keyword=&pageSize=24&language=ko', {
    headers: { 'accept': 'text/plain' }
  });
  if (!res.ok) throw new Error('Failed to fetch popular posts');
  const data = await res.json();
  
  if (!data.posts) return [];
  
  const sortedPosts = data.posts.sort((a: PostItemData, b: PostItemData) => b.likesCount - a.likesCount);
  return sortedPosts.slice(0, 4);
}

export default function CommunityPage() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const softwareRef = useRef<HTMLDivElement>(null);
  
  const [currentPath, setCurrentPath] = useState('/');
  const [sortBy, setSortBy] = useState<number>(4);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  
  const [selectedSoftware, setSelectedSoftware] = useState('전체');
  const [isSoftwareOpen, setIsSoftwareOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(''); // 선택된 세부 태그 상태 추가

  const sortOptions = [
    { label: '최신순', value: 0 },
    { label: '추천순', value: 1 },
    { label: '최근 활동순', value: 4 },
  ];

  const getTagsForSoftware = (software: string) => {
    if (software === 'CLO') return ['Avatar', 'Colorway', 'Pattern', 'Rendering'];
    if (software === 'MarvelousDesigner') return ['Animation', 'Retopology', 'Texture', 'UnrealEngine'];
    return ['CLO-SET', 'CONNECT', 'EveryWear', 'LiveSync'];
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      const handlePopState = () => setCurrentPath(window.location.pathname);
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (softwareRef.current && !softwareRef.current.contains(event.target as Node)) {
        setIsSoftwareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const { data: popularPosts } = useQuery({
    queryKey: ['popularPosts'],
    queryFn: fetchPopularPosts,
  });

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    // queryKey에 selectedTag 추가하여 태그 변경 시 API 다시 호출
    queryKey: ['posts', currentPath, sortBy, activeKeyword, selectedSoftware, selectedTag],
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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveKeyword(searchInput);
    }
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
              <SoftwareSelectWrapper ref={softwareRef}>
                <SoftwareButton 
                  isActive={selectedSoftware !== '전체'}
                  onClick={() => setIsSoftwareOpen(!isSoftwareOpen)}
                >
                  {selectedSoftware === '전체' ? (
                    <>
                      <span style={{ color: '#a1a1aa' }}>소프트웨어</span>
                      <span style={{ color: '#3f3f46', margin: '0 12px' }}>|</span>
                      <span style={{ color: '#fff' }}>전체</span>
                    </>
                  ) : (
                    <span>{selectedSoftware === 'CLO' ? 'CLO' : 'Marvelous Designer'}</span>
                  )}
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </SoftwareButton>
                
                <SoftwareDropdownMenu isOpen={isSoftwareOpen}>
                  {['전체', 'CLO', 'MarvelousDesigner'].map((opt) => (
                    <SoftwareDropdownItem
                      key={opt}
                      active={selectedSoftware === opt}
                      onClick={() => {
                        setSelectedSoftware(opt);
                        setSelectedTag(''); // 소프트웨어 변경 시 선택된 태그 초기화
                        setIsSoftwareOpen(false);
                      }}
                    >
                      {opt === 'MarvelousDesigner' ? 'Marvelous Designer' : opt}
                    </SoftwareDropdownItem>
                  ))}
                </SoftwareDropdownMenu>
              </SoftwareSelectWrapper>
              
              <TopFilterDivider />

              <TagList>
                {getTagsForSoftware(selectedSoftware).map(tag => (
                  <TagBtn 
                    key={tag}
                    active={selectedTag === tag}
                    onClick={() => setSelectedTag(prev => prev === tag ? '' : tag)} // 토글 기능 적용
                  >
                    {tag}
                  </TagBtn>
                ))}
              </TagList>
            </TopFilterLeft>

            <SearchInputBox>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#a1a1aa"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <SearchInput 
                placeholder={`${currentTitle}에서 검색`} 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </SearchInputBox>
          </TopFilterBar>

          <BoardContainer>
            <BoardHeader>
              <BoardTitle>
                {currentTitle}
                {activeKeyword && (
                  <BoardTitleSub>
                    {postData?.pages?.[0]?.totalCount ?? postData?.pages?.[0]?.posts?.length ?? 0} CLO-SET 게시글
                  </BoardTitleSub>
                )}
              </BoardTitle>
              <BoardHeaderRight ref={sortRef}>
                <SortButton onClick={() => setIsSortOpen(!isSortOpen)}>
                  {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M7 10l5 5 5-5z"/></svg>
                </SortButton>
                
                <SortDropdownMenu isOpen={isSortOpen}>
                  {sortOptions.map((option) => (
                    <SortDropdownItem
                      key={option.value}
                      active={sortBy === option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                    >
                      {option.label}
                    </SortDropdownItem>
                  ))}
                </SortDropdownMenu>
              </BoardHeaderRight>
            </BoardHeader>

            <BoardBody>
              <PinnedPost>
                <PinnedLeft>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#a1a1aa" style={{ transform: 'rotate(-45deg)' }}>
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: '#82c39e', fontSize: '12px', fontWeight: 'bold' }}>팁 & 트릭</span>
                    <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>순서확인용 250916</span>
                  </div>
                </PinnedLeft>
                <div style={{ color: '#a1a1aa', display: 'flex', gap: '16px', fontWeight: 'bold' }}>
                  <span style={{ cursor: 'pointer' }}>{'<'}</span>
                  <span style={{ cursor: 'pointer' }}>{'>'}</span>
                </div>
              </PinnedPost>

              <PostListWrapper>
                {status === 'pending' ? (
                  <div style={{ padding: '24px', color: '#a1a1aa', textAlign: 'center' }}>데이터를 불러오는 중...</div>
                ) : status === 'error' ? (
                  <div style={{ padding: '24px', color: '#ff6b6b', textAlign: 'center' }}>데이터를 불러오지 못했습니다.</div>
                ) : (
                  postData.pages.map((page, pageIndex) => (
                    <div key={pageIndex}>
                      {page.posts && page.posts.map((post: PostItemData) => {
                        const badgeStyle = getCategoryBadgeStyle(post.category);
                        const avatarImg = post.creatorThumbnailPath || `https://picsum.photos/seed/${post.creatorName}/50/50`;
                        const thumbImg = post.postThumbnail?.path;

                        return (
                          <PostListItem key={post.postId}>
                            <PostContentArea>
                              <SmallBadge style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color }}>
                                {getCategoryName(post.category)}
                              </SmallBadge>
                              <ItemTitle>{post.title}</ItemTitle>
                              <ItemSummary>{post.summary}</ItemSummary>
                              
                              <ItemMeta>
                                <SmallAvatar bg={avatarImg} />
                                <span>{post.creatorName}</span>
                                <span>·</span>
                                <span>{formatTimeAgo(post.registeredDate)}</span>
                                <span style={{ marginLeft: '12px' }}></span>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                <span>{post.viewCount}</span>
                                <span style={{ marginLeft: '4px' }}></span>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                                <span>{post.likesCount}</span>
                                <span style={{ marginLeft: '4px' }}></span>
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
                  {isFetchingNextPage && <div style={{ textAlign: 'center', padding: '20px', color: '#a1a1aa' }}>추가 데이터를 불러오는 중...</div>}
                </div>
              </PostListWrapper>
            </BoardBody>
          </BoardContainer>
        </MainPanel>

        <RightSidebarWrapper>
          <RightSidebarTitle>인기 게시글</RightSidebarTitle>
          
          {popularPosts && popularPosts.map((post: PostItemData) => (
            <PopularPostItem key={post.postId}>
              <PopularCategory>{getCategoryName(post.category)}</PopularCategory>
              <PopularTitle>{post.title}</PopularTitle>
              <PopularMeta>
                {post.creatorName} | {formatDateKorean(post.registeredDate)}
              </PopularMeta>
            </PopularPostItem>
          ))}
        </RightSidebarWrapper>
      </FlexContainer>

      <FloatingWriteBtn>글쓰기</FloatingWriteBtn>
    </DarkBackground>
  );
}