import React from "react";
import styled from "@emotion/styled";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import MobileDrawer from "../components/MobileDrawer";

import CarouselContainer from "../containers/CarouselContainer";
import PostListContainer from "../containers/PostListContainer";
import PopularPostContainer from "../containers/PopularPostContainer";

const DarkBackground = styled.div`
  background-color: #131315;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 32px;
`;

const FlexContainer = styled.div`
  display: flex;
  max-width: 1440px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 96px 232px;
  gap: 32px;
  flex: 1;
  @media (max-width: 1439px) {
    flex-direction: column;
    padding: 0 0 232px;
    gap: 0;
  }
`;

const FloatingWriteBtn = styled.button`
  position: fixed;
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  color: #000000;
  padding: 12px 32px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 15px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 50;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ScrollToTopBtn = styled.button`
  position: fixed;
  bottom: 56px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1c1c1f;
  border: 1px solid #3f3f46;
  color: #fff;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
  @media (max-width: 1439px) {
    display: flex;
  }
  &:hover {
    background-color: #27272a;
  }
`;

export default function CommunityPage() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DarkBackground>
      <Header />

      <MobileDrawer />

      <CarouselContainer />

      <FlexContainer>
        <Sidebar />

        <PostListContainer />

        <PopularPostContainer />
      </FlexContainer>

      <FloatingWriteBtn>글쓰기</FloatingWriteBtn>

      <ScrollToTopBtn onClick={handleScrollToTop}>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </ScrollToTopBtn>

      <Footer />
    </DarkBackground>
  );
}
