import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { RootState } from "../store/store";
import { openFilterModal } from "../store/uiSlice";
import {
  setSelectedSoftware,
  setSelectedTag,
  setSearchInput,
  setActiveKeyword,
} from "../store/filterSlice";
import MainPanel from "../components/MainPanel";
import { PostItemData } from "../components/PostItem";

// --- API 데이터 패칭 함수들 ---
async function fetchPinnedPosts(): Promise<PostItemData[]> {
  const res = await fetch(
    "https://test-connect-community.api.clo-set.com/api/post/pins?pinType=20&language=ko",
    { headers: { accept: "text/plain" } },
  );
  if (!res.ok) throw new Error("Failed to fetch pinned posts");
  const data = await res.json();
  return data.posts || data || [];
}

async function fetchPosts({ pageParam = 1, queryKey }: any) {
  const [_key, path, sortBy, searchKeyword, software, selectedTag] = queryKey;
  const categoryMapping: Record<string, string> = {
    "/notice": "100",
    "/user-spotlight": "110",
    "/general": "210",
    "/challenge": "215",
    "/project-and-steps": "230",
    "/tips-and-tricks": "240",
    "/qna": "220",
    "/user-feedback": "250",
    "/job-board": "260",
    "/community-guide": "130",
  };
  const catId = categoryMapping[path] || "";
  const catQuery = catId ? `&category=${catId}` : "";
  let finalKeyword = searchKeyword || "";
  if (selectedTag) {
    finalKeyword = finalKeyword
      ? `${finalKeyword} ${selectedTag}`
      : selectedTag;
  }
  const keywordQuery = finalKeyword
    ? `&keyword=${encodeURIComponent(finalKeyword)}`
    : "&keyword=";
  let tagsQuery = "";
  if (software === "CLO") tagsQuery = "&tags=CLO";
  else if (software === "MarvelousDesigner")
    tagsQuery = "&tags=MavelousDesigner";

  const res = await fetch(
    `https://test-connect-community.api.clo-set.com/api/post/search?sortBy=${sortBy}${keywordQuery}${tagsQuery}&pageSize=24&language=ko&pageNumber=${pageParam}${catQuery}`,
    { headers: { accept: "text/plain" } },
  );
  if (!res.ok) throw new Error("Failed to fetch posts");
  return await res.json();
}

export default function PostListContainer() {
  const router = useRouter();
  const currentPath = router.asPath.split("?")[0] || "/";
  const dispatch = useDispatch();

  // 1. Redux 상태 가져오기
  const { selectedSoftware, selectedTag, searchInput, activeKeyword, sortBy } =
    useSelector((state: RootState) => state.filter);

  // 2. UI 및 스크롤 상태
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagsScrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 3. React Query로 데이터 불러오기 (상단 공지 & 메인 게시글)
  const { data: pinnedPosts } = useQuery({
    queryKey: ["pinnedPosts"],
    queryFn: fetchPinnedPosts,
  });

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [
      "posts",
      currentPath,
      sortBy,
      activeKeyword,
      selectedSoftware,
      selectedTag,
    ],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.posts && lastPage.posts.length === 24)
        return pages.length + 1;
      return undefined;
    },
  });

  // 4. 무한 스크롤 옵저버 세팅
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 5. 각종 기능 및 핸들러 함수들
  const checkTagsScroll = () => {
    if (tagsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tagsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => checkTagsScroll(), 0);
    window.addEventListener("resize", checkTagsScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkTagsScroll);
    };
  }, [selectedSoftware]);

  const scrollTags = (direction: "left" | "right") => {
    if (tagsScrollRef.current) {
      const scrollAmount = 150;
      tagsScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") dispatch(setActiveKeyword(searchInput));
  };

  const handleSoftwareChange = (opt: string) =>
    dispatch(setSelectedSoftware(opt));

  const handleTagChange = (tag: string) => {
    const newTag = selectedTag === tag ? "" : tag;
    dispatch(setSelectedTag(newTag));
    dispatch(setSearchInput(newTag));
    dispatch(setActiveKeyword(newTag));
    if (newTag) setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const handleSearchChange = (val: string) => dispatch(setSearchInput(val));

  const handleClearSearch = () => {
    dispatch(setSearchInput(""));
    dispatch(setActiveKeyword(""));
    dispatch(setSelectedTag(""));
  };

  const handleOpenFilterModal = () => dispatch(openFilterModal());

  const handlePrevPin = () => {
    if (!pinnedPosts?.length) return;
    setCurrentPinnedIndex((prev) =>
      prev === 0 ? pinnedPosts.length - 1 : prev - 1,
    );
  };

  const handleNextPin = () => {
    if (!pinnedPosts?.length) return;
    setCurrentPinnedIndex((prev) =>
      prev === pinnedPosts.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePostClick = (post: any) => {
    // 임시 로그. 추후 라우팅 로직이나 모달 열기 로직 추가
    console.log("포스트 클릭:", post.title);
  };

  const tabTitleMap: Record<string, string> = {
    "/": "전체 게시판",
    "/notice": "공지사항",
    "/user-spotlight": "유저 스포트라이트",
    "/general": "자유 게시판",
    "/challenge": "챌린지",
    "/project-and-steps": "프로젝트 & 과정",
    "/tips-and-tricks": "팁 & 트릭",
    "/qna": "QnA",
    "/user-feedback": "유저 피드백",
    "/job-board": "구인구직",
    "/community-guide": "커뮤니티 가이드",
  };
  const currentTitle = tabTitleMap[currentPath] || "전체 게시판";
  const totalPostCount =
    postData?.pages?.[0]?.totalCount ??
    postData?.pages?.[0]?.posts?.length ??
    0;

  // 6. 계산된 모든 데이터를 예쁜 얼굴(MainPanel)로 전달!
  return (
    <MainPanel
      currentTitle={currentTitle}
      totalPostCount={totalPostCount}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
      scrollTags={scrollTags}
      tagsScrollRef={tagsScrollRef}
      checkTagsScroll={checkTagsScroll}
      handleSearchKeyDown={handleSearchKeyDown}
      searchInputRef={searchInputRef}
      pinnedPosts={pinnedPosts as PostItemData[]}
      currentPinnedIndex={currentPinnedIndex}
      handlePrevPin={handlePrevPin}
      handleNextPin={handleNextPin}
      handlePostClick={handlePostClick}
      status={status}
      postData={postData}
      loadMoreRef={loadMoreRef}
      isFetchingNextPage={isFetchingNextPage}
      selectedSoftware={selectedSoftware}
      selectedTag={selectedTag}
      searchInput={searchInput}
      onSoftwareChange={handleSoftwareChange}
      onTagChange={handleTagChange}
      onSearchChange={handleSearchChange}
      onClearSearch={handleClearSearch}
      onOpenFilterModal={handleOpenFilterModal}
    />
  );
}
