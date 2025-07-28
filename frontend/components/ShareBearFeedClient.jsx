"use client";
import { usePosts } from "@/hooks/usePosts";
import { ShareBearFeed } from "./ShareBearFeed";
import { LoaderCircle } from "lucide-react";
import { mockPosts } from "@/data/posts";

export default function ShareBearFeedClient() {
  const { data: posts, isLoading, error } = usePosts();

  console.log(posts);

  if (isLoading)
    return (
      <div className="flex items-center space-x-2">
        Loading feed...
        <LoaderCircle className="h-10 w-10" />
      </div>
    );
  if (error) return <div className="text-center">Error loading feed.</div>;

  const postsArray = Array.isArray(posts) ? posts : [];

  return <ShareBearFeed posts={postsArray} />;
}
