import { HomePageLayout } from "@/components/Reusables/HomePageLayout";
import PostDetailView from "@/components/Posts/PostDetailView";

export default async function PostPage({ params }) {
  const { postId } = await params;

  return (
    <HomePageLayout>
      <PostDetailView postId={postId} />
    </HomePageLayout>
  );
}
