import React from "react";
import styled from "@emotion/styled";
import { getCategoryName, getCategoryBadgeStyle } from "../utils/helper";

const Wrapper = styled.div`
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
const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

interface PinnedPostProps {
  posts: any[];
  currentIndex: number;
  onPostClick: (post: any) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function PinnedPost({
  posts,
  currentIndex,
  onPostClick,
  onPrev,
  onNext,
}: PinnedPostProps) {
  if (!posts || posts.length === 0) return null;
  const currentPost = posts[currentIndex];

  return (
    <Wrapper onClick={() => onPostClick(currentPost)}>
      <LeftArea>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="#a1a1aa"
          style={{ transform: "rotate(-45deg)" }}
        >
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              color: getCategoryBadgeStyle(currentPost.category).color,
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {getCategoryName(currentPost.category)}
          </span>
          <span style={{ color: "#fff", fontSize: "15px", fontWeight: "bold" }}>
            {currentPost.title}
          </span>
        </div>
      </LeftArea>

      {posts.length > 1 && (
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
              onPrev();
            }}
          >
            {"<"}
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            {">"}
          </span>
        </div>
      )}
    </Wrapper>
  );
}
