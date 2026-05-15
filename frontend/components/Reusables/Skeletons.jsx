const SkeletonBlock = ({ className }) => (
  <div className={`skeleton-shimmer rounded-xl ${className ?? ""}`} />
);

export const StoriesSkeleton = () => (
  <div className="flex space-x-3 overflow-x-auto pb-1">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5">
        <SkeletonBlock className="h-14 w-14 rounded-full" />
        <SkeletonBlock className="h-2.5 w-10 rounded-full" />
      </div>
    ))}
  </div>
);

export const FeedSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-card dark:bg-[#141420] rounded-2xl overflow-hidden animate-fade-in-up"
        style={{ animationDelay: `${i * 0.08}s` }}
      >
        <div className="p-4 flex items-center gap-3">
          <SkeletonBlock className="h-11 w-11 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3.5 w-32" />
            <SkeletonBlock className="h-2.5 w-20" />
          </div>
        </div>
        <SkeletonBlock className="h-64 w-full rounded-none" />
        <div className="p-4 space-y-3">
          <SkeletonBlock className="h-3.5 w-full" />
          <SkeletonBlock className="h-3.5 w-3/4" />
          <div className="flex gap-3 pt-2">
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-8 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

