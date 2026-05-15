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
    <Card className="max-w-xl mx-auto border-none shadow-md dark:shadow-black/30 rounded-2xl overflow-hidden bg-white dark:bg-[#1E1E2F]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center space-x-3">
          <UserAvatar user={post.user} />
          <UserInfo
            user={post.user}
            timestamp={post.timestamp}
            location={post.location}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-3 text-sm">
          <CaptionsWithHashtags caption={post.caption} />
        </div>
      )}

      {/* Media */}
      <MediaCarousel images={post.images} postId={post.id} />

      <CardContent className="px-4 pt-3 pb-4">
        {/* Engagement Stats */}
        {(likeCount > 0 || commentCount > 0 || shareCount > 0) && (
          <div className="flex items-center space-x-3 mb-3 text-sm text-muted-foreground">
            {likeCount > 0 && (
              <span className="font-medium text-foreground">{likeCount.toLocaleString()} <span className="font-normal text-muted-foreground">likes</span></span>
            )}
            {commentCount > 0 && (
              <button
                className="hover:underline hover:text-foreground transition-colors"
                onClick={() => allowsComments && setShowComments((p) => !p)}
              >
                <span className="font-medium text-foreground">{commentCount.toLocaleString()}</span> comments
              </button>
            )}
            {shareCount > 0 && (
              <span><span className="font-medium text-foreground">{shareCount.toLocaleString()}</span> shares</span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border mb-2" />

        {/* Action Buttons */}
        <ActionButtons
          postId={post.id}
          onCommentClick={handleActionClick}
          showComments={showComments}
        />

        {/* Comment Section */}
        {showComments && allowsComments && (
          <div className="mt-3 border-t border-border pt-3">
            <CommentSection postId={post.id} />
          </div>
        )}

        {!allowsComments && (
          <p className="text-xs text-muted-foreground text-center py-1">
            Comments are disabled on this post.
          </p>
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
