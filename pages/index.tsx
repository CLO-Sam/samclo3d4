import { useRouter } from 'next/router';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface BannerPost {
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

const DarkBackground = styled.div`
  background-color: #131315;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 32px;
`;

const HeaderContainer = styled.header`
  background-color: #000000;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #222;
`;

const LeftNavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const DesktopNavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 1199px) {
    display: none;
  }
`;

const DesktopAuthGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 1199px) {
    display: none;
  }
`;

const MobileNavGroup = styled.div`
  display: none;
  align-items: center;
  gap: 20px;

  @media (max-width: 1199px) {
    display: flex;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    color: #a1a1aa;
  }
`;

const ConnectLogo = styled.span`
  display: inline-block;
  width: 80px;
  height: 16px;
  background: url('https://storagefiles.clo-set.com/public/connect/common/connect-desktop-header-bi.svg') no-repeat;
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${(props) => (props.active ? '#ffffff' : '#aaaaaa')};
  text-decoration: none;
  font-size: 15px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  
  &:hover {
    color: #ffffff;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 60px;
  cursor: pointer;

  .dropdown-menu {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    background-color: #000000;
    border: 1px solid #333;
    padding: 10px 0;
    min-width: 160px;
    z-index: 100;
  }

  .arrow-up {
    display: none;
  }

  &:hover {
    color: #00e5ff;
    
    .dropdown-menu {
      display: flex;
      flex-direction: column;
    }
    .dropdown-title {
      color: #00e5ff;
    }
    .arrow-down {
      display: none;
    }
    .arrow-up {
      display: inline-block;
      fill: #00e5ff;
    }
  }
`;

const DropdownTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #aaaaaa;
  font-size: 15px;
  font-weight: bold;
`;

const DropdownItem = styled(Link)`
  color: #cccccc;
  text-decoration: none;
  padding: 12px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    color: #ffffff;
    background-color: #1a1a1a;
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 16px;
  background-color: #333333;
`;

const LoginLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
`;

const SignUpButton = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  border: 1px solid #ffffff;
  border-radius: 20px;
  padding: 6px 16px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const GridIconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  color: #aaaaaa;

  &:hover {
    color: #ffffff;
  }
`;

// --- Mobile Drawer Styled Components ---
const DrawerBackdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  transition: opacity 0.3s ease;
`;

const DrawerContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background-color: #27272a;
  z-index: 1000;
  transform: translateX(${(props) => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: -4px 0 16px rgba(0,0,0,0.5);

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #3f3f46;
`;

const DrawerProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DrawerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3f3f46;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
`;

const DrawerLoginBtn = styled.button`
  background: transparent;
  border: 1px solid #52525b;
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background-color: #3f3f46;
  }
`;

const DrawerItem = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  color: ${(props) => (props.active ? '#ffffff' : '#d4d4d8')};
  text-decoration: none;
  font-size: 15px;
  background-color: ${(props) => (props.active ? '#3f3f46' : 'transparent')};
  border-left: 3px solid ${(props) => (props.active ? '#55e6c1' : 'transparent')};

  &:hover {
    background-color: #3f3f46;
  }
`;

const DrawerAccordionBtn = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  color: ${(props) => (props.active ? '#ffffff' : '#d4d4d8')};
  font-size: 15px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? '#3f3f46' : 'transparent')};
  border-left: 3px solid ${(props) => (props.active ? '#55e6c1' : 'transparent')};

  &:hover {
    background-color: #3f3f46;
  }
`;

const DrawerSubMenu = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1c1c1f;
`;

const DrawerSubItem = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 14px 24px 14px 40px;
  color: ${(props) => (props.active ? '#ffffff' : '#a1a1aa')};
  text-decoration: none;
  font-size: 14px;
  border-left: 3px solid ${(props) => (props.active ? '#55e6c1' : 'transparent')};

  &:hover {
    color: #ffffff;
    background-color: #27272a;
  }
`;

// --- Mobile Filter Modal Styled Components ---
const FilterModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  z-index: 2000;
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
`;

const FilterModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
`;

const FilterModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #fff;
  letter-spacing: 2px;
`;

const FilterModalBody = styled.div`
  flex: 1;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
`;

const FilterBreadcrumb = styled.div`
  color: #a1a1aa;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  
  span.active {
    color: #fff;
  }
`;

const FilterSectionTitle = styled.div`
  color: #a1a1aa;
  font-size: 14px;
  margin-bottom: 16px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
`;

const FilterCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  user-select: none;
`;

const FilterCheckboxInput = styled.input`
  display: none;
`;

const FilterCustomCheck = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${(props) => (props.checked ? '#55e6c1' : '#3f3f46')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${(props) => (props.checked ? 'block' : 'none')};
    width: 4px;
    height: 10px;
    border: solid #131315;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
  }
`;

const FilterDivider = styled.div`
  height: 1px;
  background-color: #2b2b30;
  width: 100%;
  margin-bottom: 24px;
`;

const FilterResetBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
  }
`;


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
    
    .hover-content {
      opacity: 1;
    }
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

const CreatorAvatar = styled.div<{ bg: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: url(${(props) => props.bg}) center/cover no-repeat;
  background-color: #444;
`;

const CreatorName = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`;

const CarouselNavBtn = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.direction === 'left' ? 'left: 5px;' : 'right: 5px;')}
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

const SidebarWrapper = styled.aside`
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;

  @media (max-width: 1439px) {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 0 20px;
    border-bottom: 1px solid #2b2b30;
    gap: 0;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SidebarDivider = styled.hr`
  border: 0;
  border-top: 1px solid #2b2b30;
  margin: 0;
  width: 100%;

  @media (max-width: 1439px) {
    display: none;
  }
`;

const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 1439px) {
    flex-direction: row;
    gap: 0;
  }
`;

const SidebarGroupTitle = styled.div`
  color: #a1a1aa;
  font-size: 14px;
  font-weight: bold;

  @media (max-width: 1439px) {
    display: none;
  }
`;

const SidebarItemBtn = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 0 0 0 16px;
  color: ${(props) => (props.active ? '#ffffff' : '#a1a1aa')};
  font-size: 16px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  height: 24px;

  &:hover {
    color: #ffffff;
  }

  ${(props) =>
    props.active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 2px;
      height: 18px;
      background-color: #ffffff;
    }
  `}

  @media (max-width: 1439px) {
    padding: 16px 20px;
    height: auto;
    white-space: nowrap;

    &::before {
      display: none;
    }

    ${(props) =>
      props.active &&
      `
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: #ffffff;
      }
    `}
  }
`;

const DesktopOnly = styled.span`
  @media (max-width: 1439px) {
    display: none;
  }
`;

const MobileOnly = styled.span`
  display: none;
  @media (max-width: 1439px) {
    display: inline;
  }
`;

const MainPanel = styled.main`
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
    display: none; /* 모바일에서 숨김 처리 */
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

const ScrollArrowBtn = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  ${props => props.position === 'left' ? 'left: 0;' : 'right: 0;'}
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
  border: 1px solid ${(props) => (props.isActive ? '#55e6c1' : '#3f3f46')};
  color: ${(props) => (props.isActive ? '#55e6c1' : '#a1a1aa')};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => (props.isActive ? '#55e6c1' : '#71717a')};
  }
`;

const SoftwareDropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
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
  background-color: ${(props) => (props.active ? '#1c3d3f' : 'transparent')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#1c3d3f' : '#3f3f46')};
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
  background-color: ${(props) => (props.active ? '#3f3f46' : '#27272a')};
  border: 1px solid ${(props) => (props.active ? '#55e6c1' : 'transparent')};
  padding: 6px 12px;
  border-radius: 6px;
  color: ${(props) => (props.active ? '#55e6c1' : '#a1a1aa')};
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
  border: 1px solid ${(props) => (props.hasValue ? '#55e6c1' : 'transparent')};
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #55e6c1; 
  }

  &:focus-within svg.search-icon, 
  ${(props) => props.hasValue ? '& svg.search-icon { fill: #ffffff; }' : ''}

  @media (max-width: 767px) {
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
    display: ${(props) => (props.alwaysShowMobile ? 'inline' : 'none')};
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
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
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
  background-color: ${(props) => (props.active ? '#1c3d3f' : 'transparent')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#1c3d3f' : '#3f3f46')};
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
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

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: #131315;
  border-top: 1px solid #2b2b30;
  z-index: 100;
`;

const FooterLeft = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const FooterLink = styled.span`
  color: #a1a1aa;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #ffffff;
  }
`;

const LanguageSelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const LanguageSelect = styled.select`
  background-color: #1c1c1f;
  color: #a1a1aa;
  border: 1px solid #3f3f46;
  padding: 2px 28px 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  height: 24px;
  appearance: none;
  outline: none;
  cursor: pointer;
  
  &:hover {
    border-color: #55e6c1;
    color: #ffffff;
  }
`;

const getCategoryName = (categoryId: number) => {
  const categoryMap: Record<number, string> = {
    100: '공지사항',
    110: '유저 스포트라이트',
    130: '커뮤니티 가이드',
    210: '자유 게시판',
    215: '챌린지',
    220: 'QnA',
    230: '프로젝트 & 과정',
    240: '팁 & 트릭',
    250: '유저 피드백',
    260: '구인구직',
  };
  return categoryMap[categoryId] || '게시판';
};

const getCategoryBadgeStyle = (categoryId: number) => {
  if (categoryId === 100) return { bg: '#2d3748', color: '#d6bcfa' };
  if (categoryId === 110) return { bg: '#2a4365', color: '#90cdf4' };
  if (categoryId === 130) return { bg: '#4a5568', color: '#e2e8f0' };
  if (categoryId === 210) return { bg: '#2e1f32', color: '#e3a0c4' };
  if (categoryId === 215) return { bg: '#742a2a', color: '#fbb6ce' };
  if (categoryId === 220) return { bg: '#382329', color: '#d696a6' };
  if (categoryId === 230) return { bg: '#3b321e', color: '#d8ba76' };
  if (categoryId === 240) return { bg: '#21332a', color: '#82c39e' };
  if (categoryId === 250) return { bg: '#2c7a7b', color: '#b2f5ea' };
  if (categoryId === 260) return { bg: '#276749', color: '#c6f6d5' };
  return { bg: '#27272a', color: '#a1a1aa' };
};

function formatTimeAgo(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
}

function formatDateKorean(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

async function getBanners(): Promise<BannerPost[]> {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/search?isBanner=true&pageSize=12&sortBy=5&language=2%20%3D%20KO', {
    headers: { 'accept': 'text/plain' }
  });
  if (!res.ok) throw new Error('Failed to fetch banners');
  const data = await res.json();
  return data.posts || [];
}

async function fetchPinnedPosts(): Promise<PostItemData[]> {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/pins?pinType=20&language=ko', {
    headers: { 'accept': 'text/plain' }
  });
  if (!res.ok) throw new Error('Failed to fetch pinned posts');
  const data = await res.json();
  return data.posts || data || [];
}

async function fetchPosts({ pageParam = 1, queryKey }: any) {
  const [_key, path, sortBy, searchKeyword, software, selectedTag] = queryKey;
  
  const categoryMapping: Record<string, string> = {
    '/notice': '100',
    '/user-spotlight': '110',
    '/general': '210',
    '/challenge': '215',
    '/project-and-steps': '230',
    '/tips-and-tricks': '240',
    '/qna': '220',
    '/user-feedback': '250',
    '/job-board': '260',
    '/community-guide': '130',
  };
  
  const catId = categoryMapping[path] || '';
  const catQuery = catId ? `&category=${catId}` : '';
  
  let finalKeyword = searchKeyword || '';
  if (selectedTag) {
    finalKeyword = finalKeyword ? `${finalKeyword} ${selectedTag}` : selectedTag;
  }
  const keywordQuery = finalKeyword ? `&keyword=${encodeURIComponent(finalKeyword)}` : '&keyword=';
  
  let tagsQuery = '';
  if (software === 'CLO') {
    tagsQuery = '&tags=CLO';
  } else if (software === 'MarvelousDesigner') {
    tagsQuery = '&tags=MavelousDesigner';
  }
  
  const res = await fetch(`https://test-connect-community.api.clo-set.com/api/post/search?sortBy=${sortBy}${keywordQuery}${tagsQuery}&pageSize=24&language=ko&pageNumber=${pageParam}${catQuery}`, {
    headers: { 'accept': 'text/plain' }
  });
  
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return data;
}

async function fetchPopularPosts() {
  const res = await fetch('https://test-connect-community.api.clo-set.com/api/post/search?sortBy=4&keyword=&pageSize=24&language=ko', {
    headers: { 'accept': 'text/plain' }
  });
  if (!res.ok) throw new Error('Failed to fetch popular posts');
  const data = await res.json();
  
  if (!data.posts) return [];
  
  const sortedPosts = data.posts.sort((a: PostItemData, b: PostItemData) => b.likesCount - a.likesCount);
  return sortedPosts.slice(0, 4);
}

export default function CommunityPage() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const softwareRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagsScrollRef = useRef<HTMLDivElement>(null);
  
  const [currentPath, setCurrentPath] = useState('/');
  const [sortBy, setSortBy] = useState<number>(4);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  
  const [selectedSoftware, setSelectedSoftware] = useState('전체');
  const [isSoftwareOpen, setIsSoftwareOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mobile Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAppExpanded, setIsAppExpanded] = useState(false);
  const [isFamilyExpanded, setIsFamilyExpanded] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(true);

  // Mobile Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const sortOptions = [
    { label: '최신순', value: 0 },
    { label: '추천순', value: 1 },
    { label: '최근 활동순', value: 4 },
  ];

  const getTagsForSoftware = (software: string) => {
    if (software === 'CLO') return ['Avatar', 'Colorway', 'Pattern', 'Rendering'];
    if (software === 'MarvelousDesigner') return ['Animation', 'Retopology', 'Texture', 'UnrealEngine'];
    return ['CLO-SET', 'CONNECT', 'EveryWear', 'LiveSync'];
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      const handlePopState = () => setCurrentPath(window.location.pathname);
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const path = router.asPath.split('?')[0];
      setCurrentPath(path || '/');

      const queryTags = router.query.tags as string;
      if (queryTags === 'CLO') setSelectedSoftware('CLO');
      if (queryTags === 'MavelousDesigner') setSelectedSoftware('MarvelousDesigner');
      
      const queryKeyword = router.query.keyword as string;
      if (queryKeyword) {
        setActiveKeyword(queryKeyword);
        setSearchInput(queryKeyword);
      }
    }
  }, [router.isReady, router.asPath]);

  useEffect(() => {
    if (!router.isReady) return;

    const params = new URLSearchParams();
    
    if (selectedSoftware === 'CLO') params.set('tags', 'CLO');
    if (selectedSoftware === 'MarvelousDesigner') params.set('tags', 'MavelousDesigner');
    
    let finalKeyword = activeKeyword;
    if (selectedTag) {
      finalKeyword = finalKeyword ? `${finalKeyword} ${selectedTag}` : selectedTag;
    }
    if (finalKeyword) params.set('keyword', finalKeyword);

    const queryString = params.toString();
    const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;

    window.history.replaceState(null, '', newUrl);
  }, [currentPath, selectedSoftware, activeKeyword, selectedTag, router.isReady]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (softwareRef.current && !softwareRef.current.contains(event.target as Node)) {
        setIsSoftwareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkTagsScroll = () => {
    if (tagsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tagsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => checkTagsScroll(), 0);
    window.addEventListener('resize', checkTagsScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkTagsScroll);
    };
  }, [selectedSoftware]);

  const scrollTags = (direction: 'left' | 'right') => {
    if (tagsScrollRef.current) {
      const scrollAmount = 150;
      tagsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabTitleMap: Record<string, string> = {
    '/': '전체 게시판',
    '/notice': '공지사항',
    '/user-spotlight': '유저 스포트라이트',
    '/general': '자유 게시판',
    '/challenge': '챌린지',
    '/project-and-steps': '프로젝트 & 과정',
    '/tips-and-tricks': '팁 & 트릭',
    '/qna': 'QnA',
    '/user-feedback': '유저 피드백',
    '/job-board': '구인구직',
    '/community-guide': '커뮤니티 가이드',
  };

  const currentTitle = tabTitleMap[currentPath] || '전체 게시판';

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
  });

  const { data: popularPosts } = useQuery({
    queryKey: ['popularPosts'],
    queryFn: fetchPopularPosts,
  });

  const { data: pinnedPosts } = useQuery({
    queryKey: ['pinnedPosts'],
    queryFn: fetchPinnedPosts,
  });

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['posts', currentPath, sortBy, activeKeyword, selectedSoftware, selectedTag],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.posts && lastPage.posts.length === 24) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = 360;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handlePathClick = (path: string) => {
    router.push({ pathname: path, query: router.query }, undefined, { shallow: true });
    setCurrentPath(path);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveKeyword(searchInput);
    }
  };

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? '' : tag;
    setSelectedTag(newTag);
    
    setSearchInput(newTag);
    setActiveKeyword(newTag);
    
    if (newTag) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const handlePrevPin = () => {
    if (!pinnedPosts?.length) return;
    setCurrentPinnedIndex((prev) => (prev === 0 ? pinnedPosts.length - 1 : prev - 1));
  };

  const handleNextPin = () => {
    if (!pinnedPosts?.length) return;
    setCurrentPinnedIndex((prev) => (prev === pinnedPosts.length - 1 ? 0 : prev + 1));
  };

  const totalPostCount = postData?.pages?.[0]?.totalCount ?? postData?.pages?.[0]?.posts?.length ?? 0;

  return (
    <DarkBackground>
      <HeaderContainer>
        <LeftNavGroup>
          <Link href="/ko" style={{ textDecoration: 'none', display: 'flex' }}>
            <ConnectLogo aria-label="Go to Connect Main Page" />
          </Link>
          
          <DesktopNavGroup>
            <NavLink href="/store">스토어</NavLink>
            <NavLink href="/gallery">갤러리</NavLink>
            <NavLink href="/contest">콘테스트</NavLink>
            <NavLink href="/community" active>커뮤니티</NavLink>

            <DropdownWrapper>
              <DropdownTitle className="dropdown-title">
                앱
                <svg className="arrow-down" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
                <svg className="arrow-up" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>
              </DropdownTitle>
              <div className="dropdown-menu">
                <DropdownItem href="/everywear">EveryWear</DropdownItem>
                <DropdownItem href="/livesync">LiveSync</DropdownItem>
                <DropdownItem href="/ar-filter">AR 필터</DropdownItem>
                <DropdownItem href="/jinny">JINNY</DropdownItem>
              </div>
            </DropdownWrapper>

            <VerticalDivider />

            <DropdownWrapper>
              <DropdownTitle className="dropdown-title">
                Gamewear
                <svg className="arrow-down" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
                <svg className="arrow-up" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>
              </DropdownTitle>
              <div className="dropdown-menu">
                <DropdownItem href="https://inzoi.com" target="_blank">
                  inZOI
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                </DropdownItem>
                <DropdownItem href="https://vrchat.com" target="_blank">
                  VRChat
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                </DropdownItem>
              </div>
            </DropdownWrapper>
          </DesktopNavGroup>
        </LeftNavGroup>

        <DesktopAuthGroup>
          <LoginLink href="/login">로그인</LoginLink>
          <SignUpButton href="/signup">회원가입</SignUpButton>
          <GridIconBtn>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
            </svg>
          </GridIconBtn>
        </DesktopAuthGroup>

        {/* Mobile Navigation (<= 1199px) */}
        <MobileNavGroup>
          <IconButton>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </IconButton>
          <IconButton onClick={() => setIsDrawerOpen(true)}>
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </IconButton>
        </MobileNavGroup>
      </HeaderContainer>

      {/* Mobile Drawer */}
      <DrawerBackdrop isOpen={isDrawerOpen} onClick={() => setIsDrawerOpen(false)} />
      <DrawerContainer isOpen={isDrawerOpen}>
        <DrawerHeader>
          <DrawerProfileArea>
            <DrawerAvatar>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </DrawerAvatar>
            <DrawerLoginBtn>로그인</DrawerLoginBtn>
          </DrawerProfileArea>
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </DrawerHeader>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <DrawerItem href="/store">스토어</DrawerItem>
          <DrawerItem href="/gallery">갤러리</DrawerItem>
          <DrawerItem href="/creator">크리에이터</DrawerItem>
          <DrawerItem href="/contest">콘테스트</DrawerItem>
          <DrawerItem href="/community" active>커뮤니티</DrawerItem>

          <DrawerAccordionBtn active={isAppExpanded} onClick={() => setIsAppExpanded(!isAppExpanded)}>
            앱
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ transform: isAppExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </DrawerAccordionBtn>
          {isAppExpanded && (
            <DrawerSubMenu>
              <DrawerSubItem href="/everywear">EveryWear</DrawerSubItem>
              <DrawerSubItem href="/livesync">LiveSync</DrawerSubItem>
              <DrawerSubItem href="/ar-filter">AR 필터</DrawerSubItem>
              <DrawerSubItem href="/jinny">JINNY</DrawerSubItem>
            </DrawerSubMenu>
          )}

          <DrawerItem href="https://inzoi.com" target="_blank" style={{ justifyContent: 'space-between' }}>
            Gamewear
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
          </DrawerItem>

          <DrawerItem href="/help" target="_blank" style={{ justifyContent: 'space-between' }}>
            헬프센터
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
          </DrawerItem>

          <DrawerAccordionBtn active={isFamilyExpanded} onClick={() => setIsFamilyExpanded(!isFamilyExpanded)}>
            패밀리 사이트
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ transform: isFamilyExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </DrawerAccordionBtn>
          {isFamilyExpanded && (
            <DrawerSubMenu>
              <DrawerSubItem href="https://clo3d.com" target="_blank">CLO</DrawerSubItem>
              <DrawerSubItem href="https://marvelousdesigner.com" target="_blank">Marvelous Designer</DrawerSubItem>
            </DrawerSubMenu>
          )}

          <DrawerAccordionBtn active={isLanguageExpanded} onClick={() => setIsLanguageExpanded(!isLanguageExpanded)}>
            언어
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ transform: isLanguageExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </DrawerAccordionBtn>
          {isLanguageExpanded && (
            <DrawerSubMenu>
              <DrawerSubItem href="#">English</DrawerSubItem>
              <DrawerSubItem href="#">中文</DrawerSubItem>
              <DrawerSubItem href="#" active>한국어</DrawerSubItem>
              <DrawerSubItem href="#">日本語</DrawerSubItem>
            </DrawerSubMenu>
          )}
        </div>
      </DrawerContainer>

      {/* Mobile Filter Modal (<= 767px) */}
      <FilterModalOverlay isOpen={isFilterModalOpen}>
        <FilterModalHeader>
          <FilterModalTitle>FILTER</FilterModalTitle>
          <IconButton onClick={() => setIsFilterModalOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </FilterModalHeader>
        <FilterModalBody>
          <FilterBreadcrumb>
            커뮤니티 <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            <span className="active">{currentTitle === '전체 게시판' ? '전체' : currentTitle}</span>
          </FilterBreadcrumb>
          <FilterSectionTitle>Filter</FilterSectionTitle>
          <FilterGrid>
            {getTagsForSoftware(selectedSoftware).map(tag => (
              <FilterCheckboxLabel key={tag} onClick={() => handleTagClick(tag)}>
                <FilterCheckboxInput type="checkbox" checked={selectedTag === tag} readOnly />
                <FilterCustomCheck checked={selectedTag === tag} />
                {tag}
              </FilterCheckboxLabel>
            ))}
          </FilterGrid>
          <FilterDivider />
          <FilterResetBtn onClick={() => {
            setSelectedTag('');
            setSearchInput('');
            setActiveKeyword('');
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
            초기화
          </FilterResetBtn>
        </FilterModalBody>
      </FilterModalOverlay>

      <CarouselWrapper>
        <CarouselNavBtn direction="left" onClick={() => scrollCarousel('left')}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </CarouselNavBtn>
        
        <CarouselTrack ref={trackRef}>
          {banners && banners.map((item) => {
            const bgImage = item.postThumbnail?.path || `https://picsum.photos/seed/${item.postId.slice(0, 5)}/400/500`;
            const avatarImage = item.creatorThumbnailPath || `https://picsum.photos/seed/${item.creatorName}/100/100`;
            
            return (
              <CarouselCard key={item.postId} bg={bgImage}>
                <CardHoverOverlay className="hover-content">
                  <CategoryBadge>{getCategoryName(item.category)}</CategoryBadge>
                  
                  <CardBottomInfo>
                    <CardTitle>{item.title}</CardTitle>
                    {item.summary && <CardSummary>{item.summary}</CardSummary>}
                    <CreatorInfo>
                      <CreatorAvatar bg={avatarImage} />
                      <CreatorName>{item.creatorName}</CreatorName>
                    </CreatorInfo>
                  </CardBottomInfo>
                </CardHoverOverlay>
              </CarouselCard>
            );
          })}
        </CarouselTrack>

        <CarouselNavBtn direction="right" onClick={() => scrollCarousel('right')}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </CarouselNavBtn>
      </CarouselWrapper>

      <FlexContainer>
        <SidebarWrapper>
          <SidebarItemBtn 
            active={currentPath === '/'} 
            onClick={() => handlePathClick('/')}
          >
            <DesktopOnly>전체 게시판</DesktopOnly>
            <MobileOnly>전체</MobileOnly>
          </SidebarItemBtn>

          <SidebarDivider />

          <SidebarGroup>
            <SidebarGroupTitle>공식 계정</SidebarGroupTitle>
            <SidebarItemBtn 
              active={currentPath === '/notice'} 
              onClick={() => handlePathClick('/notice')}
            >
              공지사항
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/user-spotlight'} 
              onClick={() => handlePathClick('/user-spotlight')}
            >
              유저 스포트라이트
            </SidebarItemBtn>
          </SidebarGroup>

          <SidebarDivider />

          <SidebarGroup>
            <SidebarGroupTitle>주제</SidebarGroupTitle>
            <SidebarItemBtn 
              active={currentPath === '/general'} 
              onClick={() => handlePathClick('/general')}
            >
              자유 게시판
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/challenge'} 
              onClick={() => handlePathClick('/challenge')}
            >
              챌린지
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/project-and-steps'} 
              onClick={() => handlePathClick('/project-and-steps')}
            >
              프로젝트 & 과정
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/tips-and-tricks'} 
              onClick={() => handlePathClick('/tips-and-tricks')}
            >
              팁 & 트릭
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/qna'} 
              onClick={() => handlePathClick('/qna')}
            >
              QnA
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/user-feedback'} 
              onClick={() => handlePathClick('/user-feedback')}
            >
              유저 피드백
            </SidebarItemBtn>
            <SidebarItemBtn 
              active={currentPath === '/job-board'} 
              onClick={() => handlePathClick('/job-board')}
            >
              구인구직
            </SidebarItemBtn>
          </SidebarGroup>

          <SidebarDivider />

          <SidebarItemBtn 
            active={currentPath === '/community-guide'} 
            onClick={() => handlePathClick('/community-guide')}
          >
            커뮤니티 가이드
          </SidebarItemBtn>
        </SidebarWrapper>

        <MainPanel>
          <TopFilterBar>
            <TopFilterScrollWrapper>
              {canScrollLeft && (
                <>
                  <FadeLeft />
                  <ScrollArrowBtn position="left" onClick={() => scrollTags('left')}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                  </ScrollArrowBtn>
                </>
              )}
              
              <TopFilterScrollContainer ref={tagsScrollRef} onScroll={checkTagsScroll}>
                <SoftwareSelectWrapper ref={softwareRef}>
                  <SoftwareButton 
                    isActive={selectedSoftware !== '전체'}
                    onClick={() => setIsSoftwareOpen(!isSoftwareOpen)}
                  >
                    {selectedSoftware === '전체' ? (
                      <>
                        <span style={{ color: '#a1a1aa' }}>소프트웨어</span>
                        <span style={{ color: '#3f3f46', margin: '0 12px' }}>|</span>
                        <span style={{ color: '#fff' }}>전체</span>
                      </>
                    ) : (
                      <span>{selectedSoftware === 'CLO' ? 'CLO' : 'Marvelous Designer'}</span>
                    )}
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </SoftwareButton>
                  
                  <SoftwareDropdownMenu isOpen={isSoftwareOpen}>
                    {['전체', 'CLO', 'MarvelousDesigner'].map((opt) => (
                      <SoftwareDropdownItem
                        key={opt}
                        active={selectedSoftware === opt}
                        onClick={() => {
                          setSelectedSoftware(opt);
                          setSearchInput('');
                          setActiveKeyword('');
                          setSelectedTag('');
                          setIsSoftwareOpen(false);
                        }}
                      >
                        {opt === 'MarvelousDesigner' ? 'Marvelous Designer' : opt}
                      </SoftwareDropdownItem>
                    ))}
                  </SoftwareDropdownMenu>
                </SoftwareSelectWrapper>
                
                <TopFilterDivider />

                <TagList>
                  {getTagsForSoftware(selectedSoftware).map(tag => (
                    <TagBtn 
                      key={tag}
                      active={selectedTag === tag}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </TagBtn>
                  ))}
                </TagList>
              </TopFilterScrollContainer>
              
              {canScrollRight && (
                <>
                  <FadeRight />
                  <ScrollArrowBtn position="right" onClick={() => scrollTags('right')}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                  </ScrollArrowBtn>
                </>
              )}
            </TopFilterScrollWrapper>

            <SearchAreaMobileWrapper>
              <SearchInputBox hasValue={searchInput.length > 0}>
                <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="#a1a1aa"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <SearchInput 
                  ref={searchInputRef}
                  placeholder={`${currentTitle}에서 검색`} 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                {searchInput.length > 0 && (
                  <ClearInputBtn onClick={() => {
                    setSearchInput('');
                    setActiveKeyword('');
                    setSelectedTag('');
                  }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </ClearInputBtn>
                )}
              </SearchInputBox>

              <FilterIconBtn onClick={() => setIsFilterModalOpen(true)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                </svg>
              </FilterIconBtn>
            </SearchAreaMobileWrapper>
          </TopFilterBar>

          <BoardContainer>
            <BoardHeader>
              <BoardTitle>
                <BoardTitleText>{currentTitle}</BoardTitleText>
                {/* 모바일에서는 조건 없이 항상 표시되도록 변경 */}
                <BoardTitleSub alwaysShowMobile>
                  {totalPostCount} 게시글
                </BoardTitleSub>
              </BoardTitle>
              <BoardHeaderRight ref={sortRef}>
                <SortButton onClick={() => setIsSortOpen(!isSortOpen)}>
                  {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M7 10l5 5 5-5z"/></svg>
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
                <PinnedPost>
                  <PinnedLeft>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#a1a1aa" style={{ transform: 'rotate(-45deg)' }}>
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                    </svg>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: getCategoryBadgeStyle(pinnedPosts[currentPinnedIndex].category).color, fontSize: '12px', fontWeight: 'bold' }}>
                        {getCategoryName(pinnedPosts[currentPinnedIndex].category)}
                      </span>
                      <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>
                        {pinnedPosts[currentPinnedIndex].title}
                      </span>
                    </div>
                  </PinnedLeft>
                  {pinnedPosts.length > 1 && (
                    <div style={{ color: '#a1a1aa', display: 'flex', gap: '16px', fontWeight: 'bold', userSelect: 'none' }}>
                      <span style={{ cursor: 'pointer' }} onClick={handlePrevPin}>{'<'}</span>
                      <span style={{ cursor: 'pointer' }} onClick={handleNextPin}>{'>'}</span>
                    </div>
                  )}
                </PinnedPost>
              )}

              <PostListWrapper>
                {status === 'pending' ? (
                  <div style={{ padding: '24px', color: '#a1a1aa', textAlign: 'center' }}>데이터를 불러오는 중...</div>
                ) : status === 'error' ? (
                  <div style={{ padding: '24px', color: '#ff6b6b', textAlign: 'center' }}>데이터를 불러오지 못했습니다.</div>
                ) : (
                  postData.pages.map((page, pageIndex) => (
                    <div key={pageIndex}>
                      {page.posts && page.posts.map((post: PostItemData) => {
                        const badgeStyle = getCategoryBadgeStyle(post.category);
                        const avatarImg = post.creatorThumbnailPath || `https://picsum.photos/seed/${post.creatorName}/50/50`;
                        const thumbImg = post.postThumbnail?.path;

                        return (
                          <PostListItem key={post.postId}>
                            <PostContentArea>
                              <SmallBadge style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color }}>
                                {getCategoryName(post.category)}
                              </SmallBadge>
                              <ItemTitle>{post.title}</ItemTitle>
                              <ItemSummary>{post.summary}</ItemSummary>
                              
                              <ItemMeta>
                                <SmallAvatar bg={avatarImg} />
                                <span>{post.creatorName}</span>
                                <span>·</span>
                                <span>{formatTimeAgo(post.registeredDate)}</span>
                                <span style={{ marginLeft: '12px' }}></span>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                <span>{post.viewCount}</span>
                                <span style={{ marginLeft: '4px' }}></span>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                                <span>{post.likesCount}</span>
                                <span style={{ marginLeft: '4px' }}></span>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
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
                
                <div ref={loadMoreRef} style={{ height: '20px' }}>
                  {isFetchingNextPage && <div style={{ textAlign: 'center', padding: '20px', color: '#a1a1aa' }}>추가 데이터를 불러오는 중...</div>}
                </div>
              </PostListWrapper>
            </BoardBody>
          </BoardContainer>
        </MainPanel>

        <RightSidebarWrapper>
          <RightSidebarTitle>인기 게시글</RightSidebarTitle>
          
          {popularPosts && popularPosts.map((post: PostItemData) => (
            <PopularPostItem key={post.postId}>
              <PopularCategory>{getCategoryName(post.category)}</PopularCategory>
              <PopularTitle>{post.title}</PopularTitle>
              <PopularMeta>
                {post.creatorName} | {formatDateKorean(post.registeredDate)}
              </PopularMeta>
            </PopularPostItem>
          ))}
        </RightSidebarWrapper>
      </FlexContainer>

      <FloatingWriteBtn>글쓰기</FloatingWriteBtn>
      
      <ScrollToTopBtn onClick={handleScrollToTop}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </ScrollToTopBtn>
      
      <FooterContainer>
        <FooterLeft>
          <FooterLink>이용약관</FooterLink>
          <FooterLink>Privacy</FooterLink>
          <FooterLink>
            Cookies
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
          </FooterLink>
          <FooterLink>
            헬프센터
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
          </FooterLink>
        </FooterLeft>
        <LanguageSelectWrapper>
          <LanguageSelect>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </LanguageSelect>
          <svg style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="#a1a1aa">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </LanguageSelectWrapper>
      </FooterContainer>
    </DarkBackground>
  );
}