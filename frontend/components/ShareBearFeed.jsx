import { ShareBearPost } from "./ShareBearPost";

export function ShareBearFeed({ posts }) {
  console.log("POSTS: ", posts);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center font-bold capitalize text-2xl">No posts</div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <ShareBearPost key={post.id} post={post} />
      ))}
    </div>
  );
}
