import { ShareBearPost } from "./ShareBearPost";

export function ShareBearFeed({ posts, lastPostRef }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">🐾</span>
        <p className="text-lg font-semibold">Nothing here yet</p>
        <p className="text-sm text-muted-foreground mt-1">Follow people to see their posts</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

