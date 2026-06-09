import { useRef } from "react";
import styled from "@emotion/styled";
import { getCategoryName } from "../utils/helper";

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
    ${CardHoverOverlay} {
      opacity: 1;
    }
  }
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

const CreatorAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #444;
`;

const CreatorName = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`;

const CarouselNavBtn = styled.button<{ direction: "left" | "right" }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.direction === "left" ? "left: 5px;" : "right: 5px;")}
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

export interface BannerPost {
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

interface CarouselProps {
  banners: BannerPost[] | undefined;
  onPostClick: (post: BannerPost) => void;
}

export default function Carousel({ banners, onPostClick }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (trackRef.current) {
      const scrollAmount = 360;
      trackRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!banners || banners.length === 0) return null;

  return (
    <CarouselWrapper>
      <CarouselNavBtn direction="left" onClick={() => scrollCarousel("left")}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </CarouselNavBtn>

      <CarouselTrack ref={trackRef}>
        {banners.map((item) => {
          const bgImage =
            item.postThumbnail?.path ||
            `https://picsum.photos/seed/${item.postId.slice(0, 5)}/400/500`;
          const avatarImage =
            item.creatorThumbnailPath ||
            `https://picsum.photos/seed/${item.creatorName}/100/100`;

          return (
            <CarouselCard
              key={item.postId}
              bg={bgImage}
              onClick={() => onPostClick(item)}
            >
              <CardHoverOverlay>
                <CategoryBadge>{getCategoryName(item.category)}</CategoryBadge>

                <CardBottomInfo>
                  <CardTitle>{item.title}</CardTitle>
                  {item.summary && <CardSummary>{item.summary}</CardSummary>}
                  <CreatorInfo>
                    <CreatorAvatar
                      src={avatarImage}
                      alt={`${item.creatorName} 프로필`}
                    />
                    <CreatorName>{item.creatorName}</CreatorName>
                  </CreatorInfo>
                </CardBottomInfo>
              </CardHoverOverlay>
            </CarouselCard>
          );
        })}
      </CarouselTrack>

      <CarouselNavBtn direction="right" onClick={() => scrollCarousel("right")}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </CarouselNavBtn>
    </CarouselWrapper>
  );
}
