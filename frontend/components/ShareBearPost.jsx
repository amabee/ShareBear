"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareBearPost({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <Card className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={post.user.avatar || "/placeholder.svg"}
              alt={post.user.displayName}
            />
            <AvatarFallback>{post.user.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-sm">
                {post.user.username}
              </span>
              {post.user.verified && (
                <CheckCircle className="h-3 w-3 text-blue-500 fill-current" />
              )}
            </div>
            {post.location && (
              <span className="text-xs text-muted-foreground">
                {post.location}
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Images */}
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <Image
            src={post.images[currentImageIndex] || "/placeholder.svg"}
            alt="Post content"
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {post.images.length > 1 && (
          <>
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={() =>
                  setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
                }
                disabled={currentImageIndex === 0}
              >
                ←
              </Button>
            </div>
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={() =>
                  setCurrentImageIndex(
                    Math.min(post.images.length - 1, currentImageIndex + 1)
                  )
                }
                disabled={currentImageIndex === post.images.length - 1}
              >
                →
              </Button>
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {post.images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CardContent className="p-4">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={cn("h-8 w-8 p-0", liked && "text-red-500")}
            >
              <Heart className={cn("h-6 w-6", liked && "fill-current")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={cn("h-8 w-8 p-0", bookmarked && "text-yellow-500")}
          >
            <Bookmark className={cn("h-6 w-6", bookmarked && "fill-current")} />
          </Button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm">
            {likeCount.toLocaleString()} likes
          </span>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">
            {post.user.username}
          </span>
          <span className="text-sm">{post.content}</span>
        </div>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.hashtags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Comments */}
        <div className="text-sm text-muted-foreground mb-2">
          View all {post.comments} comments
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground uppercase">
          {post.timestamp}
        </div>
      </CardContent>
    </Card>
  );
}
