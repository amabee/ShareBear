"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
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
import { usePostsStore } from "@/stores/usePostsStore";
import ActionButtons from "./ActionButtons";

// Memoized components for better performance
const UserAvatar = ({ user }) => (
  <Avatar className="h-10 w-10">
    <AvatarImage
      src={user?.avatar || "/placeholder.svg"}
      alt={user?.displayName}
    />
    <AvatarFallback className="font-medium text-slate-600">
      {user?.displayName?.charAt(0) ||
        user?.userInfo?.firstName?.charAt(0) +
          user?.userInfo?.lastName?.charAt(0)}
    </AvatarFallback>
  </Avatar>
);

const UserInfo = ({ user, timestamp, location }) => {
  const displayName = useMemo(() => {
    return user?.displayName
      ? user.displayName
      : [
          user?.userInfo?.firstName,
          user?.userInfo?.middleName,
          user?.userInfo?.lastName,
        ]
          .filter(Boolean)
          .join(" ");
  }, [user]);

  return (
    <div>
      <div className="flex items-center space-x-1">
        <span className="font-semibold text-sm">{displayName}</span>
        {user?.verified && (
          <CheckCircle className="h-3 w-3 text-blue-500 fill-current" />
        )}
      </div>

      {user?.username && (
        <div className="text-xs text-muted-foreground leading-none mt-1">
          @{user.username}
        </div>
      )}

      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
        <span>{timestamp}</span>
        {location && (
          <>
            <span>•</span>
            <span>{location}</span>
          </>
        )}
      </div>
    </div>
  );
};

const CaptionWithHashtags = ({ caption }) => {
  const renderedCaption = useMemo(() => {
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
  }, [caption]);

  return <span className="text-sm">{renderedCaption}</span>;
};

const MediaCarousel = ({ images, postId }) => {
  const currentSlide = usePostsStore(
    (state) => state.postUIState.get(postId)?.currentSlide || 0
  );
  const setCurrentSlide = usePostsStore((state) => state.setCurrentSlide);

  const videoRef = useRef(null);

  const handleCarouselChange = useCallback(
    (api) => {
      if (!api) return;

      const updateSlide = () => {
        setCurrentSlide(postId, api.selectedScrollSnap());
      };

      updateSlide();
      api.on("select", updateSlide);

      return () => api.off("select", updateSlide);
    },
    [postId, setCurrentSlide]
  );

  if (!images || images.length === 0) return null;

  return (
    <div className="relative">
      <Carousel className="w-full" setApi={handleCarouselChange}>
        <CarouselContent>
          {images.map((media, index) => (
            <CarouselItem key={index}>
              <AspectRatio
                ratio={4 / 5}
                className="overflow-hidden shadow-md bg-black"
              >
                {media.imageUrl &&
                  (media.imageUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video
                      ref={videoRef}
                      src={`${
                        process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL
                      }/posts/${media.imageUrl.split("/").pop()}`}
                      className="w-full h-full object-cover"
                      disablePictureInPicture
                      controls
                      controlsList="nodownload nofullscreen noremoteplaybook nopictureinpicture"
                      preload="metadata"
                      playsInline
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      style={{ outline: "none" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={`${
                        process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL
                      }/posts/${media.imageUrl.split("/").pop()}`}
                      alt={`Post content ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out"
                    />
                  ))}
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentSlide ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function ShareBearPost({ post }) {
  const { initializePostUI } = usePostsStore();

  // Initialize only UI state in Zustand
  useEffect(() => {
    initializePostUI(post.id, {
      bookmarked: false, // This could come from server later
      currentSlide: 0,
    });
  }, [post.id, initializePostUI]);

  // Get server state directly from the post prop (which comes from React Query)
  const likeCount = post._count?.likes || 0;
  const commentCount = post._count?.comments || 0;
  const shareCount = post._count?.shares || 0;
  const allowsComments = post.allowsComments;

  return (
    <Card className="max-w-md mx-auto shadow-lg border-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <UserAvatar user={post.user} />
          <UserInfo
            user={post.user}
            timestamp={post.timestamp}
            location={post.location}
          />
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <div className="mb-2">
          <CaptionWithHashtags caption={post.caption} />
        </div>
      </div>

      {/* Media Carousel */}
      <MediaCarousel images={post.images} postId={post.id} />

      <CardContent className="p-4 pt-3">
        {/* Engagement Stats */}
        <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{likeCount.toLocaleString()} likes</span>
            <span>{commentCount.toLocaleString()} comments</span>
            <span>{shareCount.toLocaleString()} shares</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-3"></div>

        {/* Action Buttons */}
        <ActionButtons postId={post.id} />

        {/* Comments Preview */}
        {allowsComments ? (
          <div className="text-sm text-muted-foreground">
            View all {commentCount.toLocaleString()} comments
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Comments not allowed on this post
          </div>
        )}
      </CardContent>
    </Card>
  );
}
