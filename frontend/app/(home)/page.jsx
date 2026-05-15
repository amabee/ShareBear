"use client";

import { HomePageLayout } from "@/components/Reusables/HomePageLayout";
import {
  FeedSkeleton,
  StoriesSkeleton,
} from "@/components/Reusables/Skeletons";
import ProfileCardSkeleton from "@/components/Skeletons/ProfileCardSkeleton";
import dynamic from "next/dynamic";

const ProfileCard = dynamic(() => import("@/components/Profile/ProfileCard"), {
  ssr: false,
  loading: () => <ProfileCardSkeleton />,
});

const Suggestions = dynamic(
  () => import("@/components/Suggestions/Suggestions"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
    ),
  }
);

const Stories = dynamic(
  () => import("@/components/Stories/Stories").then((m) => m.Stories),
  {
    ssr: false,
    loading: () => <StoriesSkeleton />,
  }
);

const ShareBearInfiniteFeedClient = dynamic(
  () =>
    import("@/components/Clients/ShareBearFeedClient").then(
      (m) => m.ShareBearInfiniteFeedClient
    ),
  {
    ssr: false,
    loading: () => <FeedSkeleton />,
  }
);

const HomePage = () => {
  return (
    <HomePageLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ProfileCard />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Stories />
            <ShareBearInfiniteFeedClient />
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <Suggestions />
            </div>
          </div>
        </div>
      </div>
    </HomePageLayout>
  );
};

export default HomePage;
