import { ShareBearPost } from "./ShareBearPost";

export function ShareBearFeed({ posts, lastPostRef }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center font-bold capitalize text-2xl">No posts</div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <ShareBearPost post={post} />
        </div>
      ))}
    </div>
  );
}
