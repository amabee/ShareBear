import { Stories } from "@/components/Stories";
import { HomePageLayout } from "@/components/HomePageLayout";
import { ShareBearFeed } from "@/components/ShareBearFeed";
import { ProfileCard } from "@/components/ProfileCard";
import { Suggestions } from "@/components/Suggestions";

export default function HomePage() {
  return (
    <HomePageLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <ProfileCard />
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Stories />
            <ShareBearFeed />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Suggestions />
            </div>
          </div>
        </div>
      </div>
    </HomePageLayout>
  );
}
