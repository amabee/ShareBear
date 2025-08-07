"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { usePostsStore } from "@/stores/usePostsStore";
import ActionButtons from "./ActionButtons";
import MediaCarousel from "./MediaCarousel";
import CaptionsWithHashtags from "./CaptionsWithHashtags";
import UserInfo from "./UserInfo";
import UserAvatar from "./UserAvatar";

export function ShareBearPost({ post }) {
  const { initializePostUI } = usePostsStore();

  useEffect(() => {
    initializePostUI(post.id, {
      bookmarked: false,
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
          <CaptionsWithHashtags caption={post.caption} />
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
