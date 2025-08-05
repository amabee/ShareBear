"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSuggestions } from "@/hooks/useUser";
import { useSuggestionsStore } from "@/stores/useSuggestionsStore";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function Suggestions() {
  const { data: session, status } = useSession();

  const {
    syncWithQueryData,
    getActiveSuggestions,
    toggleFollow,
    completeFollowAction,
    dismissSuggestion,
    isFollowPending,
    showAllSuggestions,
    toggleShowAllSuggestions,
  } = useSuggestionsStore();

  // TanStack Query
  const {
    data: suggestionsData,
    isLoading,
    error,
    refetch,
  } = useUserSuggestions(session?.user?.username);

  // Sync query data with Zustand store
  useEffect(() => {
    if (suggestionsData?.suggestions) {
      syncWithQueryData(suggestionsData.suggestions);
    }
  }, [suggestionsData, syncWithQueryData]);

  // Get active suggestions from store (with local state)
  const activeSuggestions = getActiveSuggestions();

  // Show limited suggestions by default, all when toggled
  const displayedSuggestions = showAllSuggestions
    ? activeSuggestions
    : activeSuggestions.slice(0, 5);

  const handleFollow = async (userId) => {
    try {
      // toggleFollow(userId);
      // await apiClient.post(`/api/users/${userId}/follow`);
      // completeFollowAction(userId, true);
      // refetch();
      toast.error("Function not yet implemented");
    } catch (error) {
      // Revert optimistic update
      completeFollowAction(userId, false);
      console.error("Failed to follow user:", error);
    }
  };

  console.log("Suggestions: ", suggestionsData);

  const handleSeeAll = () => {
    toggleShowAllSuggestions();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Suggested for you
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {/* Loading skeleton */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 animate-pulse"
                >
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Suggested for you
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm text-muted-foreground text-center py-4">
              Failed to load suggestions
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                className="ml-2"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (displayedSuggestions.length === 0) {
    return (
      <div className="">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Suggested for you
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm text-muted-foreground text-center py-4">
              No suggestions available
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      {/* Suggestions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Suggested for you
            </CardTitle>
            {activeSuggestions.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleSeeAll}
              >
                {showAllSuggestions ? "See Less" : "See All"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {displayedSuggestions.map((user) => {
              const isPending = isFollowPending(user.userId);

              return (
                <div key={user.userId} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.displayName || user.username}
                    />
                    <AvatarFallback className="font-semibold">
                      {`${user.userInfo?.firstName?.[0] ?? ""}${
                        user.userInfo?.lastName?.[0] ?? ""
                      }`.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {user.userInfo?.firstName} {user.userInfo?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Followed by {user.mutualFollowers} others
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => handleFollow(user.userId)}
                    disabled={isPending}
                  >
                    {isPending ? "Following..." : "Follow"}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="text-xs text-muted-foreground space-y-2 mt-6">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Press
          </a>
          <a href="#" className="hover:underline">
            API
          </a>
          <a href="#" className="hover:underline">
            Jobs
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
        <p>© 2025 ShareBear</p>
      </div>
    </div>
  );
}
