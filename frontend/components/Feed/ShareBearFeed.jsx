import { ShareBearPost } from "./ShareBearPost";
import Link from "next/link";

export function ShareBearFeed({ posts, lastPostRef }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="text-6xl mb-5 animate-bounce-slow select-none">🐾</div>
        <p className="text-xl font-bold mb-1">Your feed is empty</p>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Follow people you know to see their posts, stories, and shares here.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Find people to follow
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div
          key={post.feedKey ?? post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <ShareBearPost post={post} />
        </div>
      ))}
    </div>
  );
}

