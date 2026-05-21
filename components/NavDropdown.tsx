import Link from 'next/link';
import styled from '@emotion/styled';


const DropdownMenu = styled.div`
  display: none;
  position: absolute;
  top: 60px;
  left: 0;
  background-color: #000000;
  border: 1px solid #333;
  padding: 10px 0;
  min-width: 160px;
  z-index: 100;
`;

const ArrowDown = styled.svg`
  display: inline-block;
  fill: currentColor;
`;

const ArrowUp = styled.svg`
  display: none;
  fill: currentColor;
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


const DropdownWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 60px;
  cursor: pointer;

  &:hover {
    color: #00e5ff;
    
    /* 클래스 이름 대신 컴포넌트 자체를 타겟팅! */
    ${DropdownMenu} {
      display: flex;
      flex-direction: column;
    }
    ${DropdownTitle} {
      color: #00e5ff;
    }
    ${ArrowDown} {
      display: none;
    }
    ${ArrowUp} {
      display: inline-block;
      fill: #00e5ff;
    }
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
      <DropdownTitle>
        {title}
        <ArrowDown viewBox="0 0 24 24" width="16" height="16">
          <path d="M7 10l5 5 5-5z" />
        </ArrowDown>
        <ArrowUp viewBox="0 0 24 24" width="16" height="16">
          <path d="M7 14l5-5 5 5z" />
        </ArrowUp>
      </DropdownTitle>
      
      <DropdownMenu>
        {items.map((item) => (
          <DropdownItem key={item.href} href={item.href} target={item.target}>
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownWrapper>
  );
}