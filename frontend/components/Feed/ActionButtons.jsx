import { usePostsStore } from "@/stores/usePostsStore";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLikePost } from "@/hooks/usePosts";
import toast from "react-hot-toast";
import { current } from "immer";

const ActionButtons = ({ postId }) => {
  const queryClient = useQueryClient();
  const likePostMutation = useLikePost();

  const postsData = queryClient.getQueryData(["posts", "infinite"]);
  const currentPost = postsData?.pages
    ?.flatMap((page) => page.posts)
    ?.find((post) => post.id === postId);

  console.log("postsData: ", currentPost);
  // console.log("Current Post: ", currentPost)

  const liked = currentPost?.liked || false;
  const allowsComments = currentPost?.allowsComments || false;
  const allowsShares = currentPost?.allowsShares || false;

  const { incrementShare } = usePostsStore();

  const handleLikeClick = () => {
    if (liked) {
      toast.error("You already liked this post.");
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
          disabled={likePostMutation.isPending}
          className={cn(
            "flex-1 h-9 text-sm font-medium",
            liked ? "text-red-500" : "text-muted-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4 mr-2", liked && "fill-current")} />
          Like
        </Button>

        {allowsComments && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-9 text-sm font-medium text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
        )}

        {allowsShares && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => incrementShare(postId)}
            className="flex-1 h-9 text-sm font-medium text-muted-foreground"
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
