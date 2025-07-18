import { HomePageLayout } from "@/components/HomePageLayout";
import { ShareBearProfile } from "@/components/ShareBearProfile";

export default function ProfilePage({ params, searchParams }) {
  const { userId } = params;
  const page = searchParams?.page || "posts";

  return (
    <HomePageLayout>
      <div className="px-4 py-6 mb-5">
        <ShareBearProfile userId={userId} activePage={page} />
      </div>
    </HomePageLayout>
  );
}
