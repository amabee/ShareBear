"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { usePostsStore } from "@/stores/usePostsStore";
import ActionButtons from "./ActionButtons";
import MediaCarousel from "./MediaCarousel";
import CaptionsWithHashtags from "./CaptionsWithHashtags";
import UserInfo from "./UserInfo";
import UserAvatar from "./UserAvatar";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import { useQueryClient } from "@tanstack/react-query";

export function ShareBearPost({ post }) {
  const { initializePostUI } = usePostsStore();
  const queryClient = useQueryClient();

  const [showComments, setShowComments] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    initializePostUI(post.id, {
      bookmarked: false,
      currentSlide: 0,
    });
  }, [post.id, initializePostUI]);

  // Get latest counts from React Query cache (updated optimistically by mutations)
  const cachedData = queryClient.getQueryData(["posts", "infinite"]);
  const cachedPost = cachedData?.pages
    ?.flatMap((page) => page.posts)
    ?.find((p) => p.id === post.id);

  const likeCount = cachedPost?._count?.likes ?? post._count?.likes ?? 0;
  const commentCount = cachedPost?._count?.comments ?? post._count?.comments ?? 0;
  const shareCount = cachedPost?._count?.shares ?? post._count?.shares ?? 0;
  const shared = cachedPost?.shared ?? post.shared ?? false;
  const allowsComments = cachedPost?.allowsComments ?? post.allowsComments;

  const handleActionClick = (type) => {
    if (type === "share") {
      setShareModalOpen(true);
    } else {
      setShowComments((prev) => !prev);
    }
  };

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
        <CaptionsWithHashtags caption={post.caption} />
      </div>

      {/* Media */}
      <MediaCarousel images={post.images} postId={post.id} />

      <CardContent className="p-4 pt-3">
        {/* Engagement Stats */}
        <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{likeCount.toLocaleString()} likes</span>
            <button
              className="hover:underline"
              onClick={() => allowsComments && setShowComments((p) => !p)}
            >
              {commentCount.toLocaleString()} comments
            </button>
            <span>{shareCount.toLocaleString()} shares</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-3" />

        {/* Action Buttons */}
        <ActionButtons
          postId={post.id}
          onCommentClick={handleActionClick}
          showComments={showComments}
        />

        {/* Comment Section */}
        {showComments && allowsComments && (
          <CommentSection postId={post.id} />
        )}

        {!allowsComments && (
          <div className="text-xs text-muted-foreground">
            Comments are disabled on this post.
          </div>
        )}
      </CardContent>

      {/* Share Modal */}
      <ShareModal
        postId={post.id}
        shared={shared}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </Card>
  );
}
