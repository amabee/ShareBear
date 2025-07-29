"use client";
import { usePosts } from "@/hooks/usePosts";
import { ShareBearFeed } from "../ShareBearFeed";
import { LoaderCircle } from "lucide-react";

export default function ShareBearFeedClient() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <LoaderCircle className="h-12 w-12 animate-spin" />
      </div>
    );

  if (error) return <div className="text-center">Error loading feed.</div>;

  const postsArray = Array.isArray(posts.posts) ? posts.posts : [];

  return <ShareBearFeed posts={postsArray} />;
}
