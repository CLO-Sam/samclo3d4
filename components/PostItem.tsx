import React from "react";
import styled from "@emotion/styled";
import {
  getCategoryName,
  getCategoryBadgeStyle,
  formatTimeAgo,
} from "../utils/helper";

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

export interface PostItemData {
  // MainPanel에서도 쓰라고 export!
  postId: string;
  title: string;
  summary: string;
  category: number;
  creatorName: string;
  creatorThumbnailPath: string;
  postThumbnail: { path: string; width: number; height: number };
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  registeredDate: string;
}

interface PostItemProps {
  post: PostItemData;
  onClick: (post: PostItemData) => void;
}

export default function PostItem({ post, onClick }: PostItemProps) {
  const badgeStyle = getCategoryBadgeStyle(post.category);
  const avatarImg =
    post.creatorThumbnailPath ||
    `https://picsum.photos/seed/${post.creatorName}/50/50`;
  const thumbImg = post.postThumbnail?.path;

  return (
    <PostListItem onClick={() => onClick(post)}>
      <PostContentArea>
        <SmallBadge
          style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color }}
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
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          <span>{post.viewCount}</span>
          <span style={{ marginLeft: "4px" }}></span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
          </svg>
          <span>{post.likesCount}</span>
          <span style={{ marginLeft: "4px" }}></span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
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
}
