"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileCardSkeleton() {
  return (
    <Card
      className="w-full max-w-sm mx-auto overflow-hidden 
      rounded-2xl bg-white border-none shadow-lg shadow-primary/15 dark:bg-[#1E1E2F] text-gray-900 dark:text-white p-0"
    >
      {/* Skeleton Cover Photo */}
      <div className="relative w-full h-36 bg-gray-200 dark:bg-gray-700 animate-pulse" />

      <CardContent className="relative pt-0 px-6 pb-6">
        {/* Skeleton Avatar */}
        <div className="absolute left-1/2 -top-16 transform -translate-x-1/2">
          <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shadow-md" />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-[#1E1E2F] rounded-full"></div>
        </div>

        {/* Skeleton Button */}
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        {/* Skeleton User Info */}
        <div className="text-center mt-4 space-y-2">
          <div className="h-4 w-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Skeleton Stats */}
        <div className="flex items-center justify-between text-sm mt-6 px-2">
          {[1, 2, 3].map((_, idx) => (
            <div className="flex flex-col items-center space-y-1" key={idx}>
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
