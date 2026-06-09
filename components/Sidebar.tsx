import styled from "@emotion/styled";

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
  color: ${(props) => (props.active ? "#ffffff" : "#a1a1aa")};
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
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

interface SidebarProps {
  currentPath: string;
  onPathClick: (path: string) => void;
}

const OFFICIAL_ACCOUNTS = [
  { path: "/notice", label: "공지사항" },
  { path: "/user-spotlight", label: "유저 스포트라이트" },
];

const TOPICS = [
  { path: "/general", label: "자유 게시판" },
  { path: "/challenge", label: "챌린지" },
  { path: "/project-and-steps", label: "프로젝트 & 과정" },
  { path: "/tips-and-tricks", label: "팁 & 트릭" },
  { path: "/qna", label: "QnA" },
  { path: "/user-feedback", label: "유저 피드백" },
  { path: "/job-board", label: "구인구직" },
];

export default function Sidebar({ currentPath, onPathClick }: SidebarProps) {
  return (
    <SidebarWrapper>
      <SidebarItemBtn
        active={currentPath === "/"}
        onClick={() => onPathClick("/")}
      >
        <DesktopOnly>전체 게시판</DesktopOnly>
        <MobileOnly>전체</MobileOnly>
      </SidebarItemBtn>

      <SidebarDivider />

      <SidebarGroup>
        <SidebarGroupTitle>공식 계정</SidebarGroupTitle>
        {OFFICIAL_ACCOUNTS.map((menu) => (
          <SidebarItemBtn
            key={menu.path}
            active={currentPath === menu.path}
            onClick={() => onPathClick(menu.path)}
          >
            {menu.label}
          </SidebarItemBtn>
        ))}
      </SidebarGroup>

      <SidebarDivider />

      <SidebarGroup>
        <SidebarGroupTitle>주제</SidebarGroupTitle>
        {TOPICS.map((menu) => (
          <SidebarItemBtn
            key={menu.path}
            active={currentPath === menu.path}
            onClick={() => onPathClick(menu.path)}
          >
            {menu.label}
          </SidebarItemBtn>
        ))}
      </SidebarGroup>

      <SidebarDivider />

      <SidebarItemBtn
        active={currentPath === "/community-guide"}
        onClick={() => onPathClick("/community-guide")}
      >
        커뮤니티 가이드
      </SidebarItemBtn>
    </SidebarWrapper>
  );
}
