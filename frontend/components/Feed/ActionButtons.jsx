"use client";
import { usePostsStore } from "@/stores/usePostsStore";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLikePost, useUnlikePost } from "@/hooks/usePosts";
import { formatCount } from "@/utils/formatCount";

const ActionButtons = ({ postId, onCommentClick, showComments, likeCount = 0, commentCount = 0, shareCount = 0 }) => {
  const queryClient = useQueryClient();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();
  const [likeAnimating, setLikeAnimating] = useState(false);

  const postsData = queryClient.getQueryData(["posts", "infinite"]);
  const currentPost = postsData?.pages
    ?.flatMap((page) => page.posts)
    ?.find((post) => post.id === postId);

  const liked        = currentPost?.liked        || false;
  const allowsComments = currentPost?.allowsComments || false;
  const allowsShares   = currentPost?.allowsShares   || false;

  const isMutating = likePostMutation.isPending || unlikePostMutation.isPending;

  const handleLikeClick = () => {
    if (isMutating) return;
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);
    if (liked) unlikePostMutation.mutate(postId);
    else likePostMutation.mutate(postId);
  };

  return (
    <div className="flex items-center gap-0.5 py-1">
      {/* Like */}
      <button
        onClick={handleLikeClick}
        disabled={isMutating}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-muted active:scale-95",
          liked ? "text-rose-500" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Heart
          className={cn(
            "h-[22px] w-[22px] transition-all",
            liked && "fill-rose-500",
            likeAnimating && "animate-like-pop"
          )}
        />
        {likeCount > 0 && (
          <span className="text-[13px] font-semibold tabular-nums">{formatCount(likeCount)}</span>
        )}
      </button>

      {/* Comment */}
      {allowsComments && (
        <button
          onClick={onCommentClick}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-muted active:scale-95",
            showComments ? "text-blue-500" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageCircle className={cn("h-[22px] w-[22px]", showComments && "fill-blue-500/20 stroke-blue-500")} />
          {commentCount > 0 && (
            <span className="text-[13px] font-semibold tabular-nums">{formatCount(commentCount)}</span>
          )}
        </button>
      )}

      {/* Share */}
      {allowsShares && (
        <button
          onClick={() => onCommentClick?.("share")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 active:scale-95"
        >
          <Share2 className="h-[22px] w-[22px]" />
          {shareCount > 0 && (
            <span className="text-[13px] font-semibold tabular-nums">{formatCount(shareCount)}</span>
          )}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;


const ActionButtons = ({ postId, onCommentClick, showComments }) => {
  const queryClient = useQueryClient();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();

  const postsData = queryClient.getQueryData(["posts", "infinite"]);
  const currentPost = postsData?.pages
    ?.flatMap((page) => page.posts)
    ?.find((post) => post.id === postId);

  const liked = currentPost?.liked || false;
  const allowsComments = currentPost?.allowsComments || false;
  const allowsShares = currentPost?.allowsShares || false;
  const shared = currentPost?.shared || false;

  const isMutating = likePostMutation.isPending || unlikePostMutation.isPending;

  const handleLikeClick = () => {
    if (liked) {
      unlikePostMutation.mutate(postId);
      return;
    }
    likePostMutation.mutate(postId);
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-1 flex-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLikeClick}
          disabled={isMutating}
          className={cn(
            "flex-1 h-9 text-sm font-medium",
            liked ? "text-red-500" : "text-muted-foreground"
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 mr-2",
              liked && "fill-current",
              isMutating && "animate-pulse"
            )}
          />
          Like
        </Button>

        {allowsComments && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCommentClick}
            className={cn(
              "flex-1 h-9 text-sm font-medium",
              showComments ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MessageCircle className={cn("h-4 w-4 mr-2", showComments && "fill-current")} />
            Comment
          </Button>
        )}

        {allowsShares && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCommentClick?.("share")}
            className={cn(
              "flex-1 h-9 text-sm font-medium",
              shared ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Share className={cn("h-4 w-4 mr-2", shared && "fill-current")} />
            Share
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
