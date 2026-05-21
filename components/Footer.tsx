import Link from "next/link";
import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
import { FOOTER_LINKS, LANGUAGES } from "../constants/navigation";

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;

  background-color: #131315;
  height: 48px;
  border-top: 1px solid #222;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const FooterLinkItem = styled(Link)`
  color: #aaaaaa;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    color: #ffffff;
  }
`;

const ExternalIcon = styled.svg`
  width: 12px;
  height: 12px;
  fill: currentColor;
`;

const RightGroup = styled.div`
  position: relative;
`;

const LangDropdown = styled.div`
  display: none;
  position: absolute;
  bottom: 100%;
  margin-bottom: 16px;
  right: 0;
  background-color: #131315;
  border: 1px solid #2a2a2c;
  min-width: 140px;
  padding: 8px 0;
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

const LangWrapper = styled.div<{ isOpen: boolean }>`
  ${LangDropdown} {
    display: ${(props) => (props.isOpen ? "block" : "none")};
  }
`;

const LangButton = styled.button`
  background: none;
  border: none;
  color: #aaaaaa;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  &:hover {
    color: #ffffff;
  }
`;

const LangItem = styled.button<{ active?: boolean }>`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 14px 20px;
  font-size: 15px;
  color: ${(props) => (props.active ? "#ffffff" : "#aaaaaa")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  cursor: pointer;

  &:hover {
    color: #ffffff;
    background-color: #27272a;
  }
`;

export default function Footer() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("한국어");
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <FooterContainer>
      <LeftGroup>
        {FOOTER_LINKS.map((link) => (
          <FooterLinkItem
            key={link.label}
            href={link.href}
            target={link.isExternal ? "_blank" : undefined}
          >
            {link.label}
            {link.isExternal && (
              <ExternalIcon viewBox="0 0 24 24">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </ExternalIcon>
            )}
          </FooterLinkItem>
        ))}
      </LeftGroup>

      <LangWrapper ref={langRef} isOpen={isLangOpen}>
        <LangButton onClick={() => setIsLangOpen(!isLangOpen)}>
          {currentLang}

          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            {isLangOpen ? (
              <path d="M7 14l5-5 5 5z" />
            ) : (
              <path d="M7 10l5 5 5-5z" />
            )}
          </svg>
        </LangButton>

        <LangDropdown>
          {LANGUAGES.map((lang) => (
            <LangItem
              key={lang.value}
              active={currentLang === lang.label}
              onClick={() => {
                setCurrentLang(lang.label);
                setIsLangOpen(false);
              }}
            >
              {lang.label}
            </LangItem>
          ))}
        </LangDropdown>
      </LangWrapper>
    </FooterContainer>
  );
}
