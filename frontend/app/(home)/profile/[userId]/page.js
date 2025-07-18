import { HomePageLayout } from "@/components/HomePageLayout";
import { ShareBearProfile } from "@/components/ShareBearProfile";

export default function ProfilePage() {
  return (
    <HomePageLayout>
      <div className="px-4 py-6 mb-5">
        <ShareBearProfile />
      </div>
    </HomePageLayout>
  );
}
