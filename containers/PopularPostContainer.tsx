import React from "react";
import { useQuery } from "@tanstack/react-query";
import RightSidebar from "../components/RightSidebar";
import { PopularPostData } from "../components/PopularPostItem";

async function fetchPopularPosts() {
  const res = await fetch(
    "https://test-connect-community.api.clo-set.com/api/post/search?sortBy=4&keyword=&pageSize=24&language=ko",
    { headers: { accept: "text/plain" } },
  );
  if (!res.ok) throw new Error("Failed to fetch popular posts");
  const data = await res.json();
  if (!data.posts) return [];
  const sortedPosts = data.posts.sort(
    (a: any, b: any) => b.likesCount - a.likesCount,
  );
  return sortedPosts.slice(0, 4);
}

export default function PopularPostContainer() {
  const { data: popularPosts } = useQuery({
    queryKey: ["popularPosts"],
    queryFn: fetchPopularPosts,
  });

  const handlePostClick = (post: PopularPostData) => {
    console.log("인기글 클릭:", post.title);
  };

  return (
    <RightSidebar popularPosts={popularPosts} onPostClick={handlePostClick} />
  );
}
