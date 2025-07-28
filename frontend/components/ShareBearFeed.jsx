import { ShareBearPost } from "./ShareBearPost";

export function ShareBearFeed({ posts }) {
  if (!posts || posts.length === 0) {
    return null; 
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <ShareBearPost key={post.id} post={post} />
      ))}
    </div>
  );
}
