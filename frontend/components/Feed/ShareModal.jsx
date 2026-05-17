"use client";
import { useState, useRef } from "react";
import { useSharePost, useUnsharePost } from "@/hooks/usePosts";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Globe,
  Users,
  Lock,
  Repeat2,
  X,
  Loader2,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const PRIVACY_OPTIONS = [
  { value: "PUBLIC",  label: "Everyone",  description: "Visible to all ShareBear users",    icon: Globe,  color: "text-green-500",  bg: "bg-green-500/10"  },
  { value: "FRIENDS", label: "Friends",   description: "Only your followers can see this",   icon: Users,  color: "text-blue-500",   bg: "bg-blue-500/10"   },
  { value: "PRIVATE", label: "Only me",   description: "Only you can see this share",        icon: Lock,   color: "text-orange-500", bg: "bg-orange-500/10" },
];

const MOODS = ["🔥", "💯", "❤️", "😂", "🙌", "✨", "🤩", "🫶"];

function PostPreviewCard({ post }) {
  const authorName =
    post.user?.userInfo?.displayName ??
    [post.user?.userInfo?.firstName, post.user?.userInfo?.lastName]
      .filter(Boolean)
      .join(" ") ??
    post.user?.username ??
    "Unknown";
  const avatarSrc = post.user?.userInfo?.profilePictureUrl;
  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : null;
  const firstImage = post.images?.[0]?.imageUrl;
  const moreImages = (post.images?.length ?? 0) - 1;

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
      <div className="flex gap-3 p-3">
        <Avatar className="h-9 w-9 shrink-0 ring-1 ring-background">
          <AvatarImage src={avatarSrc} className="object-cover" />
          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
            {authorName[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{authorName}</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {post.user?.username ? `@${post.user.username}` : ""}
            {timeAgo ? ` · ${timeAgo}` : ""}
          </p>
          {post.caption && (
            <p className="text-sm mt-1.5 line-clamp-2 text-foreground/80 leading-relaxed">
              {post.caption}
            </p>
          )}
          {!post.caption && !firstImage && (
            <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground text-xs">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>No caption</span>
            </div>
          )}
        </div>

        {firstImage && (
          <div className="relative shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-muted">
            <img src={firstImage} alt="" className="h-full w-full object-cover" />
            {moreImages > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">+{moreImages}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShareModal({ postId, post, shared, open, onOpenChange }) {
  const [caption, setCaption] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const textareaRef = useRef(null);

  const sharePost  = useSharePost();
  const unsharePost = useUnsharePost();
  const isPending  = sharePost.isPending || unsharePost.isPending;

  const selectedPrivacy = PRIVACY_OPTIONS.find((o) => o.value === privacy);
  const PrivacyIcon = selectedPrivacy?.icon;

  const appendMood = (emoji) => {
    setCaption((prev) => (prev ? `${prev} ${emoji}` : emoji));
    textareaRef.current?.focus();
  };

  const handleShare = () => {
    sharePost.mutate(
      { postId, caption, privacyLevel: privacy },
      {
        onSuccess: () => {
          setCaption("");
          setPrivacy("PUBLIC");
          onOpenChange(false);
        },
      }
    );
  };

  const handleUnshare = () => {
    unsharePost.mutate(postId, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md p-0 overflow-hidden gap-0 rounded-2xl"
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Repeat2 className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold leading-tight">
                {shared ? "Manage Share" : "Share Post"}
              </h2>
              <p className="text-xs text-muted-foreground leading-tight">
                {shared
                  ? "Update or remove your share"
                  : "Repost to your followers"}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────── */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Post preview */}
          {post && <PostPreviewCard post={post} />}

          {/* Share controls (hidden when already shared) */}
          {!shared && (
            <>
              {/* Caption + mood row */}
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Say something about this post…"
                  maxLength={500}
                  rows={3}
                  className="resize-none text-sm placeholder:text-muted-foreground/60"
                />

                <div className="flex items-center justify-between">
                  {/* Emoji mood quick-picks */}
                  <div className="flex gap-0.5">
                    {MOODS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => appendMood(emoji)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-[15px] hover:bg-muted active:scale-90 transition-all"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <span
                    className={cn(
                      "text-xs tabular-nums transition-colors",
                      caption.length > 450
                        ? "text-orange-500 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {caption.length}/500
                  </span>
                </div>
              </div>

              {/* Audience selector */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Audience
                </p>
                <div className="flex gap-2">
                  {PRIVACY_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = privacy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPrivacy(opt.value)}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border transition-all text-center",
                          active
                            ? `${opt.bg} ${opt.color} border-current/30 shadow-sm`
                            : "border-transparent text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-medium leading-none">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPrivacy?.description}
                </p>
              </div>
            </>
          )}

          {/* Unshare danger zone */}
          {shared && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-destructive/25 bg-destructive/5">
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-destructive leading-tight">
                  Remove your share?
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  This will remove your repost from the feed. The original post is unaffected.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <div className="px-5 pb-5 pt-3 flex items-center justify-between gap-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-muted-foreground"
          >
            Cancel
          </Button>

          {shared ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleUnshare}
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Remove Share
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleShare}
              disabled={isPending}
              className="gap-2 px-6"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Repeat2 className="h-4 w-4" />
              )}
              Share Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}