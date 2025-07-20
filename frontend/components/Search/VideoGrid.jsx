"use client";

import { useState, useEffect } from "react";
import { sampleImages, sampleVideos } from "@/data/search";
import MediaCard from "./VideoCard";

export default function MediaGrid() {
  const [mockMedia, setMockMedia] = useState([]);

  useEffect(() => {
    // Shuffle the media array on the client side only
    const shuffledMedia = [...sampleImages, ...sampleVideos].sort(
      () => Math.random() - 0.5
    );
    setMockMedia(shuffledMedia);
  }, []);

  // Function to determine grid size based on media dimensions
  const getGridSizeFromDimensions = (media) => {
    if (!media.dimensions) return "normal";

    const { width, height } = media.dimensions;
    const aspectRatio = width / height;

    // Define aspect ratio thresholds
    if (aspectRatio >= 1.8) {
      // Very wide (landscape) - 16:9, 2:1, etc.
      return "wide";
    } else if (aspectRatio <= 0.7) {
      // Very tall (portrait) - 9:16, 2:3, etc.
      return "tall";
    } else if (aspectRatio >= 1.3) {
      // Moderately wide - 4:3, 3:2, etc.
      return "wide";
    } else if (aspectRatio <= 0.8) {
      // Moderately tall - 3:4, 4:5, etc.
      return "tall";
    } else {
      // Square or close to square - 1:1, etc.
      return "normal";
    }
  };

  // Create a balanced layout by mixing different sizes
  const createBalancedLayout = (mediaArray) => {
    const layoutItems = [];
    let consecutiveTallCount = 0;
    let consecutiveWideCount = 0;

    mediaArray.forEach((media, index) => {
      let suggestedSize = getGridSizeFromDimensions(media);

      // Prevent too many consecutive tall or wide items
      if (suggestedSize === "tall") {
        if (consecutiveTallCount >= 2) {
          suggestedSize = "normal";
          consecutiveTallCount = 0;
        } else {
          consecutiveTallCount++;
        }
        consecutiveWideCount = 0;
      } else if (suggestedSize === "wide") {
        if (consecutiveWideCount >= 1) {
          suggestedSize = "normal";
          consecutiveWideCount = 0;
        } else {
          consecutiveWideCount++;
        }
        consecutiveTallCount = 0;
      } else {
        consecutiveTallCount = 0;
        consecutiveWideCount = 0;
      }

      // Ensure we don't have too many large items in a row
      if (index > 0 && index % 6 === 0) {
        suggestedSize = "normal";
      }

      layoutItems.push({
        ...media,
        gridSize: suggestedSize,
      });
    });

    return layoutItems;
  };

  const balancedMedia =
    mockMedia.length > 0 ? createBalancedLayout(mockMedia) : [];

  return (
    <div className="px-3 sm:px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Explore</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Discover trending videos, images, and creators
          </p>
        </div>

        {/* Intelligent Bento Grid Layout */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-2 auto-rows-[150px] sm:auto-rows-[200px] lg:auto-rows-[220px]">
          {balancedMedia.length > 0
            ? balancedMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  gridSize={media.gridSize}
                />
              ))
            : // Show loading skeleton while data is being prepared
              Array.from({ length: 18 }).map((_, index) => {
                const skeletonSizes = [
                  "normal",
                  "normal",
                  "wide",
                  "normal",
                  "tall",
                  "normal",
                ];
                const size = skeletonSizes[index % skeletonSizes.length];
                return (
                  <div
                    key={index}
                    className={`bg-muted animate-pulse rounded-lg ${
                      size === "wide"
                        ? "col-span-2 row-span-1"
                        : size === "tall"
                        ? "col-span-1 row-span-2"
                        : "col-span-1 row-span-1"
                    }`}
                  />
                );
              })}
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {[
            "All",
            "Nature",
            "Design",
            "Food",
            "Art",
            "Photography",
            "Travel",
            "Music",
          ].map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors hover:scale-105 transform duration-200"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Debug Info - Remove in production */}
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>Grid intelligently adapts to content dimensions</p>
        </div>
      </div>
    </div>
  );
}
