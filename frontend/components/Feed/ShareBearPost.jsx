"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ShareBearPost({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post._count?.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares || 0);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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

  // Function to render caption with inline hashtags
  const renderCaptionWithHashtags = (caption) => {
    const parts = caption.split(/(#\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span
            key={index}
            className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg border-none">
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

            {/* Username */}
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

      {/* Caption with inline hashtags */}
      <div className="px-4 pb-3">
        <div className="mb-2">
          <span className="text-sm">
            {renderCaptionWithHashtags(post.caption)}
          </span>
        </div>
      </div>

      {/* Images And Video with Carousel */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {post.images.map((media, index) => (
                <CarouselItem key={index}>
                  <AspectRatio
                    ratio={4 / 5}
                    className="overflow-hidden shadow-md bg-black"
                  >
                    {/* Check if the media is a video */}
                    {media.imageUrl &&
                      (media.imageUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                        <video
                          src={`${
                            process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL
                          }/${media.imageUrl.split("/").pop()}`}
                          className="w-full h-full object-cover"
                          controls
                          controlsList="nodownload noremoteplayback nofullscreen"
                          disablePictureInPicture
                          preload="metadata"
                          playsInline
                          muted
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          style={{
                            outline: "none",
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={`${
                            process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL
                          }/${media.imageUrl.split("/").pop()}`}
                          alt={`Post content ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 ease-in-out"
                        />
                      ))}
                  </AspectRatio>
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
