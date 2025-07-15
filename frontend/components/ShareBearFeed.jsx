"use client";

import { ShareBearPost } from "./ShareBearPost";

const mockPosts = [
  {
    id: "1",
    user: {
      username: "sarah_chen",
      displayName: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    content:
      "Just discovered this hidden gem in the city! 🌟 The vibes are absolutely perfect for a chill afternoon ☕",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    timestamp: "2 hours ago",
    likes: 1234,
    comments: 89,
    shares: 23,
    liked: false,
    location: "Downtown Coffee Co.",
    hashtags: ["#coffee", "#vibes", "#citylife", "#hidden gems"],
  },
  {
    id: "2",
    user: {
      username: "meme_central",
      displayName: "Meme Central",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content:
      "When you finally understand that one meme everyone's been laughing at 😂😂😂",
    images: ["/placeholder.svg?height=600&width=600"],
    timestamp: "4 hours ago",
    likes: 5678,
    comments: 234,
    shares: 89,
    liked: true,
    hashtags: ["#memes", "#relatable", "#mood", "#finally"],
  },
];

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
