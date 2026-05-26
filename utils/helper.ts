export const getCategoryName = (categoryId: number) => {
  const categoryMap: Record<number, string> = {
    100: "공지사항",
    110: "유저 스포트라이트",
    130: "커뮤니티 가이드",
    210: "자유 게시판",
    215: "챌린지",
    220: "QnA",
    230: "프로젝트 & 과정",
    240: "팁 & 트릭",
    250: "유저 피드백",
    260: "구인구직",
  };
  return categoryMap[categoryId] || "게시판";
};

export function formatDateKorean(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export const getCategoryBadgeStyle = (categoryId: number) => {
  if (categoryId === 100) return { bg: "#2d3748", color: "#d6bcfa" };
  if (categoryId === 110) return { bg: "#2a4365", color: "#90cdf4" };
  if (categoryId === 130) return { bg: "#4a5568", color: "#e2e8f0" };
  if (categoryId === 210) return { bg: "#2e1f32", color: "#e3a0c4" };
  if (categoryId === 215) return { bg: "#742a2a", color: "#fbb6ce" };
  if (categoryId === 220) return { bg: "#382329", color: "#d696a6" };
  if (categoryId === 230) return { bg: "#3b321e", color: "#d8ba76" };
  if (categoryId === 240) return { bg: "#21332a", color: "#82c39e" };
  if (categoryId === 250) return { bg: "#2c7a7b", color: "#b2f5ea" };
  if (categoryId === 260) return { bg: "#276749", color: "#c6f6d5" };
  return { bg: "#27272a", color: "#a1a1aa" };
};

export function formatTimeAgo(dateString: string) {
  if (!dateString) return "";
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
