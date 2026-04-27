import styled from '@emotion/styled';
import Link from 'next/link';

interface HeaderProps {
  openDrawer: () => void;
}

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
  display: flex; align-items: center; gap: 32px;
`;

const DesktopNavGroup = styled.div`
  display: flex; align-items: center; gap: 32px;
  @media (max-width: 1199px) { display: none; }
`;

const DesktopAuthGroup = styled.div`
  display: flex; align-items: center; gap: 20px;
  @media (max-width: 1199px) { display: none; }
`;

const MobileNavGroup = styled.div`
  display: none; align-items: center; gap: 20px;
  @media (max-width: 1199px) { display: flex; }
`;

const IconButton = styled.button`
  background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;
  &:hover { color: #a1a1aa; }
`;

const ConnectLogo = styled.span`
  display: inline-block; width: 80px; height: 16px;
  background: url('https://storagefiles.clo-set.com/public/connect/common/connect-desktop-header-bi.svg') no-repeat;
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${(props) => (props.active ? '#ffffff' : '#aaaaaa')}; text-decoration: none; font-size: 15px; font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  &:hover { color: #ffffff; }
`;

const DropdownWrapper = styled.div`
  position: relative; display: flex; align-items: center; height: 60px; cursor: pointer;
  .dropdown-menu { display: none; position: absolute; top: 60px; left: 0; background-color: #000000; border: 1px solid #333; padding: 10px 0; min-width: 160px; z-index: 100; }
  .arrow-up { display: none; }
  &:hover { color: #00e5ff; .dropdown-menu { display: flex; flex-direction: column; } .dropdown-title { color: #00e5ff; } .arrow-down { display: none; } .arrow-up { display: inline-block; fill: #00e5ff; } }
`;

const DropdownTitle = styled.div` display: flex; align-items: center; gap: 4px; color: #aaaaaa; font-size: 15px; font-weight: bold; `;
const DropdownItem = styled(Link)` color: #cccccc; text-decoration: none; padding: 12px 20px; font-size: 14px; display: flex; align-items: center; justify-content: space-between; &:hover { color: #ffffff; background-color: #1a1a1a; } `;
const VerticalDivider = styled.div` width: 1px; height: 16px; background-color: #333333; `;
const LoginLink = styled(Link)` color: #ffffff; text-decoration: none; font-size: 14px; `;
const SignUpButton = styled(Link)` color: #ffffff; text-decoration: none; font-size: 14px; border: 1px solid #ffffff; border-radius: 20px; padding: 6px 16px; &:hover { background-color: rgba(255, 255, 255, 0.1); } `;
const GridIconBtn = styled.button` background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 0; color: #aaaaaa; &:hover { color: #ffffff; } `;

export default function Header({ openDrawer }: HeaderProps) {
  return (
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
              <DropdownItem href="https://inzoi.com" target="_blank">inZOI</DropdownItem>
              <DropdownItem href="https://vrchat.com" target="_blank">VRChat</DropdownItem>
            </div>
          </DropdownWrapper>
        </DesktopNavGroup>
      </LeftNavGroup>

      <DesktopAuthGroup>
        <LoginLink href="/login">로그인</LoginLink>
        <SignUpButton href="/signup">회원가입</SignUpButton>
        <GridIconBtn>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg>
        </GridIconBtn>
      </DesktopAuthGroup>

      <MobileNavGroup>
        <IconButton>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </IconButton>
        <IconButton onClick={openDrawer}>
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </IconButton>
      </MobileNavGroup>
    </HeaderContainer>
  );
}