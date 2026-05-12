import styled from "@emotion/styled";

const RightSidebarWrapper = styled.aside`
  width: 280px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  @media (max-width: 1439px) {
    display: none;
  }
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

interface RightSidebarProps {
  popularPosts: any[] | undefined;
  getCategoryName: (id: number) => string;
  formatDateKorean: (date: string) => string;
  onPostClick: (post: any) => void;
}

export default function RightSidebar({
  popularPosts,
  getCategoryName,
  formatDateKorean,
  onPostClick,
}: RightSidebarProps) {
  return (
    <RightSidebarWrapper>
      <RightSidebarTitle>인기 게시글</RightSidebarTitle>
      {popularPosts &&
        popularPosts.map((post) => (
          <PopularPostItem key={post.postId} onClick={() => onPostClick(post)}>
            <PopularCategory>{getCategoryName(post.category)}</PopularCategory>
            <PopularTitle>{post.title}</PopularTitle>
            <PopularMeta>
              {post.creatorName} | {formatDateKorean(post.registeredDate)}
            </PopularMeta>
          </PopularPostItem>
        ))}
    </RightSidebarWrapper>
  );
}
