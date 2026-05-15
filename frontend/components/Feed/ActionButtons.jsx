import { usePostsStore } from "@/stores/usePostsStore";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLikePost, useUnlikePost } from "@/hooks/usePosts";

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
