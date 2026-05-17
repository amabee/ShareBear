"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { MoreHorizontal, Bookmark, Repeat2 } from "lucide-react";
import { usePostsStore } from "@/stores/usePostsStore";
import ActionButtons from "./ActionButtons";
import MediaCarousel from "./MediaCarousel";
import CaptionsWithHashtags from "./CaptionsWithHashtags";
import UserInfo from "./UserInfo";
import UserAvatar from "./UserAvatar";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import { useQueryClient } from "@tanstack/react-query";
import { useLikePost, useUnlikePost } from "@/hooks/usePosts";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Nested original-post card shown inside a repost
function OriginalPostCard({ post }) {
  const hasMedia = post.images && post.images.length > 0;
  const authorName =
    post.user?.userInfo?.displayName ??
    [post.user?.userInfo?.firstName, post.user?.userInfo?.lastName]
      .filter(Boolean)
      .join(" ") ??
    post.user?.username ??
    "Unknown";
  const avatarSrc = post.user?.userInfo?.profilePictureUrl || post.user?.avatar;
  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : null;

  return (
    <div className="mx-3 mb-3 rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
      <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
        <Avatar className="h-8 w-8 ring-1 ring-background">
          <AvatarImage src={avatarSrc} className="object-cover" />
          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
            {authorName[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight truncate">{authorName}</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {post.user?.username ? `@${post.user.username}` : ""}
            {timeAgo ? ` · ${timeAgo}` : ""}
          </p>
        </div>
      </div>

      {post.caption && (
        <div className={cn("px-3", hasMedia ? "pb-2" : "pb-3")}>
          <CaptionsWithHashtags caption={post.caption} expandable />
        </div>
      )}

      {hasMedia && (
        <div className="rounded-b-xl overflow-hidden">
          <MediaCarousel images={post.images} postId={post.id} />
        </div>
      )}
    </div>
  );
}

export function ShareBearPost({ post }) {
  const { initializePostUI } = usePostsStore();
  const queryClient = useQueryClient();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();

  const [showComments, setShowComments] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [heartVisible, setHeartVisible] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: "50%", y: "50%" });
  const lastTapRef = useRef(0);

  useEffect(() => {
    initializePostUI(post.id, { bookmarked: false, currentSlide: 0 });
  }, [post.id, initializePostUI]);

  const cachedData = queryClient.getQueryData(["posts", "infinite"]);
  const cachedPost = cachedData?.pages
    ?.flatMap((page) => page.posts)
    ?.find((p) => (p.feedKey ?? p.id) === (post.feedKey ?? post.id));

  const likeCount    = cachedPost?._count?.likes    ?? post._count?.likes    ?? 0;
  const commentCount = cachedPost?._count?.comments ?? post._count?.comments ?? 0;
  const shareCount   = cachedPost?._count?.shares   ?? post._count?.shares   ?? 0;
  const liked        = cachedPost?.liked    ?? post.liked    ?? false;
  const shared       = cachedPost?.shared   ?? post.shared   ?? false;
  const allowsComments = cachedPost?.allowsComments ?? post.allowsComments;

  const handleDoubleTap = useCallback(
    (e) => {
      const now = Date.now();
      if (now - lastTapRef.current < 350) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.touches?.[0]?.clientX ?? e.clientX;
        const clientY = e.touches?.[0]?.clientY ?? e.clientY;
        setHeartPos({ x: `${clientX - rect.left}px`, y: `${clientY - rect.top}px` });
        setHeartVisible(true);
        setTimeout(() => setHeartVisible(false), 800);
        if (!liked) likePostMutation.mutate(post.id);
      }
      lastTapRef.current = now;
    },
    [liked, likePostMutation, post.id]
  );

  const handleActionClick = (type) => {
    if (type === "share") setShareModalOpen(true);
    else setShowComments((prev) => !prev);
  };

  const hasMedia = post.images && post.images.length > 0;

  const sharerName =
    post.sharedBy?.userInfo?.displayName ??
    [post.sharedBy?.userInfo?.firstName, post.sharedBy?.userInfo?.lastName]
      .filter(Boolean).join(" ") ??
    post.sharedBy?.username;
  const sharerAvatar = post.sharedBy?.userInfo?.profilePictureUrl;
  const sharedTimeAgo = post.sharedAt
    ? formatDistanceToNow(new Date(post.sharedAt), { addSuffix: true })
    : null;

  // Repost layout
  if (post.isRepost) {
    return (
      <article className="animate-fade-in-up">
        <div className="bg-card dark:bg-[#141420] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">

          {/* Sharer header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-background">
                  <AvatarImage src={sharerAvatar} className="object-cover" />
                  <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
                    {sharerName?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center ring-1 ring-background">
                  <Repeat2 className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{sharerName ?? "Someone"}</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  shared a post{sharedTimeAgo ? ` · ${sharedTimeAgo}` : ""}
                </p>
              </div>
            </div>
            <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Sharer optional caption */}
          {post.shareCaption && (
            <div className="px-4 pb-3 -mt-1">
              <p className="text-sm">{post.shareCaption}</p>
            </div>
          )}

          {/* Original post nested card */}
          <OriginalPostCard post={post} />

          <div className="px-2 pt-1">
            <ActionButtons
              postId={post.id}
              onCommentClick={handleActionClick}
              showComments={showComments}
              likeCount={likeCount}
              commentCount={commentCount}
              shareCount={shareCount}
            />
          </div>

          {showComments && allowsComments && (
            <div className="px-4 pb-4 pt-1 border-t border-border/50">
              <CommentSection postId={post.id} />
            </div>
          )}
          {!allowsComments && (
            <p className="text-xs text-muted-foreground text-center pb-3">Comments are disabled.</p>
          )}
        </div>

        <ShareModal
          postId={post.id}
          post={post}
          shared={shared}
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
        />
      </article>
    );
  }

  // Regular post layout
  return (
    <article className="animate-fade-in-up">
      <div className="bg-card dark:bg-[#141420] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">

        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <UserAvatar user={post.user} />
            <UserInfo user={post.user} timestamp={post.timestamp} location={post.location} />
          </div>
          <div className="flex items-center gap-0.5">
            <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        {post.caption && !hasMedia && (
          <div className="px-4 pb-5 pt-1">
            <CaptionsWithHashtags caption={post.caption} expandable />
          </div>
        )}

        {hasMedia && (
          <div
            className="relative"
            onDoubleClick={handleDoubleTap}
            onTouchEnd={handleDoubleTap}
          >
            <MediaCarousel images={post.images} postId={post.id} />
            {heartVisible && (
              <div
                className="pointer-events-none absolute z-10"
                style={{ left: heartPos.x, top: heartPos.y }}
              >
                <span className="text-7xl animate-heart-burst block drop-shadow-lg">❤️</span>
              </div>
            )}
          </div>
        )}

        {post.caption && hasMedia && (
          <div className="px-4 pt-3">
            <CaptionsWithHashtags caption={post.caption} expandable />
          </div>
        )}

        <div className="px-2 pt-1">
          <ActionButtons
            postId={post.id}
            onCommentClick={handleActionClick}
            showComments={showComments}
            likeCount={likeCount}
            commentCount={commentCount}
            shareCount={shareCount}
          />
        </div>

        {showComments && allowsComments && (
          <div className="px-4 pb-4 pt-1 border-t border-border/50">
            <CommentSection postId={post.id} />
          </div>
        )}
        {!allowsComments && (
          <p className="text-xs text-muted-foreground text-center pb-3">Comments are disabled.</p>
        )}
      </div>

      <ShareModal
        postId={post.id}
        post={post}
        shared={shared}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </article>
  );
}
