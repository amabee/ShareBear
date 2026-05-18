"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFollowUser, useUserSuggestions } from "@/hooks/useUser";
import { useSuggestionsStore } from "@/stores/useSuggestionsStore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import SuggestionsSkeleton from "../Skeletons/SuggestionsSkeleton";
import SuggestionsError from "../ErrorStates/SuggestionsError";

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

  const followUserMutatation = useFollowUser();

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
    toggleFollow(userId);
    try {
      await followUserMutatation.mutateAsync(userId, true);
      completeFollowAction(userId, true);

    } catch (error) {
      completeFollowAction(userId, false);
    }
  };

  const handleSeeAll = () => {
    toggleShowAllSuggestions();
  };

  // Loading state
  if (isLoading) {
    return <SuggestionsSkeleton />;
  }

  // Error state
  if (error) {
    return <SuggestionsError refetch={refetch} />;
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
              const isPending = isFollowPending(user.userId) || followUserMutatation.isPending;
              return (
                <div key={user.userId} className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
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
                    <Link href={`/profile/${user.userId}`} className="hover:underline">
                      <p className="font-semibold text-sm truncate">
                        {user.userInfo?.firstName} {user.userInfo?.lastName}
                      </p>
                    </Link>
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
