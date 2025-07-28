import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Stories } from "@/components/Stories";
import { HomePageLayout } from "@/components/HomePageLayout";
import { ShareBearFeed } from "@/components/ShareBearFeed";
import TopNavBar from "@/components/TopNavBar";

// Lazy load non-critical components
const ProfileCard = dynamic(() => import("@/components/ProfileCard").then(mod => ({ default: mod.ProfileCard })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
});

const Suggestions = dynamic(() => import("@/components/Suggestions").then(mod => ({ default: mod.Suggestions })), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
});

// Loading components
const StoriesSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 bg-gray-100 animate-pulse rounded w-24" />
    <div className="flex space-x-4 overflow-x-auto">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-16 h-16 bg-gray-100 animate-pulse rounded-full" />
      ))}
    </div>
  </div>
);

const FeedSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
            <div className="h-3 bg-gray-100 animate-pulse rounded w-16 mt-1" />
          </div>
        </div>
        <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
        <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
      </div>
    ))}
  </div>
);

export default function HomePage() {
  return (
    <HomePageLayout>
      <TopNavBar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
                <ProfileCard />
              </Suspense>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<StoriesSkeleton />}>
              <Stories />
            </Suspense>
            <Suspense fallback={<FeedSkeleton />}>
              <ShareBearFeed />
            </Suspense>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
                <Suggestions />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </HomePageLayout>
  );
}
