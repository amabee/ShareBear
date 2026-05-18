"use client";
import { usePost } from "@/hooks/usePosts";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Link2,
  Trash2,
  Flag,
  MapPin,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useAuth } from "@/hooks/useNextAuth";
import { useBookmarkPost, useUnbookmarkPost, useDeletePost } from "@/hooks/usePosts";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MediaCarousel from "@/components/Feed/MediaCarousel";
import CaptionsWithHashtags from "@/components/Feed/CaptionsWithHashtags";
import ActionButtons from "@/components/Feed/ActionButtons";
import CommentSection from "@/components/Feed/CommentSection";
import ShareModal from "@/components/Feed/ShareModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { formatCount } from "@/utils/formatCount";

function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border/60 px-4 h-14 flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="max-w-5xl mx-auto lg:flex lg:h-[calc(100vh-56px)]">
        <div className="lg:flex-1 lg:border-r border-border/60">
          <Skeleton className="w-full aspect-square" />
        </div>
        <div className="lg:w-[400px] p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function PostDetailView({ postId }) {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = usePost(postId);
  const bookmarkMutation = useBookmarkPost();
  const unbookmarkMutation = useUnbookmarkPost();
  const deletePostMutation = useDeletePost();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Seed/update this post in the infinite feed cache so ActionButtons reads
  // the correct liked/bookmarked/myReaction state even on a direct URL visit.
  useEffect(() => {
    if (!data?.post) return;
    const post = data.post;
    queryClient.setQueryData(["posts", "infinite"], (old) => {
      if (!old) {
        return {
          pages: [{ posts: [post], pagination: {} }],
          pageParams: [1],
        };
      }
      // Always update the post with fresh data from getPost
      let found = false;
      const updated = {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          posts: page.posts?.map((p) => {
            if (p.id === post.id) {
              found = true;
              return { ...p, liked: post.liked, bookmarked: post.bookmarked, myReaction: post.myReaction, _count: post._count };
            }
            return p;
          }),
        })),
      };
      if (!found) {
        // Insert into first page if not present
        updated.pages[0] = { ...updated.pages[0], posts: [post, ...(updated.pages[0].posts ?? [])] };
      }
      return updated;
    });
  }, [data?.post?.id, queryClient]);

  if (isLoading) return <PostDetailSkeleton />;

  if (error || !data?.post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="font-medium">Post not found</p>
          <p className="text-sm text-muted-foreground">
            This post may have been deleted or is unavailable.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-primary hover:underline block mx-auto"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const post = data.post;

  // Pull live data from the infinite feed cache if available
  const cachedData = queryClient.getQueryData(["posts", "infinite"]);
  const cachedPost = cachedData?.pages
    ?.flatMap((page) => page.posts)
    ?.find((p) => p.id === post.id);

  const likeCount    = cachedPost?._count?.likes    ?? post._count?.likes    ?? 0;
  const commentCount = cachedPost?._count?.comments ?? post._count?.comments ?? 0;
  const shareCount   = cachedPost?._count?.shares   ?? post._count?.shares   ?? 0;
  const liked        = cachedPost?.liked      ?? post.liked      ?? false;
  const shared       = cachedPost?.shared     ?? post.shared     ?? false;
  const bookmarked   = cachedPost?.bookmarked ?? post.bookmarked ?? false;
  const myReaction   = cachedPost?.myReaction ?? post.myReaction ?? null;
  const allowsComments = cachedPost?.allowsComments ?? post.allowsComments;

  const isOwnPost = authUser?.id === post.userId || authUser?.userId === post.userId;
  const hasMedia = post.images && post.images.length > 0;

  const displayName =
    post.user?.userInfo?.displayName ||
    [post.user?.userInfo?.firstName, post.user?.userInfo?.lastName].filter(Boolean).join(" ") ||
    post.user?.username ||
    "Unknown";

  const avatarSrc = post.user?.userInfo?.profilePictureUrl;
  const avatarFallback = displayName?.[0]?.toUpperCase() ?? "?";

  const fullDate = post.createdAt
    ? format(new Date(post.createdAt), "MMMM d, yyyy 'at' h:mm a")
    : null;

  const handleBookmarkToggle = () => {
    if (bookmarked) unbookmarkMutation.mutate(post.id);
    else bookmarkMutation.mutate(post.id);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied!"),
      () => toast.error("Failed to copy link.")
    );
  };

  const handleDeletePost = () => {
    deletePostMutation.mutate(post.id, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border/60 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold text-base">Post</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmarkToggle}
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center transition-colors",
              bookmarked
                ? "text-amber-500"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {bookmarked
              ? <BookmarkCheck className="h-5 w-5 fill-amber-500" />
              : <Bookmark className="h-5 w-5" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
                <Link2 className="h-4 w-4" /> Copy link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info("Report submitted.")}
                className="gap-2 cursor-pointer"
              >
                <Flag className="h-4 w-4" /> Report
              </DropdownMenuItem>
              {isOwnPost && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeletePost}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" /> Delete post
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Two-column layout on desktop — only for posts with media */}
      {hasMedia ? (
        <div className="max-w-5xl mx-auto lg:flex lg:h-[calc(100vh-56px)]">

          {/* LEFT — media */}
          <div className="lg:flex-1 lg:border-r border-border/60 lg:flex lg:items-center lg:justify-center bg-black/5 dark:bg-black/20">
            <div className="w-full">
              <MediaCarousel images={post.images} postId={post.id} />
            </div>
          </div>

          {/* RIGHT — info + comments (scrollable) */}
          <div className="lg:w-[400px] lg:shrink-0 flex flex-col lg:h-[calc(100vh-56px)]">
            <div className="flex-1 overflow-y-auto">
              {/* User info */}
              <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-border/60">
                <Link href={`/profile/${post.user?.id}`}>
                  <Avatar className="h-10 w-10 ring-2 ring-background shrink-0">
                    <AvatarImage src={avatarSrc} className="object-cover" />
                    <AvatarFallback className="text-sm font-semibold">{avatarFallback}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="min-w-0">
                  <Link href={`/profile/${post.user?.id}`} className="font-semibold text-sm hover:underline leading-tight block">
                    {displayName}
                  </Link>
                  {post.user?.username && (
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">@{post.user.username}</p>
                  )}
                </div>
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="px-4 py-3 border-b border-border/60">
                  <CaptionsWithHashtags caption={post.caption} expandable={false} />
                </div>
              )}

              {/* Location */}
              {post.location && (
                <div className="px-4 py-2 flex items-center gap-1 text-xs text-muted-foreground border-b border-border/60">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{post.location}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="px-2 border-b border-border/60">
                <ActionButtons
                  postId={post.id}
                  onCommentClick={() => {}}
                  showComments={false}
                  likeCount={likeCount}
                  commentCount={commentCount}
                  shareCount={shareCount}
                  myReaction={myReaction}
                />
              </div>

              {/* Stats + timestamp */}
              <div className="px-4 py-2 border-b border-border/60 space-y-0.5">
                {(likeCount > 0 || commentCount > 0 || shareCount > 0) && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {likeCount > 0 && <span><strong className="text-foreground font-semibold">{formatCount(likeCount)}</strong> {likeCount === 1 ? "like" : "likes"}</span>}
                    {commentCount > 0 && <span><strong className="text-foreground font-semibold">{formatCount(commentCount)}</strong> {commentCount === 1 ? "comment" : "comments"}</span>}
                    {shareCount > 0 && <span><strong className="text-foreground font-semibold">{formatCount(shareCount)}</strong> {shareCount === 1 ? "share" : "shares"}</span>}
                  </div>
                )}
                {fullDate && <p className="text-xs text-muted-foreground/60">{fullDate}</p>}
              </div>

              {/* Comments */}
              {allowsComments ? (
                <div className="px-4 pt-3 pb-8">
                  <CommentSection postId={post.id} />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Comments are disabled on this post.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── TEXT-ONLY POST — single centered column ── */
        <div className="max-w-2xl mx-auto px-4 pb-10">
          {/* Author card */}
          <div className="flex items-center gap-3 py-5">
            <Link href={`/profile/${post.user?.id}`}>
              <Avatar className="h-11 w-11 ring-2 ring-background shrink-0">
                <AvatarImage src={avatarSrc} className="object-cover" />
                <AvatarFallback className="text-sm font-semibold">{avatarFallback}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${post.user?.id}`} className="font-semibold text-sm hover:underline leading-tight block">
                {displayName}
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">
                {post.user?.username ? `@${post.user.username}` : ""}
                {fullDate ? ` · ${fullDate}` : ""}
              </p>
            </div>
          </div>

          {/* Caption — large, prominent */}
          {post.caption && (
            <div className="pb-5 text-base leading-relaxed">
              <CaptionsWithHashtags caption={post.caption} expandable={false} />
            </div>
          )}

          {/* Location */}
          {post.location && (
            <div className="pb-4 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{post.location}</span>
            </div>
          )}

          <div className="border-t border-border/60" />

          {/* Action buttons */}
          <div className="px-1">
            <ActionButtons
              postId={post.id}
              onCommentClick={() => {}}
              showComments={false}
              likeCount={likeCount}
              commentCount={commentCount}
              shareCount={shareCount}
              myReaction={myReaction}
            />
          </div>

          {/* Stats */}
          {(likeCount > 0 || commentCount > 0 || shareCount > 0) && (
            <div className="pb-3 flex items-center gap-3 text-xs text-muted-foreground">
              {likeCount > 0 && <span><strong className="text-foreground font-semibold">{formatCount(likeCount)}</strong> {likeCount === 1 ? "like" : "likes"}</span>}
              {commentCount > 0 && <span><strong className="text-foreground font-semibold">{formatCount(commentCount)}</strong> {commentCount === 1 ? "comment" : "comments"}</span>}
              {shareCount > 0 && <span><strong className="text-foreground font-semibold">{formatCount(shareCount)}</strong> {shareCount === 1 ? "share" : "shares"}</span>}
            </div>
          )}

          <div className="border-t border-border/60" />

          {/* Comments */}
          {allowsComments ? (
            <div className="pt-4">
              <CommentSection postId={post.id} />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">
              Comments are disabled on this post.
            </p>
          )}
        </div>
      )}

      <ShareModal
        postId={post.id}
        post={post}
        shared={shared}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </div>
  );
}
