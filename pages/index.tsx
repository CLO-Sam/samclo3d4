import { useRouter } from 'next/router';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import Carousel from '../components/Carousel';
import MobileDrawer from '../components/MobileDrawer';
import MainPanel from '../components/MainPanel';


interface BannerPost {
  postId: string; title: string; summary: string; category: number; creatorName: string; creatorThumbnailPath: string; postThumbnail: { path: string; width: number; height: number; };
}

interface PostItemData {
  postId: string; title: string; summary: string; category: number; creatorName: string; creatorThumbnailPath: string; postThumbnail: { path: string; width: number; height: number; }; viewCount: number; likesCount: number; commentsCount: number; registeredDate: string;
}

const DarkBackground = styled.div` background-color: #131315; color: #fff; min-height: 100vh; display: flex; flex-direction: column; padding-bottom: 32px; `;

const IconButton = styled.button` background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; &:hover { color: #a1a1aa; } `;
const DrawerBackdrop = styled.div<{ isOpen: boolean }>` position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); z-index: 999; display: ${(props) => (props.isOpen ? 'block' : 'none')}; transition: opacity 0.3s ease; `;
const DrawerContainer = styled.div<{ isOpen: boolean }>` position: fixed; top: 0; right: 0; bottom: 0; width: 320px; background-color: #27272a; z-index: 1000; transform: translateX(${(props) => (props.isOpen ? '0' : '100%')}); transition: transform 0.3s ease-in-out; display: flex; flex-direction: column; overflow-y: auto; box-shadow: -4px 0 16px rgba(0,0,0,0.5); &::-webkit-scrollbar { display: none; } `;
const DrawerHeader = styled.div` display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #3f3f46; `;
const DrawerProfileArea = styled.div` display: flex; align-items: center; gap: 12px; `;
const DrawerAvatar = styled.div` width: 40px; height: 40px; border-radius: 50%; background-color: #3f3f46; display: flex; align-items: center; justify-content: center; color: #a1a1aa; `;
const DrawerLoginBtn = styled.button` background: transparent; border: 1px solid #52525b; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; &:hover { background-color: #3f3f46; } `;
const DrawerItem = styled(Link) <{ active?: boolean }>` display: flex; align-items: center; padding: 16px 24px; color: ${(props) => (props.active ? '#ffffff' : '#d4d4d8')}; text-decoration: none; font-size: 15px; background-color: ${(props) => (props.active ? '#3f3f46' : 'transparent')}; border-left: 3px solid ${(props) => (props.active ? '#55e6c1' : 'transparent')}; &:hover { background-color: #3f3f46; } `;
const DrawerAccordionBtn = styled.div<{ active?: boolean }>` display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; color: ${(props) => (props.active ? '#ffffff' : '#d4d4d8')}; font-size: 15px; cursor: pointer; background-color: ${(props) => (props.active ? '#3f3f46' : 'transparent')}; border-left: 3px solid ${(props) => (props.active ? '#55e6c1' : 'transparent')}; &:hover { background-color: #3f3f46; } `;
const DrawerSubMenu = styled.div` display: flex; flex-direction: column; background-color: #1c1c1f; `;
const DrawerSubItem = styled(Link) <{ active?: boolean }>` display: flex; align-items: center; padding: 14px 24px 14px 40px; color: ${(props) => (props.active ? '#ffffff' : '#a1a1aa')}; text-decoration: none; font-size: 14px; border-left: 3px solid ${(props) => (props.active ? '#55e6c1' : 'transparent')}; &:hover { color: #ffffff; background-color: #27272a; } `;

const FilterModalOverlay = styled.div<{ isOpen: boolean }>` position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #000000; z-index: 2000; display: ${(props) => (props.isOpen ? 'flex' : 'none')}; flex-direction: column; `;
const FilterModalHeader = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; `;
const FilterModalTitle = styled.h2` margin: 0; font-size: 18px; color: #fff; letter-spacing: 2px; `;
const FilterModalBody = styled.div` flex: 1; padding: 0 24px; display: flex; flex-direction: column; `;
const FilterBreadcrumb = styled.div` color: #a1a1aa; font-size: 14px; display: flex; align-items: center; gap: 8px; margin-bottom: 24px; span.active { color: #fff; } `;
const FilterSectionTitle = styled.div` color: #a1a1aa; font-size: 14px; margin-bottom: 16px; `;
const FilterGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; `;
const FilterCheckboxLabel = styled.label` display: flex; align-items: center; gap: 12px; color: #fff; font-size: 15px; cursor: pointer; user-select: none; `;
const FilterCheckboxInput = styled.input` display: none; `;
const FilterCustomCheck = styled.div<{ checked: boolean }>` width: 20px; height: 20px; border-radius: 4px; background-color: ${(props) => (props.checked ? '#55e6c1' : '#3f3f46')}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; &::after { content: ''; display: ${(props) => (props.checked ? 'block' : 'none')}; width: 4px; height: 10px; border: solid #131315; border-width: 0 2px 2px 0; transform: rotate(45deg); margin-bottom: 2px; } `;
const FilterDivider = styled.div` height: 1px; background-color: #2b2b30; width: 100%; margin-bottom: 24px; `;
const FilterResetBtn = styled.button` background: none; border: none; color: #fff; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 0; font-weight: bold; &:hover { opacity: 0.8; } `;


const FlexContainer = styled.div` display: flex; max-width: 1440px; width: 100%; box-sizing: border-box; margin: 0 auto; padding: 0 96px 232px; gap: 32px; flex: 1; @media (max-width: 1439px) { flex-direction: column; padding: 0 0 232px; gap: 0; } `;

const RightSidebarWrapper = styled.aside` width: 280px; display: flex; flex-direction: column; flex-shrink: 0; @media (max-width: 1439px) { display: none; } `;
const RightSidebarTitle = styled.h3` font-size: 18px; color: #ffffff; font-weight: bold; margin: 0 0 24px 0; `;
const PopularPostItem = styled.div` display: flex; flex-direction: column; gap: 8px; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid #2b2b30; cursor: pointer; &:hover { opacity: 0.8; } &:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; } `;
const PopularCategory = styled.div` font-size: 13px; color: #dddddd; `;
const PopularTitle = styled.div` font-size: 16px; color: #ffffff; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `;
const PopularMeta = styled.div` font-size: 13px; color: #888888; `;

const FloatingWriteBtn = styled.button` position: fixed; bottom: 56px; left: 50%; transform: translateX(-50%); background-color: #ffffff; color: #000000; padding: 12px 32px; border-radius: 30px; font-weight: bold; font-size: 15px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 50; &:hover { background-color: #f0f0f0; } `;
const ScrollToTopBtn = styled.button` position: fixed; bottom: 56px; right: 24px; width: 40px; height: 40px; border-radius: 50%; background-color: #1c1c1f; border: 1px solid #3f3f46; color: #fff; display: none; align-items: center; justify-content: center; cursor: pointer; z-index: 50; @media (max-width: 1439px) { display: flex; } &:hover { background-color: #27272a; } `;

const getCategoryName = (categoryId: number) => {
  const categoryMap: Record<number, string> = { 100: '공지사항', 110: '유저 스포트라이트', 130: '커뮤니티 가이드', 210: '자유 게시판', 215: '챌린지', 220: 'QnA', 230: '프로젝트 & 과정', 240: '팁 & 트릭', 250: '유저 피드백', 260: '구인구직', };
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
  const date = new Date(dateString); const now = new Date(); const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
  const diffInMinutes = Math.floor(diffInSeconds / 60); if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60); if (diffInHours < 24) return `${diffInHours}시간 전`;
  const diffInDays = Math.floor(diffInHours / 24); return `${diffInDays}일 전`;
}

function formatDateKorean(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString); return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

async function getBanners(): Promise<BannerPost[]> {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/search?isBanner=true&pageSize=12&sortBy=5&language=2%20%3D%20KO', { headers: { 'accept': 'text/plain' } });
  if (!res.ok) throw new Error('Failed to fetch banners');
  const data = await res.json(); return data.posts || [];
}

async function fetchPinnedPosts(): Promise<PostItemData[]> {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/pins?pinType=20&language=ko', { headers: { 'accept': 'text/plain' } });
  if (!res.ok) throw new Error('Failed to fetch pinned posts');
  const data = await res.json(); return data.posts || data || [];
}

async function fetchPosts({ pageParam = 1, queryKey }: any) {
  const [_key, path, sortBy, searchKeyword, software, selectedTag] = queryKey;
  const categoryMapping: Record<string, string> = { '/notice': '100', '/user-spotlight': '110', '/general': '210', '/challenge': '215', '/project-and-steps': '230', '/tips-and-tricks': '240', '/qna': '220', '/user-feedback': '250', '/job-board': '260', '/community-guide': '130', };
  const catId = categoryMapping[path] || ''; const catQuery = catId ? `&category=${catId}` : '';
  let finalKeyword = searchKeyword || '';
  if (selectedTag) { finalKeyword = finalKeyword ? `${finalKeyword} ${selectedTag}` : selectedTag; }
  const keywordQuery = finalKeyword ? `&keyword=${encodeURIComponent(finalKeyword)}` : '&keyword=';
  let tagsQuery = '';
  if (software === 'CLO') { tagsQuery = '&tags=CLO'; } else if (software === 'MarvelousDesigner') { tagsQuery = '&tags=MavelousDesigner'; }
  const res = await fetch(`https://test-connect-community.api.clo-set.com/api/post/search?sortBy=${sortBy}${keywordQuery}${tagsQuery}&pageSize=24&language=ko&pageNumber=${pageParam}${catQuery}`, { headers: { 'accept': 'text/plain' } });
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json(); return data;
}

async function fetchPopularPosts() {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/search?sortBy=4&keyword=&pageSize=24&language=ko', { headers: { 'accept': 'text/plain' } });
  if (!res.ok) throw new Error('Failed to fetch popular posts');
  const data = await res.json();
  if (!data.posts) return [];
  const sortedPosts = data.posts.sort((a: PostItemData, b: PostItemData) => b.likesCount - a.likesCount); return sortedPosts.slice(0, 4);
}

export default function CommunityPage() {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const softwareRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagsScrollRef = useRef<HTMLDivElement>(null);

  const [currentPath, setCurrentPath] = useState('/');
  const [sortBy, setSortBy] = useState<number>(4);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState('전체');
  const [isSoftwareOpen, setIsSoftwareOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAppExpanded, setIsAppExpanded] = useState(false);
  const [isFamilyExpanded, setIsFamilyExpanded] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(true);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [prevUrl, setPrevUrl] = useState('');

  const sortOptions = [{ label: '최신순', value: 0 }, { label: '추천순', value: 1 }, { label: '최근 활동순', value: 4 },];

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
    if (router.isReady && !selectedPost) {
      const path = router.asPath.split('?')[0];
      setCurrentPath(path || '/');
      const queryTags = router.query.tags as string;
      if (queryTags === 'CLO') setSelectedSoftware('CLO');
      if (queryTags === 'MavelousDesigner') setSelectedSoftware('MarvelousDesigner');
      const queryKeyword = router.query.keyword as string;
      if (queryKeyword) { setActiveKeyword(queryKeyword); setSearchInput(queryKeyword); }
    }
  }, [router.isReady, router.asPath, selectedPost]);

  useEffect(() => {
    if (!router.isReady || selectedPost) return;
    const params = new URLSearchParams();
    if (selectedSoftware === 'CLO') params.set('tags', 'CLO');
    if (selectedSoftware === 'MarvelousDesigner') params.set('tags', 'MavelousDesigner');
    let finalKeyword = activeKeyword;
    if (selectedTag) { finalKeyword = finalKeyword ? `${finalKeyword} ${selectedTag}` : selectedTag; }
    if (finalKeyword) params.set('keyword', finalKeyword);
    const queryString = params.toString();
    const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;
    window.history.replaceState(null, '', newUrl);
  }, [currentPath, selectedSoftware, activeKeyword, selectedTag, router.isReady, selectedPost]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) { setIsSortOpen(false); }
      if (softwareRef.current && !softwareRef.current.contains(event.target as Node)) { setIsSoftwareOpen(false); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkTagsScroll = () => {
    if (tagsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tagsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => checkTagsScroll(), 0);
    window.addEventListener('resize', checkTagsScroll);
    return () => { clearTimeout(timeoutId); window.removeEventListener('resize', checkTagsScroll); };
  }, [selectedSoftware]);

  const scrollTags = (direction: 'left' | 'right') => {
    if (tagsScrollRef.current) {
      const scrollAmount = 150;
      tagsScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth', });
    }
  };

  const handleScrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const tabTitleMap: Record<string, string> = { '/': '전체 게시판', '/notice': '공지사항', '/user-spotlight': '유저 스포트라이트', '/general': '자유 게시판', '/challenge': '챌린지', '/project-and-steps': '프로젝트 & 과정', '/tips-and-tricks': '팁 & 트릭', '/qna': 'QnA', '/user-feedback': '유저 피드백', '/job-board': '구인구직', '/community-guide': '커뮤니티 가이드', };
  const currentTitle = tabTitleMap[currentPath] || '전체 게시판';

  const { data: banners } = useQuery({ queryKey: ['banners'], queryFn: getBanners, });
  const { data: popularPosts } = useQuery({ queryKey: ['popularPosts'], queryFn: fetchPopularPosts, });
  const { data: pinnedPosts } = useQuery({ queryKey: ['pinnedPosts'], queryFn: fetchPinnedPosts, });
  const { data: postData, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['posts', currentPath, sortBy, activeKeyword, selectedSoftware, selectedTag],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => { if (lastPage.posts && lastPage.posts.length === 24) { return pages.length + 1; } return undefined; },
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) { fetchNextPage(); }
    }, { threshold: 0.5 });
    if (loadMoreRef.current) { observer.observe(loadMoreRef.current); }
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  const handlePathClick = (path: string) => { router.push({ pathname: path, query: router.query }, undefined, { shallow: true }); setCurrentPath(path); };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { setActiveKeyword(searchInput); } };

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? '' : tag;
    setSelectedTag(newTag); setSearchInput(newTag); setActiveKeyword(newTag);
    if (newTag) { setTimeout(() => { searchInputRef.current?.focus(); }, 0); }
  };

  const handlePrevPin = () => { if (!pinnedPosts?.length) return; setCurrentPinnedIndex((prev) => (prev === 0 ? pinnedPosts.length - 1 : prev - 1)); };
  const handleNextPin = () => { if (!pinnedPosts?.length) return; setCurrentPinnedIndex((prev) => (prev === pinnedPosts.length - 1 ? 0 : prev + 1)); };

  const handlePostClick = (post: any) => {
    setPrevUrl(window.location.pathname + window.location.search);
    setSelectedPost(post);
    window.history.pushState(null, '', `/community/post/${post.postId}`);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    window.history.pushState(null, '', prevUrl);
  };

  const totalPostCount = postData?.pages?.[0]?.totalCount ?? postData?.pages?.[0]?.posts?.length ?? 0;

  return (
    <DarkBackground>
      <Header openDrawer={() => setIsDrawerOpen(true)} />

      <MobileDrawer
        isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
        isAppExpanded={isAppExpanded} setIsAppExpanded={setIsAppExpanded}
        isFamilyExpanded={isFamilyExpanded} setIsFamilyExpanded={setIsFamilyExpanded}
        isLanguageExpanded={isLanguageExpanded} setIsLanguageExpanded={setIsLanguageExpanded}
      />

      <FilterModalOverlay isOpen={isFilterModalOpen}>
        <FilterModalHeader>
          <FilterModalTitle>FILTER</FilterModalTitle>
          <IconButton onClick={() => setIsFilterModalOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </IconButton>
        </FilterModalHeader>
        <FilterModalBody>
          <FilterBreadcrumb>
            커뮤니티 <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
            <span className="active">{currentTitle === '전체 게시판' ? '전체' : currentTitle}</span>
          </FilterBreadcrumb>
          <FilterSectionTitle>Filter</FilterSectionTitle>
          <FilterGrid>
            {getTagsForSoftware(selectedSoftware).map(tag => (
              <FilterCheckboxLabel key={tag} onClick={() => handleTagClick(tag)}>
                <FilterCheckboxInput type="checkbox" checked={selectedTag === tag} readOnly />
                <FilterCustomCheck checked={selectedTag === tag} />
                {tag}
              </FilterCheckboxLabel>
            ))}
          </FilterGrid>
          <FilterDivider />
          <FilterResetBtn onClick={() => { setSelectedTag(''); setSearchInput(''); setActiveKeyword(''); }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" /></svg>
            초기화
          </FilterResetBtn>
        </FilterModalBody>
      </FilterModalOverlay>

      <Carousel
        banners={banners}
        onPostClick={handlePostClick}
        getCategoryName={getCategoryName}
      />

      <FlexContainer>
        <Sidebar currentPath={currentPath} onPathClick={handlePathClick} />

        <MainPanel
          currentTitle={currentTitle}
          totalPostCount={totalPostCount}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollTags={scrollTags}
          tagsScrollRef={tagsScrollRef}
          checkTagsScroll={checkTagsScroll}
          softwareRef={softwareRef}
          selectedSoftware={selectedSoftware}
          isSoftwareOpen={isSoftwareOpen}
          setIsSoftwareOpen={setIsSoftwareOpen}
          setSelectedSoftware={setSelectedSoftware}
          getTagsForSoftware={getTagsForSoftware}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          handleTagClick={handleTagClick}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          activeKeyword={activeKeyword}
          setActiveKeyword={setActiveKeyword}
          handleSearchKeyDown={handleSearchKeyDown}
          searchInputRef={searchInputRef}
          setIsFilterModalOpen={setIsFilterModalOpen}
          sortRef={sortRef}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isSortOpen={isSortOpen}
          setIsSortOpen={setIsSortOpen}
          sortOptions={sortOptions}
          pinnedPosts={pinnedPosts as PostItemData[]}
          currentPinnedIndex={currentPinnedIndex}
          handlePrevPin={handlePrevPin}
          handleNextPin={handleNextPin}
          handlePostClick={handlePostClick}
          getCategoryBadgeStyle={getCategoryBadgeStyle}
          getCategoryName={getCategoryName}
          status={status}
          postData={postData}
          formatTimeAgo={formatTimeAgo}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
        />

        <RightSidebar
          popularPosts={popularPosts} getCategoryName={getCategoryName}
          formatDateKorean={formatDateKorean} onPostClick={handlePostClick}
        />
      </FlexContainer>

      <FloatingWriteBtn>글쓰기</FloatingWriteBtn>
      <ScrollToTopBtn onClick={handleScrollToTop}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
      </ScrollToTopBtn>

      <Footer />

      {selectedPost && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleCloseModal}>
          <div style={{ backgroundColor: '#111', padding: '24px', maxWidth: '80%', maxHeight: '80vh', overflowY: 'auto', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleCloseModal} style={{ background: 'none', border: '1px solid #333', color: '#fff', padding: '4px 12px', cursor: 'pointer', borderRadius: '4px' }}>닫기</button>
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>{selectedPost.title}</h2>
            {selectedPost.postThumbnail?.path && (<img src={selectedPost.postThumbnail.path} alt="thumbnail" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '4px' }} />)}
          </div>
        </div>
      )}
    </DarkBackground>
  );
}