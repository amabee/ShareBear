import ShareBearFeedClient from "@/components/Clients/ShareBearFeedClient";
import { Stories } from "@/components/Stories";
import { HomePageLayout } from "@/components/HomePageLayout";
import TopNavBar from "@/components/TopNavBar";
import { StoriesSkeleton, FeedSkeleton } from "@/components/Skeletons";
import { Suspense } from "react";
import ProfileCard from "@/components/dynamicComponents/ProfileCard";
import Suggestions from "@/components/dynamicComponents/Suggestion";

export default function HomePage() {
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
}
