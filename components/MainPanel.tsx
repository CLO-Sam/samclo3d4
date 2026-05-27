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
} from "../store/filterSlice";
import { SOFTWARE_OPTIONS } from "../constants/navigation";

import BoardHeader from "./BoardHeader";
import PinnedPost from "./PinnedPost";
import PostItem, { PostItemData } from "./PostItem";

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
  ${(props) => (props.position === "left" ? "left: 0;" : "right: 0;")} top: 50%;
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
const BoardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  @media (max-width: 767px) {
    padding-top: 0;
  }
`;
const PostListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface MainPanelProps {
  currentTitle: string;
  totalPostCount: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTags: (direction: "left" | "right") => void;
  tagsScrollRef: React.RefObject<HTMLDivElement>;
  checkTagsScroll: () => void;
  getTagsForSoftware: (software: string) => string[];
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  pinnedPosts: PostItemData[];
  currentPinnedIndex: number;
  handlePrevPin: () => void;
  handleNextPin: () => void;
  handlePostClick: (post: any) => void;
  status: "pending" | "error" | "success";
  postData: any;
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
  handleSearchKeyDown,
  searchInputRef,
  pinnedPosts,
  currentPinnedIndex,
  handlePrevPin,
  handleNextPin,
  handlePostClick,
  status,
  postData,
  loadMoreRef,
  isFetchingNextPage,
}: MainPanelProps) {
  const dispatch = useDispatch();
  const { selectedSoftware, selectedTag, searchInput } = useSelector(
    (state: RootState) => state.filter,
  );

  const [isSoftwareOpen, setIsSoftwareOpen] = useState(false);
  const softwareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        softwareRef.current &&
        !softwareRef.current.contains(event.target as Node)
      ) {
        setIsSoftwareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <MainPanelWrapper>
      <TopFilterBar>
        <SoftwareSelectWrapper ref={softwareRef}>
          <SoftwareButton
            isActive={selectedSoftware !== "전체"}
            onClick={() => setIsSoftwareOpen(!isSoftwareOpen)}
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
            {SOFTWARE_OPTIONS.map((opt) => (
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
                  dispatch(setSearchInput(""));
                  dispatch(setActiveKeyword(""));
                  dispatch(setSelectedTag(""));
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
        <BoardHeader
          currentTitle={currentTitle}
          totalPostCount={totalPostCount}
        />

        <BoardBody>
          <PinnedPost
            posts={pinnedPosts}
            currentIndex={currentPinnedIndex}
            onPostClick={handlePostClick}
            onPrev={handlePrevPin}
            onNext={handleNextPin}
          />

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
                    page.posts.map((post: PostItemData) => (
                      <PostItem
                        key={post.postId}
                        post={post}
                        onClick={handlePostClick}
                      />
                    ))}
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
