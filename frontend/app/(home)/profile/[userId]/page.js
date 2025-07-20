import { HomePageLayout } from "@/components/HomePageLayout";
import { ShareBearProfile } from "@/components/ShareBearProfile";

export default async function ProfilePage({ params, searchParams }) {
  const { userId } = params;
  const page = (await searchParams)?.page || "posts";

  return (
    <HomePageLayout>
      <div className="px-4 py-0 mb-5">
        <ShareBearProfile userId={userId} activePage={page} />
      </div>
    </HomePageLayout>
  );
}
