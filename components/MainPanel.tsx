import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { openFilterModal } from "../store/uiSlice";
import {
  setSelectedSoftware,
  setSelectedTag,
  setSearchInput,
  setActiveKeyword,
  setSortBy,
} from "../store/filterSlice";

const MainPanelWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  @media (max-width: 1439px) {
    padding: 24px 20px;
  }
`;

const TopFilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 16px;

  @media (max-width: 767px) {
    flex-direction: row;
    gap: 12px;
  }
`;

const TopFilterScrollWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  overflow: hidden;

  @media (max-width: 767px) {
    display: none;
  }
`;

const TopFilterScrollContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  width: 100%;
  flex-wrap: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FadeLeft = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  background: linear-gradient(to right, #131315 30%, transparent);
  pointer-events: none;
  z-index: 5;
`;

const FadeRight = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  background: linear-gradient(to left, #131315 30%, transparent);
  pointer-events: none;
  z-index: 5;
`;

const ScrollArrowBtn = styled.button<{ position: "left" | "right" }>`
  position: absolute;
  ${(props) => (props.position === "left" ? "left: 0;" : "right: 0;")}
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1c1c1f;
  border: 1px solid #3f3f46;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: #27272a;
  }
`;

const SoftwareSelectWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const SoftwareButton = styled.button<{ isActive?: boolean }>`
  background-color: transparent;
  border: 1px solid ${(props) => (props.isActive ? "#55e6c1" : "#3f3f46")};
  color: ${(props) => (props.isActive ? "#55e6c1" : "#a1a1aa")};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => (props.isActive ? "#55e6c1" : "#71717a")};
  }
`;

const SoftwareDropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
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
  background-color: ${(props) => (props.active ? "#1c3d3f" : "transparent")};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#1c3d3f" : "#3f3f46")};
  }
`;

const TopFilterDivider = styled.div`
  width: 1px;
  height: 14px;
  background-color: #3f3f46;
  flex-shrink: 0;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const TagBtn = styled.button<{ active?: boolean }>`
  background-color: ${(props) => (props.active ? "#3f3f46" : "#27272a")};
  border: 1px solid ${(props) => (props.active ? "#55e6c1" : "transparent")};
  padding: 6px 12px;
  border-radius: 6px;
  color: ${(props) => (props.active ? "#55e6c1" : "#a1a1aa")};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3f3f46;
    color: #fff;
  }
`;

const SearchAreaMobileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const SearchInputBox = styled.div<{ hasValue?: boolean }>`
  background-color: #27272a;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 240px;
  flex-shrink: 0;
  border: 1px solid ${(props) => (props.hasValue ? "#55e6c1" : "transparent")};
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #55e6c1;
  }

  &:focus-within svg.search-icon,
  ${(props) => (props.hasValue ? "& svg.search-icon { fill: #ffffff; }" : "")}
    @media
    (max-width: 767px) {
    flex: 1;
    width: auto;
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

const ClearInputBtn = styled.button`
  background: none;
  border: none;
  color: #a1a1aa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: #ffffff;
  }
`;

const FilterIconBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  align-items: center;
  justify-content: center;

  @media (max-width: 767px) {
    display: flex;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const BoardContainer = styled.div`
  background-color: #1c1c1f;
  border-radius: 12px;
  border: 1px solid #2b2b30;
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    background-color: transparent;
    border: none;
    border-radius: 0;
  }
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px 16px 48px;
  border-bottom: 1px solid #2b2b30;

  @media (max-width: 1439px) {
    padding: 20px 24px 16px 24px;
  }

  @media (max-width: 767px) {
    padding: 16px 0;
  }
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

const BoardTitleText = styled.span`
  @media (max-width: 767px) {
    display: none;
  }
`;

const BoardTitleSub = styled.span<{ alwaysShowMobile?: boolean }>`
  color: #a1a1aa;
  font-size: 14px;
  font-weight: normal;

  @media (max-width: 767px) {
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    display: ${(props) => (props.alwaysShowMobile ? "inline" : "none")};
  }
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
  display: ${(props) => (props.isOpen ? "flex" : "none")};
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
  background-color: ${(props) => (props.active ? "#1c3d3f" : "transparent")};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#1c3d3f" : "#3f3f46")};
  }
`;

const BoardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 24px;

  @media (max-width: 767px) {
    padding-top: 0;
  }
`;

const PinnedPost = styled.div`
  padding: 16px 20px;
  margin: 0 48px 24px 48px;
  background-color: #27272a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  @media (max-width: 1439px) {
    margin: 0 24px 24px 24px;
  }

  @media (max-width: 767px) {
    margin: 16px 0;
  }
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

  @media (max-width: 1439px) {
    margin: 0 24px;
  }

  @media (max-width: 767px) {
    margin: 0;
    padding: 20px 0;
  }

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

interface MainPanelProps {
  currentTitle: string;
  totalPostCount: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTags: (direction: "left" | "right") => void;
  tagsScrollRef: React.RefObject<HTMLDivElement>;
  checkTagsScroll: () => void;
  getTagsForSoftware: (software: string) => string[];
  handleTagClick: (tag: string) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  sortOptions: { label: string; value: number }[];
  pinnedPosts: PostItemData[];
  currentPinnedIndex: number;
  handlePrevPin: () => void;
  handleNextPin: () => void;
  handlePostClick: (post: any) => void;
  getCategoryBadgeStyle: (id: number) => { bg: string; color: string };
  getCategoryName: (id: number) => string;
  status: "pending" | "error" | "success";
  postData: any;
  formatTimeAgo: (date: string) => string;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  isFetchingNextPage: boolean;
}

export default function MainPanel({
  currentTitle,
  totalPostCount,
  canScrollLeft,
  canScrollRight,
  scrollTags,
  tagsScrollRef,
  checkTagsScroll,
  getTagsForSoftware,
  handleTagClick,
  handleSearchKeyDown,
  searchInputRef,
  sortOptions,
  pinnedPosts,
  currentPinnedIndex,
  handlePrevPin,
  handleNextPin,
  handlePostClick,
  getCategoryBadgeStyle,
  getCategoryName,
  status,
  postData,
  formatTimeAgo,
  loadMoreRef,
  isFetchingNextPage,
}: MainPanelProps) {
  const dispatch = useDispatch();
  const { selectedSoftware, selectedTag, searchInput, activeKeyword, sortBy } =
    useSelector((state: RootState) => state.filter);
  const [isSoftwareOpen, setIsSoftwareOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const softwareRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("CCTV 감지! 클릭된 타겟:", event.target);

      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        console.log("👉 정렬 바깥 클릭됨. 정렬 드롭다운 닫음!");
        setIsSortOpen(false);
      }
      if (
        softwareRef.current &&
        !softwareRef.current.contains(event.target as Node)
      ) {
        console.log("👉 소프트웨어 바깥 클릭됨. 소프트웨어 드롭다운 닫음!");
        setIsSoftwareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log("렌더링 됨! 현재 스위치 상태:", isSoftwareOpen);
  return (
    <MainPanelWrapper>
      <TopFilterBar>
        <SoftwareSelectWrapper ref={softwareRef}>
          <SoftwareButton
            isActive={selectedSoftware !== "전체"}
            onClick={() => {
              console.log(
                "버튼 클릭됨! 현재 상태:",
                isSoftwareOpen,
                "👉 바꿀 상태:",
                !isSoftwareOpen,
              );
              setIsSoftwareOpen(!isSoftwareOpen);
            }}
          >
            {selectedSoftware === "전체" ? (
              <>
                <span style={{ color: "#a1a1aa" }}>소프트웨어</span>
                <span style={{ color: "#3f3f46", margin: "0 12px" }}>|</span>
                <span style={{ color: "#fff" }}>전체</span>
              </>
            ) : (
              <span>
                {selectedSoftware === "CLO" ? "CLO" : "Marvelous Designer"}
              </span>
            )}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </SoftwareButton>

          <SoftwareDropdownMenu isOpen={isSoftwareOpen}>
            {["전체", "CLO", "MarvelousDesigner"].map((opt) => (
              <SoftwareDropdownItem
                key={opt}
                active={selectedSoftware === opt}
                onClick={() => {
                  dispatch(setSelectedSoftware(opt));
                  setIsSoftwareOpen(false);
                }}
              >
                {opt === "MarvelousDesigner" ? "Marvelous Designer" : opt}
              </SoftwareDropdownItem>
            ))}
          </SoftwareDropdownMenu>
        </SoftwareSelectWrapper>
        <TopFilterDivider />
        <TopFilterScrollWrapper>
          {canScrollLeft && (
            <>
              <FadeLeft />
              <ScrollArrowBtn
                position="left"
                onClick={() => scrollTags("left")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </ScrollArrowBtn>
            </>
          )}

          <TopFilterScrollContainer
            ref={tagsScrollRef}
            onScroll={checkTagsScroll}
          >
            <TagList>
              {getTagsForSoftware(selectedSoftware).map((tag) => (
                <TagBtn
                  key={tag}
                  active={selectedTag === tag}
                  onClick={() => dispatch(setSelectedTag(tag))}
                >
                  {tag}
                </TagBtn>
              ))}
            </TagList>
          </TopFilterScrollContainer>

          {canScrollRight && (
            <>
              <FadeRight />
              <ScrollArrowBtn
                position="right"
                onClick={() => scrollTags("right")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </ScrollArrowBtn>
            </>
          )}
        </TopFilterScrollWrapper>

        <SearchAreaMobileWrapper>
          <SearchInputBox hasValue={searchInput.length > 0}>
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="#a1a1aa"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <SearchInput
              ref={searchInputRef}
              placeholder={`${currentTitle}에서 검색`}
              value={searchInput}
              onChange={(e) => dispatch(setSearchInput(e.target.value))}
              onKeyDown={handleSearchKeyDown}
            />
            {searchInput.length > 0 && (
              <ClearInputBtn
                onClick={() => {
                  setSearchInput("");
                  setActiveKeyword("");
                  setSelectedTag("");
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </ClearInputBtn>
            )}
          </SearchInputBox>

          <FilterIconBtn onClick={() => dispatch(openFilterModal())}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
            </svg>
          </FilterIconBtn>
        </SearchAreaMobileWrapper>
      </TopFilterBar>

      <BoardContainer>
        <BoardHeader>
          <BoardTitle>
            <BoardTitleText>{currentTitle}</BoardTitleText>
            <BoardTitleSub alwaysShowMobile>
              {totalPostCount} 게시글
            </BoardTitleSub>
          </BoardTitle>
          <BoardHeaderRight ref={sortRef}>
            <SortButton onClick={() => setIsSortOpen(!isSortOpen)}>
              {sortOptions.find((opt) => opt.value === sortBy)?.label}
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M7 10l5 5 5-5z" />
              </svg>
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
          {pinnedPosts && pinnedPosts.length > 0 && (
            <PinnedPost
              onClick={() => handlePostClick(pinnedPosts[currentPinnedIndex])}
            >
              <PinnedLeft>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="#a1a1aa"
                  style={{ transform: "rotate(-45deg)" }}
                >
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      color: getCategoryBadgeStyle(
                        pinnedPosts[currentPinnedIndex].category,
                      ).color,
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {getCategoryName(pinnedPosts[currentPinnedIndex].category)}
                  </span>
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {pinnedPosts[currentPinnedIndex].title}
                  </span>
                </div>
              </PinnedLeft>
              {pinnedPosts.length > 1 && (
                <div
                  style={{
                    color: "#a1a1aa",
                    display: "flex",
                    gap: "16px",
                    fontWeight: "bold",
                    userSelect: "none",
                  }}
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevPin();
                    }}
                  >
                    {"<"}
                  </span>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPin();
                    }}
                  >
                    {">"}
                  </span>
                </div>
              )}
            </PinnedPost>
          )}

          <PostListWrapper>
            {status === "pending" ? (
              <div
                style={{
                  padding: "24px",
                  color: "#a1a1aa",
                  textAlign: "center",
                }}
              >
                데이터를 불러오는 중...
              </div>
            ) : status === "error" ? (
              <div
                style={{
                  padding: "24px",
                  color: "#ff6b6b",
                  textAlign: "center",
                }}
              >
                데이터를 불러오지 못했습니다.
              </div>
            ) : (
              postData?.pages.map((page: any, pageIndex: number) => (
                <div key={pageIndex}>
                  {page.posts &&
                    page.posts.map((post: PostItemData) => {
                      const badgeStyle = getCategoryBadgeStyle(post.category);
                      const avatarImg =
                        post.creatorThumbnailPath ||
                        `https://picsum.photos/seed/${post.creatorName}/50/50`;
                      const thumbImg = post.postThumbnail?.path;

                      return (
                        <PostListItem
                          key={post.postId}
                          onClick={() => handlePostClick(post)}
                        >
                          <PostContentArea>
                            <SmallBadge
                              style={{
                                backgroundColor: badgeStyle.bg,
                                color: badgeStyle.color,
                              }}
                            >
                              {getCategoryName(post.category)}
                            </SmallBadge>
                            <ItemTitle>{post.title}</ItemTitle>
                            <ItemSummary>{post.summary}</ItemSummary>

                            <ItemMeta>
                              <SmallAvatar bg={avatarImg} />
                              <span>{post.creatorName}</span>
                              <span>·</span>
                              <span>{formatTimeAgo(post.registeredDate)}</span>
                              <span style={{ marginLeft: "12px" }}></span>
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="currentColor"
                              >
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                              </svg>
                              <span>{post.viewCount}</span>
                              <span style={{ marginLeft: "4px" }}></span>
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="currentColor"
                              >
                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                              </svg>
                              <span>{post.likesCount}</span>
                              <span style={{ marginLeft: "4px" }}></span>
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="currentColor"
                              >
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                              </svg>
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

            <div ref={loadMoreRef} style={{ height: "20px" }}>
              {isFetchingNextPage && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#a1a1aa",
                  }}
                >
                  추가 데이터를 불러오는 중...
                </div>
              )}
            </div>
          </PostListWrapper>
        </BoardBody>
      </BoardContainer>
    </MainPanelWrapper>
  );
}
