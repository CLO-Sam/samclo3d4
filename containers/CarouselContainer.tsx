import React from "react";
import { useQuery } from "@tanstack/react-query";
import Carousel, { BannerPost } from "../components/Carousel";

async function getBanners(): Promise<BannerPost[]> {
  const res = await fetch(
    "https://test-connect-community.api.clo-set.com/api/post/search?isBanner=true&pageSize=12&sortBy=5&language=2%20%3D%20KO",
    { headers: { accept: "text/plain" } },
  );
  if (!res.ok) throw new Error("Failed to fetch banners");
  const data = await res.json();
  return data.posts || [];
}

export default function CarouselContainer() {
  const { data: banners } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  const handlePostClick = (post: BannerPost) => {
    console.log("배너 클릭:", post.title);
  };

  return <Carousel banners={banners} onPostClick={handlePostClick} />;
}
