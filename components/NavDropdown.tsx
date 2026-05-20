import Link from "next/link";
import styled from "@emotion/styled";

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

interface DropdownItemData {
  label: string;
  href: string;
  target?: string;
}

interface NavDropdownProps {
  title: string;
  items: DropdownItemData[];
}

export default function NavDropdown({ title, items }: NavDropdownProps) {
  return (
    <DropdownWrapper>
      <DropdownTitle className="dropdown-title">
        {title}
        <svg
          className="arrow-down"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
        <svg
          className="arrow-up"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M7 14l5-5 5 5z" />
        </svg>
      </DropdownTitle>

      <div className="dropdown-menu">
        {items.map((item) => (
          <DropdownItem key={item.href} href={item.href} target={item.target}>
            {item.label}
          </DropdownItem>
        ))}
      </div>
    </DropdownWrapper>
  );
}
