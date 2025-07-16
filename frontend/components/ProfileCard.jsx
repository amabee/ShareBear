"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProfileCard() {
  return (
    <Card
      className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-white dark:bg-[#1E1E2F] text-gray-900 dark:text-white p-0"
    >
      {/* Cover Photo */}
      <div className="relative w-full h-36">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop&crop=top"
          alt="Cover photo"
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="relative pt-0 px-6 pb-6">
        {/* Avatar */}
        <div className="absolute left-1/2 -top-10 transform -translate-x-1/2">
          <Avatar className="h-20 w-20 border-4 border-white dark:border-[#1E1E2F] shadow-md">
            <AvatarImage src="/placeholder.svg" alt="Profile picture" />
            <AvatarFallback className="text-lg bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-[#1E1E2F] rounded-full"></div>
        </div>

        {/* Button */}
        <div className="mt-12 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-gray-300 dark:border-gray-500/50 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
          >
            View Profile
          </Button>
        </div>

        {/* User Info */}
        <div className="text-center mt-4 space-y-1">
          <h2 className="font-semibold text-lg">John Doe</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">@johndoe</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm mt-6 px-2">
          <div className="text-center">
            <div className="font-bold text-base">15.6K</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Followers</div>
          </div>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="font-bold text-base">892</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Following</div>
          </div>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="font-bold text-base">24.1K</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Likes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
