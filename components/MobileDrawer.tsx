import styled from "@emotion/styled";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { closeDrawer } from "../store/uiSlice";
import { NAV_ITEMS, APP_DROPDOWN_ITEMS } from "../constants/navigation";

const DrawerBackdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;
const DrawerContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background-color: #27272a;
  z-index: 1000;
  transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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
`;
const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;
const DrawerItem = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  color: ${(props) => (props.active ? "#ffffff" : "#d4d4d8")};
  text-decoration: none;
  font-size: 15px;
  background-color: ${(props) => (props.active ? "#3f3f46" : "transparent")};
  border-left: 3px solid
    ${(props) => (props.active ? "#55e6c1" : "transparent")};
`;
const DrawerAccordionBtn = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  color: ${(props) => (props.active ? "#ffffff" : "#d4d4d8")};
  font-size: 15px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#3f3f46" : "transparent")};
  border-left: 3px solid
    ${(props) => (props.active ? "#55e6c1" : "transparent")};
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
  color: ${(props) => (props.active ? "#ffffff" : "#a1a1aa")};
  text-decoration: none;
  font-size: 14px;
  border-left: 3px solid
    ${(props) => (props.active ? "#55e6c1" : "transparent")};
`;

interface MobileDrawerProps {
  isAppExpanded: boolean;
  setIsAppExpanded: (val: boolean) => void;
  isFamilyExpanded: boolean;
  setIsFamilyExpanded: (val: boolean) => void;
  isLanguageExpanded: boolean;
  setIsLanguageExpanded: (val: boolean) => void;
}

export default function MobileDrawer({
  isAppExpanded,
  setIsAppExpanded,
  isFamilyExpanded,
  setIsFamilyExpanded,
  isLanguageExpanded,
  setIsLanguageExpanded,
}: MobileDrawerProps) {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.isDrawerOpen);

  return (
    <>
      <DrawerBackdrop isOpen={isOpen} onClick={() => dispatch(closeDrawer())} />
      <DrawerContainer isOpen={isOpen}>
        <DrawerHeader>
          <DrawerProfileArea>
            <DrawerAvatar>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </DrawerAvatar>
            <DrawerLoginBtn>로그인</DrawerLoginBtn>
          </DrawerProfileArea>
          <IconButton onClick={() => dispatch(closeDrawer())}>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="#a1a1aa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </DrawerHeader>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <DrawerItem
              key={item.href}
              href={item.href}
              active={item.href === "/community"}
            >
              {item.label}
            </DrawerItem>
          ))}

          <DrawerAccordionBtn
            active={isAppExpanded}
            onClick={() => setIsAppExpanded(!isAppExpanded)}
          >
            앱
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              style={{ transform: isAppExpanded ? "rotate(180deg)" : "none" }}
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </DrawerAccordionBtn>

          {isAppExpanded && (
            <DrawerSubMenu>
              {APP_DROPDOWN_ITEMS.map((item) => (
                <DrawerSubItem key={item.href} href={item.href}>
                  {item.label}
                </DrawerSubItem>
              ))}
            </DrawerSubMenu>
          )}
        </div>
      </DrawerContainer>
    </>
  );
}
