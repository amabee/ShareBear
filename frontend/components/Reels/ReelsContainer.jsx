"use client";

import { useState, useEffect, useRef } from "react";
import { reelsData } from "@/data/reels";
import ReelCard from "./ReelCard";

export default function ReelsContainer() {
  const [reels, setReels] = useState(reelsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set timeout to detect scroll end
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        snapToNearestReel();
      }, 150);
      
      const scrollTop = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      const newIndex = Math.round(scrollTop / containerHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  // Snap to nearest reel when scrolling stops
  const snapToNearestReel = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      const targetIndex = Math.round(scrollTop / containerHeight);
      
      containerRef.current.scrollTo({
        top: targetIndex * containerHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToReel = (index) => {
    if (containerRef.current && index >= 0 && index < reels.length) {
      containerRef.current.scrollTo({
        top: index * containerRef.current.clientHeight,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handleLike = (reelId) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              stats: {
                ...reel.stats,
                likes: reel.isLiked
                  ? reel.stats.likes - 1
                  : reel.stats.likes + 1,
              },
            }
          : reel
      )
    );
  };

  const handleSave = (reelId) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel
      )
    );
  };

  const handleFollow = (reelId) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, isFollowing: !reel.isFollowing } : reel
      )
    );
  };

  const handleShare = (reelId) => {
    // Add share functionality
    const reel = reels.find(r => r.id === reelId);
    if (reel && navigator.share) {
      navigator.share({
        title: `Check out this reel by ${reel.user.username}`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, []);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling behavior
      if (["ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === "Space") {
        // Handle play/pause for current video
        const currentReel = document.querySelector(`[data-reel-index="${currentIndex}"] video`);
        if (currentReel) {
          if (currentReel.paused) {
            currentReel.play();
          } else {
            currentReel.pause();
          }
        }
      } else if (e.code === "ArrowUp") {
        scrollToReel(currentIndex - 1);
      } else if (e.code === "ArrowDown") {
        scrollToReel(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, reels.length]);

  // Touch gestures for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchDuration = Date.now() - touchStartTime;
      const deltaY = touchStartY - touchEndY;
      const minSwipeDistance = 50;
      const maxSwipeTime = 300;

      if (Math.abs(deltaY) > minSwipeDistance && touchDuration < maxSwipeTime) {
        if (deltaY > 0) {
          // Swipe up - next reel
          scrollToReel(currentIndex + 1);
        } else {
          // Swipe down - previous reel
          scrollToReel(currentIndex - 1);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
      
      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [currentIndex]);

  return (
    <div className="relative h-screen w-full bg-black flex justify-center">
      <div className="relative w-full max-w-md h-screen bg-black">
        <div
          ref={containerRef}
          className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide overscroll-none"
          style={{ 
            scrollBehavior: isScrolling ? "auto" : "smooth",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {reels.map((reel, index) => (
            <div 
              key={reel.id} 
              className="h-screen w-full snap-start snap-always relative"
              data-reel-index={index}
            >
              <ReelCard
                reel={reel}
                isActive={index === currentIndex}
                onLike={handleLike}
                onSave={handleSave}
                onFollow={handleFollow}
                onShare={handleShare}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Swipe indicator */}
      {isScrolling && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="bg-black bg-opacity-50 rounded-full p-3">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
