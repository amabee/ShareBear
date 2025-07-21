import { useState, useRef, useEffect } from "react";

// Sample Lucide React icons as SVG components
const Play = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const Volume2 = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const VolumeX = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const Heart = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const MessageCircle = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
);

const Share = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const Bookmark = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const Music = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export default function ReelCard({ reel, isActive, onLike, onSave, onFollow }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString();
  };

  // Double tap to like
  const handleDoubleClick = () => {
    if (!reel.isLiked && onLike) {
      onLike(reel.id);
    }
  };

  return (
    <div className="flex h-screen w-full bg-black">
      {/* Video Section - Takes most of the width */}
      <div className="flex-1 relative">
        <div className="relative w-full h-full overflow-hidden border-0 bg-black rounded-none">
          {/* Video */}
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={handlePlayPause}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              poster={reel.thumbnail}
            >
              <source src={reel.videoUrl} type="video/mp4" />
            </video>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 hover:bg-white/20 transition-colors">
                  <Play className="h-16 w-16 text-white fill-white" />
                </div>
              </div>
            )}

            {/* Volume Control - Moved to top left */}
            <div
              className={`absolute top-4 left-4 transition-opacity duration-200 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                className="bg-black/40 hover:bg-black/60 text-white rounded-full h-10 w-10 backdrop-blur-md flex items-center justify-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMuteToggle();
                }}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Content Overlay - Only at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              {/* Creator Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center ring-2 ring-white/20 overflow-hidden">
                  <img
                    src={reel.creator?.avatar}
                    alt={reel.creator?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <span className="text-white text-sm font-medium hidden">
                    {reel.creator?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white text-sm">
                      {reel.creator?.username}
                    </span>
                    {reel.creator?.verified && (
                      <span className="text-blue-400 text-sm">✓</span>
                    )}
                    {!reel.isFollowing && (
                      <button
                        className="h-6 px-2 text-xs bg-transparent border border-white/50 text-white hover:bg-white hover:text-black transition-all rounded"
                        onClick={() => onFollow && onFollow(reel.id)}
                      >
                        Follow
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <p className="text-white text-sm leading-relaxed">
                  {reel.description}
                </p>
              </div>

              {/* Music Info */}
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Music className="h-3 w-3" />
                <span className="truncate font-medium">
                  {reel.music?.title} • {reel.music?.artist}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Panel - Fixed width on the right */}
      <div className="w-20 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-center gap-6 py-8">
        {/* Like */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="bg-white/10 hover:bg-white/20 rounded-full h-12 w-12 hover:scale-110 transition-all backdrop-blur-md border border-white/20 flex items-center justify-center"
            onClick={() => onLike && onLike(reel.id)}
          >
            <Heart
              className={`h-6 w-6 ${
                reel.isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-white fill-transparent"
              }`}
            />
          </button>
          <span className="text-white text-xs font-medium">
            {formatNumber(reel.stats?.likes)}
          </span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center gap-1">
          <button className="bg-white/10 hover:bg-white/20 rounded-full h-12 w-12 hover:scale-110 transition-all backdrop-blur-md border border-white/20 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </button>
          <span className="text-white text-xs font-medium">
            {formatNumber(reel.stats?.comments)}
          </span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-1">
          <button className="bg-white/10 hover:bg-white/20 rounded-full h-12 w-12 hover:scale-110 transition-all backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Share className="h-6 w-6 text-white" />
          </button>
          <span className="text-white text-xs font-medium">
            {formatNumber(reel.stats?.shares)}
          </span>
        </div>

        {/* Save */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="bg-white/10 hover:bg-white/20 rounded-full h-12 w-12 hover:scale-110 transition-all backdrop-blur-md border border-white/20 flex items-center justify-center"
            onClick={() => onSave && onSave(reel.id)}
          >
            <Bookmark
              className={`h-6 w-6 ${
                reel.isSaved
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white fill-transparent"
              }`}
            />
          </button>
        </div>

        {/* Music Cover - Positioned at bottom */}
        <div className="mt-6">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 animate-spin">
            <img
              src={reel.music?.cover || "/default-cover.png"}
              alt={reel.music?.title || "Music cover"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
