"use client";

import { HomePageLayout } from "@/components/Reusables/HomePageLayout";
import {
  FeedSkeleton,
  StoriesSkeleton,
} from "@/components/Reusables/Skeletons";
import ProfileCardSkeleton from "@/components/Skeletons/ProfileCardSkeleton";
import { SidebarNav } from "@/components/Reusables/SidebarNav";
import { Search, Camera } from "lucide-react";
import Link from "next/link";
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
      <div className="h-64 bg-muted animate-pulse rounded-2xl" />
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
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4">
        <div className="flex gap-6">

          {/* ── Left Sidebar ─────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col w-[220px] xl:w-[240px] shrink-0">
            <div className="sticky top-6 space-y-4 overflow-y-auto max-h-[calc(100vh-3rem)] pb-8">
              <ProfileCard />
              <SidebarNav />
            </div>
          </aside>

          {/* ── Center Feed ──────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            <div className="max-w-[470px] mx-auto space-y-3">
            {/* Search bar — links to /search */}
            <Link href="/search" className="block">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted/60 border border-border/40 hover:border-border hover:bg-muted/80 transition-all cursor-pointer">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground flex-1 select-none">
                  Search ShareBear…
                </span>
                <Camera className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </Link>

            <Stories />
            <ShareBearInfiniteFeedClient />
            </div>
          </main>

          {/* ── Right Sidebar ────────────────────────────────── */}
          <aside className="hidden xl:flex flex-col w-[260px] shrink-0">
            <div className="sticky top-6 space-y-4 overflow-y-auto max-h-[calc(100vh-3rem)] pb-8">
              <Suggestions />
            </div>
          </aside>

        </div>
      </div>
    </HomePageLayout>
  );
};

export default HomePage;
