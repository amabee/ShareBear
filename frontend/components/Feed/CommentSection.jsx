"use client";
import { useState, useRef, useEffect } from "react";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useNextAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

function CommentItem({ comment, postId, currentUserId }) {
  const deleteComment = useDeleteComment(postId);
  const isOwner = comment.userId === currentUserId;

  return (
    <div className="flex gap-2 group">
      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
        <AvatarImage src={comment.user?.userInfo?.profilePictureUrl} />
        <AvatarFallback className="text-xs">
          {comment.user?.username?.[0]?.toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="bg-muted rounded-2xl px-3 py-2 inline-block max-w-full">
          <span className="text-xs font-semibold mr-1">
            {comment.user?.userInfo?.displayName || comment.user?.username}
          </span>
          <span className="text-sm break-words">{comment.content}</span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 px-1">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {isOwner && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => deleteComment.mutate(comment.id)}
          disabled={deleteComment.isPending}
        >
          {deleteComment.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useComments(postId);

  const createComment = useCreateComment(postId);

  const allComments = data?.pages?.flatMap((page) => page.comments ?? []) ?? [];

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || createComment.isPending) return;

    createComment.mutate(
      { content: trimmed },
      { onSuccess: () => setInput("") }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="mt-2 space-y-3">
      {/* Comment list */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {isLoading && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && allComments.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            No comments yet. Be the first!
          </p>
        )}

        {allComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            currentUserId={user?.id}
          />
        ))}

        {hasNextPage && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : null}
            Load more comments
          </Button>
        )}
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <Avatar className="h-7 w-7 shrink-0 mb-1">
          <AvatarImage src={user?.profilePictureUrl} />
          <AvatarFallback className="text-xs">
            {user?.username?.[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment…"
          rows={1}
          maxLength={1000}
          className="resize-none text-sm min-h-0 h-9 py-2 leading-5 rounded-2xl"
        />

        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          disabled={!input.trim() || createComment.isPending}
        >
          {createComment.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
