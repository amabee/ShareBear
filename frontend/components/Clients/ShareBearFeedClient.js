"use client";
import { usePosts, useInfinitePosts } from "@/hooks/usePosts";
import { ShareBearFeed } from "@/components/Feed/ShareBearFeed";
import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { usePostsStore } from "@/stores/usePostsStore";

export default function ShareBearFeedClient() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <LoaderCircle className="h-12 w-12 animate-spin" />
      </div>
    );

  if (error) return <div className="text-center">Error loading feed.</div>;

  const postsArray = Array.isArray(posts.posts) ? posts.posts : [];

  return <ShareBearFeed posts={postsArray} />;
}

// NEW: Infinite scroll version
export function ShareBearInfiniteFeedClient() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(5);

  const { batchUpdateInteractions } = usePostsStore();

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

  useEffect(() => {
    if (allPosts.length > 0) {
      const updates = allPosts.map((post) => ({
        postId: post.id,
        data: {
          liked: post.liked,
          likeCount: post._count?.likes || 0,
          shareCount: post.shares || 0,
        },
      }));
      batchUpdateInteractions(updates);
    }
  }, [allPosts, batchUpdateInteractions]);

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

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <LoaderCircle className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading more posts...</span>
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
