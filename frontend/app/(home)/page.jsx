import ShareBearFeedClient from "@/components/Clients/ShareBearFeedClient";
import { ShareBearFeed } from "@/components/Feed/ShareBearFeed";
import { HomePageLayout } from "@/components/Reusables/HomePageLayout";
import {
  FeedSkeleton,
  StoriesSkeleton,
} from "@/components/Reusables/Skeletons";
import TopNavBar from "@/components/Reusables/TopNavBar";
import { Stories } from "@/components/Stories/Stories";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const ProfileCard = dynamic(() => import("@/components/Profile/ProfileCard"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
});

const Suggestions = dynamic(
  () => import("@/components/Suggestions/Suggestions"),
  {
    loading: () => (
      <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
    ),
  }
);

const HomePage = () => {
  return (
    <HomePageLayout>
      <TopNavBar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Suspense
                fallback={
                  <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
                }
              >
                <ProfileCard />
              </Suspense>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<StoriesSkeleton />}>
              <Stories />
            </Suspense>
            <Suspense fallback={<FeedSkeleton />}>
              <ShareBearFeedClient />
            </Suspense>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <Suspense
                fallback={
                  <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
                }
              >
                <Suggestions />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </HomePageLayout>
  );
};

export default HomePage;
