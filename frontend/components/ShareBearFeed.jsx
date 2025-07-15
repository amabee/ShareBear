"use client";

import { mockPosts } from "@/data/posts";
import { ShareBearPost } from "./ShareBearPost";



export function ShareBearFeed() {
  return (
    <div className="space-y-6">
      {/* Regular Posts */}
      {mockPosts.map((post) => (
        <ShareBearPost key={post.id} post={post} />
      ))}
    </div>
  );
}
