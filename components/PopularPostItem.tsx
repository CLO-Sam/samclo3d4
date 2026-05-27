import styled from "@emotion/styled";
import { getCategoryName, formatDateKorean } from "../utils/helper";

const ItemWrapper = styled.div`
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

export interface PopularPostData {
  postId: string;
  title: string;
  category: number;
  creatorName: string;
  registeredDate: string;
}

interface PopularPostItemProps {
  post: PopularPostData;
  onClick: () => void;
}

export default function PopularPostItem({
  post,
  onClick,
}: PopularPostItemProps) {
  return (
    <ItemWrapper onClick={onClick}>
      <PopularCategory>{getCategoryName(post.category)}</PopularCategory>
      <PopularTitle>{post.title}</PopularTitle>
      <PopularMeta>
        {post.creatorName} | {formatDateKorean(post.registeredDate)}
      </PopularMeta>
    </ItemWrapper>
  );
}
