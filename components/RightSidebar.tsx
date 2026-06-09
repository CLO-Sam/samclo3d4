import styled from "@emotion/styled";
import PopularPostItem, { PopularPostData } from "./PopularPostItem";

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

interface RightSidebarProps {
  popularPosts: PopularPostData[] | undefined;
  onPostClick: (post: PopularPostData) => void;
}

export default function RightSidebar({
  popularPosts,
  onPostClick,
}: RightSidebarProps) {
  return (
    <RightSidebarWrapper>
      <RightSidebarTitle>인기 게시글</RightSidebarTitle>
      {popularPosts &&
        popularPosts.map((post) => (
          <PopularPostItem
            key={post.postId}
            post={post}
            onClick={() => onPostClick(post)}
          />
        ))}
    </RightSidebarWrapper>
  );
}
