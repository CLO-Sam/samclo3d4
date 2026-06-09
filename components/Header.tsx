import Link from "next/link";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { openDrawer } from "../store/uiSlice";
import {
  NAV_ITEMS,
  APP_DROPDOWN_ITEMS,
  GAMEWEAR_DROPDOWN_ITEMS,
} from "../constants/navigation";
import NavDropdown from "./NavDropdown";

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
  background: url("https://storagefiles.clo-set.com/public/connect/common/connect-desktop-header-bi.svg")
    no-repeat;
`;
const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${(props) => (props.active ? "#ffffff" : "#aaaaaa")};
  text-decoration: none;
  font-size: 15px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  &:hover {
    color: #ffffff;
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

export default function Header() {
  const dispatch = useDispatch();

  return (
    <HeaderContainer>
      <LeftNavGroup>
        <Link href="/" style={{ textDecoration: "none", display: "flex" }}>
          <ConnectLogo aria-label="Go to Connect Main Page" />
        </Link>
        <DesktopNavGroup>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={item.href === "/community"}
            >
              {item.label}
            </NavLink>
          ))}

          <NavDropdown title="앱" items={APP_DROPDOWN_ITEMS} />
          <VerticalDivider />
          <NavDropdown title="Gamewear" items={GAMEWEAR_DROPDOWN_ITEMS} />
        </DesktopNavGroup>
      </LeftNavGroup>

      <DesktopAuthGroup>
        <LoginLink href="/login">로그인</LoginLink>
        <SignUpButton href="/signup">회원가입</SignUpButton>
        <GridIconBtn>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
          </svg>
        </GridIconBtn>
      </DesktopAuthGroup>

      <MobileNavGroup>
        <IconButton>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </IconButton>

        <IconButton onClick={() => dispatch(openDrawer())}>
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </IconButton>
      </MobileNavGroup>
    </HeaderContainer>
  );
}
