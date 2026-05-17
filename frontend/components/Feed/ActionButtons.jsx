"use client";
import { usePostsStore } from "@/stores/usePostsStore";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLikePost, useUnlikePost, useReactToPost, useRemovePostReaction } from "@/hooks/usePosts";
import { formatCount } from "@/utils/formatCount";

const REACTIONS = [
  { type: "LOVE",  emoji: "❤️",  label: "Love" },
  { type: "HAHA",  emoji: "😂",  label: "Haha" },
  { type: "WOW",   emoji: "😮",  label: "Wow"  },
  { type: "SAD",   emoji: "😢",  label: "Sad"  },
  { type: "ANGRY", emoji: "😡",  label: "Angry" },
  { type: "LIKE",  emoji: "👍",  label: "Like" },
];

const REACTION_COLORS = {
  LOVE:  "text-rose-500",
  HAHA:  "text-yellow-500",
  WOW:   "text-yellow-500",
  SAD:   "text-blue-400",
  ANGRY: "text-orange-500",
  LIKE:  "text-blue-500",
};

const ActionButtons = ({ postId, onCommentClick, showComments, likeCount = 0, commentCount = 0, shareCount = 0, myReaction }) => {
  const queryClient = useQueryClient();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();
  const reactToPostMutation = useReactToPost();
  const removeReactionMutation = useRemovePostReaction();
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const longPressTimeoutRef = useRef(null);
  const pickerRef = useRef(null);

  const postsData = queryClient.getQueryData(["posts", "infinite"]);
  const currentPost = postsData?.pages
    ?.flatMap((page) => page.posts)
    ?.find((post) => post.id === postId);

  const liked          = currentPost?.liked        || false;
  const allowsComments = currentPost?.allowsComments || false;
  const allowsShares   = currentPost?.allowsShares   || false;
  const reaction       = currentPost?.myReaction ?? myReaction ?? null;

  const isMutating = likePostMutation.isPending || unlikePostMutation.isPending;

  const openPicker = () => setShowReactionPicker(true);
  const closePicker = () => setShowReactionPicker(false);

  const handleLikeMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(openPicker, 500);
  };
  const handleLikeMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
  };
  const handlePickerMouseEnter = () => {
    clearTimeout(hoverTimeoutRef.current);
  };
  const handlePickerMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(closePicker, 200);
  };

  // long-press for mobile
  const handleTouchStart = () => {
    longPressTimeoutRef.current = setTimeout(openPicker, 500);
  };
  const handleTouchEnd = () => {
    clearTimeout(longPressTimeoutRef.current);
  };

  const handleLikeClick = () => {
    if (showReactionPicker) { closePicker(); return; }
    if (isMutating) return;
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);
    if (liked) unlikePostMutation.mutate(postId);
    else likePostMutation.mutate(postId);
  };

  const handleReactionClick = (reactionType) => {
    closePicker();
    if (reaction === reactionType) {
      removeReactionMutation.mutate(postId);
    } else {
      reactToPostMutation.mutate({ postId, reaction: reactionType });
    }
  };

  const heartColor = reaction ? REACTION_COLORS[reaction] : liked ? "text-rose-500" : "text-muted-foreground hover:text-foreground";

  return (
    <div className="flex items-center gap-0.5 py-0.5">
      {/* Like + reaction picker */}
      <div className="relative">
        {showReactionPicker && (
          <div
            ref={pickerRef}
            onMouseEnter={handlePickerMouseEnter}
            onMouseLeave={handlePickerMouseLeave}
            className="absolute bottom-full left-0 mb-1 z-50 bg-card border border-border shadow-xl rounded-full px-2 py-1.5 flex items-center gap-1 animate-fade-in-up"
          >
            {REACTIONS.map(({ type, emoji, label }) => (
              <button
                key={type}
                onClick={() => handleReactionClick(type)}
                title={label}
                className={cn(
                  "text-xl leading-none transition-transform hover:scale-125 p-1 rounded-full",
                  reaction === type && "scale-125 bg-muted"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={handleLikeClick}
          onMouseEnter={handleLikeMouseEnter}
          onMouseLeave={handleLikeMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={isMutating}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 hover:bg-muted active:scale-95",
            heartColor
          )}
        >
          <span className="text-base leading-none">
            {reaction
              ? REACTIONS.find((r) => r.type === reaction)?.emoji ?? "❤️"
              : <Heart
                  className={cn(
                    "h-5 w-5 transition-all cursor-pointer",
                    liked && "fill-rose-500",
                    likeAnimating && "animate-like-pop"
                  )}
                />
            }
          </span>
          {likeCount > 0 && (
            <span className="text-xs font-semibold tabular-nums">{formatCount(likeCount)}</span>
          )}
        </button>
      </div>

      {/* Comment */}
      {allowsComments && (
        <button
          onClick={onCommentClick}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 hover:bg-muted active:scale-95",
            showComments ? "text-blue-500" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageCircle className={cn("h-5 w-5", showComments && "fill-blue-500/20 stroke-blue-500")} />
          {commentCount > 0 && (
            <span className="text-xs font-semibold tabular-nums">{formatCount(commentCount)}</span>
          )}
        </button>
      )}

      {/* Share */}
      {allowsShares && (
        <button
          onClick={() => onCommentClick?.("share")}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 active:scale-95"
        >
          <Share2 className="h-5 w-5" />
          {shareCount > 0 && (
            <span className="text-xs font-semibold tabular-nums">{formatCount(shareCount)}</span>
          )}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;

