"use client";
import { useInfinitePosts } from "@/hooks/usePosts";
import { ShareBearFeed } from "@/components/Feed/ShareBearFeed";
import { LoaderCircle } from "lucide-react";
import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

export function ShareBearInfiniteFeedClient() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(5);

  const observerRef = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Flatten all posts from all pages
  const allPosts = data?.pages?.flatMap((page) => page.posts || []) || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <LoaderCircle className="h-12 w-12 animate-spin" />
      </div>
    );

  if (error) return <div className="text-center">Error loading feed.</div>;

  return (
    <div>
      <ShareBearFeed posts={allPosts} lastPostRef={lastPostRef} />

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-6 text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      )}

      {!hasNextPage && allPosts.length > 0 && (
        <div className="flex flex-col items-center py-10 text-muted-foreground">
          <div className="h-px w-40 bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
          <span className="text-3xl mb-2">🐻</span>
          <p className="text-sm font-medium">You&#39;re all caught up!</p>
          <p className="text-xs mt-1 text-muted-foreground/70">Check back later for more</p>
        </div>
      )}
    </div>
  );
}

// NEW: Manual load more button version
export function ShareBearManualLoadFeedClient() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(5); // 5 posts per page

  // Flatten all posts from all pages
  const allPosts = data?.pages?.flatMap((page) => page.posts || []) || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <LoaderCircle className="h-12 w-12 animate-spin" />
      </div>
    );

  if (error) return <div className="text-center">Error loading feed.</div>;

  return (
    <div>
      <ShareBearFeed posts={allPosts} />

      {/* Manual Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center py-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2"
          >
            {isFetchingNextPage ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load More Posts"
            )}
          </Button>
        </div>
      )}

      {/* End of feed indicator */}
      {!hasNextPage && allPosts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          You've reached the end of the feed! 🎉
        </div>
      )}
    </div>
  );
}
