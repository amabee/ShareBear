"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserDetail } from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { formatCount } from "@/utils/formatCount";
import ProfileCardSkeleton from "../Skeletons/ProfileCardSkeleton";

export default function ProfileCard() {
  const { data: session, status } = useSession();
  const {
    data: response,
    isLoading,
    error,
  } = useUserDetail(session?.user?.username);

  if (isLoading || status === "loading") {
    return <ProfileCardSkeleton />;
  }
  if (error || !response?.user) {
    return <ProfileCardSkeleton />;
  }

  const user = response.user;

  return (
    <Card
      className="w-full max-w-sm mx-auto overflow-hidden 
    rounded-2xl bg-white border-none shadow-lg shadow-primary/15 dark:bg-[#1E1E2F] text-gray-900 dark:text-white p-0"
    >
      {/* Cover Photo */}
      <div className="relative w-full h-36">
        <img
          src={
            `${
              process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL
            }/profileimgs/${user.userInfo.coverPhotoUrl.split("/").pop()}` ||
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop&crop=top"
          }
          alt="Cover photo"
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="relative pt-0 px-6 pb-6">
        {/* Avatar */}
        <div className="absolute left-1/2 -top-18 transform -translate-x-1/2">
          <Avatar className="h-22 w-22 shadow-md">
            <AvatarImage
              className="object-cover"
              src={
                `${
                  process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL
                }/profileimgs/${user.userInfo.profilePictureUrl
                  .split("/")
                  .pop()}` || "/placeholder.svg"
              }
              alt="Profile picture"
            />
            <AvatarFallback className="text-lg font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {user.userInfo.firstName?.[0]}
              {user.userInfo.lastName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-[#1E1E2F] rounded-full"></div>
        </div>

        {/* Button */}
        <div className="mt-12 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-gray-300 dark:border-gray-500/50 text-sm text-gray-900
             dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
          >
            View Profile
          </Button>
        </div>

        {/* User Info */}
        <div className="text-center mt-4 space-y-1">
          <h2 className="font-semibold text-lg">
            {" "}
            {user.userInfo.displayName ||
              `${user.userInfo.firstName} ${user.userInfo.lastName}`}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm mt-6 px-2">
          <div className="text-center">
            <div className="font-bold text-base">
              {formatCount(user.stats.followersCount)}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              Followers
            </div>
          </div>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="font-bold text-base">
              {formatCount(user.stats.followingCount)}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              Following
            </div>
          </div>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="font-bold text-base">
              {" "}
              {formatCount(user.stats.likeCount)}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              Likes
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
