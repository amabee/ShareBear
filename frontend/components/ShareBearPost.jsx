"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  CheckCircle,
  Share,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareBearPost({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post._count?.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares || 0);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    setShareCount(shareCount + 1);
  };

  return (
    <Card className="max-w-lg mx-auto shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.user?.avatar || "/placeholder.svg"}
              alt={post.user?.displayName}
            />
            <AvatarFallback className="font-medium text-slate-600">
              {post.user?.displayName?.charAt(0) ||
                post.user?.userInfo?.firstName?.charAt(0) +
                  post.user?.userInfo?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-sm">
                {post.user?.displayName
                  ? post.user.displayName
                  : [
                      post.user?.userInfo?.firstName,
                      post.user?.userInfo?.middleName,
                      post.user?.userInfo?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
              </span>
              {post.user?.verified && (
                <CheckCircle className="h-3 w-3 text-blue-500 fill-current" />
              )}
            </div>

            {/* 👇 Username added here */}
            {post.user?.username && (
              <div className="text-xs text-muted-foreground leading-none mt-1">
                @{post.user.username}
              </div>
            )}

            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>{post.timestamp}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Caption - Above images like Facebook */}
      <div className="px-4 pb-3">
        <div className="mb-2">
          <span className="text-sm">{post.caption}</span>
        </div>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.hashtags.map((tag) => (
              <Badge
                key={tag.hashtag.id}
                variant="secondary"
                className="text-xs font-medium rounded-full bg-muted border border-border px-3 py-1 hover:bg-muted/70 transition-colors"
              >
                #{tag.hashtag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Images with Carousel */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {post.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Post content ${index + 1}`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {post.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>

          {/* Dots Indicator */}
          {post.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {post.images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === current ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <CardContent className="p-4 pt-3">
        {/* Engagement Stats */}
        <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{likeCount.toLocaleString()} likes</span>
            <span>{post._count?.comments.toLocaleString()} comments</span>
            <span>{shareCount.toLocaleString()} shares</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-3"></div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex-1 h-9 text-sm font-medium",
                liked ? "text-red-500" : "text-muted-foreground"
              )}
            >
              <Heart className={cn("h-4 w-4 mr-2", liked && "fill-current")} />
              Like
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-9 text-sm font-medium text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Comment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex-1 h-9 text-sm font-medium text-muted-foreground"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={cn("h-8 w-8 p-0 ml-2", bookmarked && "text-yellow-500")}
          >
            <Bookmark className={cn("h-5 w-5", bookmarked && "fill-current")} />
          </Button>
        </div>

        {/* Comments Preview */}
        <div className="text-sm text-muted-foreground">
          View all {post._count?.comments.toLocaleString()} comments
        </div>
      </CardContent>
    </Card>
  );
}
