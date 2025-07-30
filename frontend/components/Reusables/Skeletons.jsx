export const StoriesSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 bg-gray-100 animate-pulse rounded w-24" />
    <div className="flex space-x-4 overflow-x-auto">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-16 h-16 bg-gray-100 animate-pulse rounded-full"
        />
      ))}
    </div>
  </div>
);

export const FeedSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
            <div className="h-3 bg-gray-100 animate-pulse rounded w-16 mt-1" />
          </div>
        </div>
        <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
        <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
      </div>
    ))}
  </div>
);
