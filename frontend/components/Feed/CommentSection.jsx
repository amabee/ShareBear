"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useReactToComment,
  useRemoveCommentReaction,
  useReplies,
} from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useNextAuth";
import { useUserDetail } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2, Send, Loader2, Smile, CornerDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn, decodeHtmlEntities } from "@/lib/utils";

const EMOJI_TO_REACTION = {
  "❤️": "LOVE",
  "😂": "HAHA",
  "😮": "WOW",
  "😢": "SAD",
  "😡": "ANGRY",
  "👍": "LIKE",
};
const REACTION_TO_EMOJI = Object.fromEntries(
  Object.entries(EMOJI_TO_REACTION).map(([e, r]) => [r, e])
);
const REACTIONS = Object.keys(EMOJI_TO_REACTION);

// Inline reply input — appears right below the target comment, auto-focuses
function InlineReplyInput({ postId, parentCommentId, replyingToUsername, onCancel, onSuccess }) {
  const [input, setInput] = useState(`@${replyingToUsername} `);
  const textareaRef = useRef(null);
  const createComment = useCreateComment(postId);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, []);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || createComment.isPending) return;
    createComment.mutate(
      { content: trimmed, parentCommentId },
      { onSuccess: () => { onSuccess?.(); onCancel(); } }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end mt-1.5 ml-10">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => { setInput(e.target.value); autoResize(); }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
          if (e.key === "Escape") onCancel();
        }}
        placeholder={`Reply to @${replyingToUsername}\u2026`}
        maxLength={1000}
        rows={1}
        className="flex-1 resize-none overflow-hidden text-sm py-1.5 px-3 rounded-2xl border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-5 min-h-[32px] max-h-28"
      />
      <Button type="submit" size="icon" className="h-8 w-8 shrink-0 rounded-full" disabled={!input.trim() || createComment.isPending}>
        {createComment.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
      </Button>
      <button type="button" onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground self-center shrink-0">Cancel</button>
    </form>
  );
}

function ReplyThread({ postId, commentId, currentUserId, activeReplyId, onSetActiveReply, depth = 1 }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useReplies(postId, commentId, true);
  const allReplies = data?.pages?.flatMap((p) => p.replies ?? []) ?? [];
  return (
    <div className="space-y-1.5">
      {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground mx-auto" />}
      {allReplies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} currentUserId={currentUserId} depth={depth} activeReplyId={activeReplyId} onSetActiveReply={onSetActiveReply} />
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {isFetchingNextPage ? <Loader2 className="h-3 w-3 animate-spin" /> : <CornerDownRight className="h-3 w-3" />}
          Load more replies
        </button>
      )}
    </div>
  );
}

function CommentItem({ comment, postId, currentUserId, depth = 0, activeReplyId, onSetActiveReply }) {
  const deleteComment = useDeleteComment(postId);
  const reactToComment = useReactToComment();
  const removeReaction = useRemoveCommentReaction();
  const isOwner = comment.userId === currentUserId;
  const [showReplies, setShowReplies] = useState(false);
  const [myReaction, setMyReaction] = useState(null);
  const replyCount = comment._count?.replies ?? 0;
  const isReplying = activeReplyId === comment.id;
  const replyThreadRef = useRef(null);

  // scroll newly expanded replies into view inside the scroll container
  useEffect(() => {
    if (showReplies && replyThreadRef.current) {
      replyThreadRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [showReplies]);

  const handleReaction = (emoji) => {
    const reaction = EMOJI_TO_REACTION[emoji];
    if (myReaction === reaction) {
      removeReaction.mutate({ commentId: comment.id, postId });
      setMyReaction(null);
    } else {
      reactToComment.mutate({ commentId: comment.id, reaction, postId });
      setMyReaction(reaction);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2 group">
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
          <AvatarImage src={comment.user?.userInfo?.profilePictureUrl} />
          <AvatarFallback className="text-xs">{comment.user?.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="relative inline-block max-w-full">
            <div className="bg-muted rounded-2xl px-3 py-2">
              <span className="text-xs font-semibold mr-1">{comment.user?.userInfo?.displayName || comment.user?.username}</span>
              <span className="text-sm break-words">{decodeHtmlEntities(comment.content)}</span>
            </div>
            {myReaction && (
              <div className="absolute -bottom-2.5 right-1 flex items-center bg-background border rounded-full px-1.5 py-0.5 text-[11px] shadow-sm">
                {REACTION_TO_EMOJI[myReaction]}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 px-1">
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Smile className={cn("h-3.5 w-3.5 transition-colors", myReaction ? "text-primary" : "text-muted-foreground hover:text-foreground")} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1.5" side="top" align="start">
                <div className="flex gap-0.5">
                  {REACTIONS.map((emoji) => (
                    <button key={emoji} onClick={() => handleReaction(emoji)} className={cn("text-lg leading-none p-1.5 rounded-xl hover:bg-muted transition-all hover:scale-125", myReaction === EMOJI_TO_REACTION[emoji] && "bg-muted ring-1 ring-ring")}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <button onClick={() => onSetActiveReply(isReplying ? null : comment.id)} className="text-xs font-semibold text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">{isReplying ? "Cancel" : "Reply"}</button>
            {isOwner && (
              <button onClick={() => deleteComment.mutate(comment.id)} disabled={deleteComment.isPending} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                {deleteComment.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Inline reply input — right below this comment */}
      {isReplying && (
        <InlineReplyInput
          postId={postId}
          parentCommentId={comment.id}
          replyingToUsername={comment.user?.username}
          onCancel={() => onSetActiveReply(null)}
          onSuccess={() => setShowReplies(true)}
        />
      )}

      {replyCount > 0 && (
        // cap visual indentation at depth 2 so deep threads don't get too narrow
        <div className={cn("space-y-1.5", depth < 2 ? "pl-10" : "pl-4")} ref={replyThreadRef}>
          {!showReplies ? (
            <button onClick={() => setShowReplies(true)} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <CornerDownRight className="h-3 w-3" />
              View {replyCount} {replyCount === 1 ? "reply" : "replies"}
            </button>
          ) : (
            <>
              <ReplyThread postId={postId} commentId={comment.id} currentUserId={currentUserId} activeReplyId={activeReplyId} onSetActiveReply={onSetActiveReply} depth={depth + 1} />
              <button onClick={() => setShowReplies(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Hide replies</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const { data: profileData } = useUserDetail(user?.username);
  const avatarUrl = profileData?.user?.userInfo?.profilePictureUrl;
  const [input, setInput] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const textareaRef = useRef(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useComments(postId);
  const createComment = useCreateComment(postId);
  const allComments = data?.pages?.flatMap((page) => page.comments ?? []) ?? [];

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || createComment.isPending) return;
    createComment.mutate(
      { content: trimmed, parentCommentId: null },
      { onSuccess: () => { setInput(""); if (textareaRef.current) textareaRef.current.style.height = "auto"; } }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <div className="mt-2 space-y-3">
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {isLoading && <div className="flex justify-center py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>}
        {!isLoading && allComments.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Be the first!</p>}
        {allComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} currentUserId={user?.id} activeReplyId={activeReplyId} onSetActiveReply={setActiveReplyId} />
        ))}
        {hasNextPage && (
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
            Load more comments
          </Button>
        )}
      </div>
      {/* Bottom input — top-level new comments only */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <Avatar className="h-7 w-7 shrink-0 mb-1">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-xs">{user?.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); autoResize(); }}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment…"
          maxLength={1000}
          rows={1}
          className="flex-1 resize-none overflow-hidden text-sm py-2 px-3 rounded-2xl border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-5 min-h-[36px] max-h-36"
        />
        <Button type="submit" size="icon" className="h-9 w-9 shrink-0 rounded-full" disabled={!input.trim() || createComment.isPending}>
          {createComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
