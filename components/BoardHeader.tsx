import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setSortBy } from "../store/filterSlice";
import { SORT_OPTIONS } from "../constants/navigation";

const HeaderWrapper = styled.div`
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
const BoardTitleSub = styled.span`
  color: #a1a1aa;
  font-size: 14px;
  font-weight: normal;
  @media (max-width: 767px) {
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    display: inline;
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
`;
const SortDropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
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
  background-color: ${(props) => (props.active ? "#1c3d3f" : "transparent")};
  &:hover {
    background-color: ${(props) => (props.active ? "#1c3d3f" : "#3f3f46")};
  }
`;

interface BoardHeaderProps {
  currentTitle: string;
  totalPostCount: number;
}

export default function BoardHeader({
  currentTitle,
  totalPostCount,
}: BoardHeaderProps) {
  const dispatch = useDispatch();
  const sortBy = useSelector((state: RootState) => state.filter.sortBy);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <HeaderWrapper>
      <BoardTitle>
        <BoardTitleText>{currentTitle}</BoardTitleText>
        <BoardTitleSub>{totalPostCount} 게시글</BoardTitleSub>
      </BoardTitle>

      <BoardHeaderRight ref={sortRef}>
        <SortButton onClick={() => setIsSortOpen(!isSortOpen)}>
          {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </SortButton>

        <SortDropdownMenu isOpen={isSortOpen}>
          {SORT_OPTIONS.map((option) => (
            <SortDropdownItem
              key={option.value}
              active={sortBy === option.value}
              onClick={() => {
                dispatch(setSortBy(option.value));
                setIsSortOpen(false);
              }}
            >
              {option.label}
            </SortDropdownItem>
          ))}
        </SortDropdownMenu>
      </BoardHeaderRight>
    </HeaderWrapper>
  );
}
