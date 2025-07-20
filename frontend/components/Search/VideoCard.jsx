"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Share, Download, Bookmark } from "lucide-react";

export default function MediaCard({ media, gridSize = "normal" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(media.isLiked || false);
  const [isSaved, setIsSaved] = useState(media.isSaved || false);

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getGridClass = () => {
    switch (gridSize) {
      case "wide":
        return "col-span-2 row-span-1";
      case "tall":
        return "col-span-1 row-span-2";
      case "large":
        return "col-span-2 row-span-2";
      default:
        return "col-span-1 row-span-1";
    }
  };

  const getAspectRatio = () => {
    // Let the grid handle the aspect ratio based on row/col spans
    return "w-full h-full";
  };

  const getImageFit = () => {
    // Adjust object-fit based on the original media dimensions and grid size
    if (!media.dimensions) return "object-cover";

    const { width, height } = media.dimensions;
    const aspectRatio = width / height;

    // For wide content in wide grid, use object-cover
    if (gridSize === "wide" && aspectRatio > 1.5) return "object-cover";

    // For tall content in tall grid, use object-cover
    if (gridSize === "tall" && aspectRatio < 0.8) return "object-cover";

    // For mismatched ratios, use object-cover to fill the space nicely
    return "object-cover";
  };

  return (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 cursor-pointer ${getGridClass()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${getAspectRatio()}`}>
        <img
          src={media.thumbnail || "/placeholder.svg"}
          alt={media.title}
          className={`w-full h-full ${getImageFit()} transition-transform duration-300 group-hover:scale-105`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Media Type Indicator */}
        {media.type === "video" && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Content Overlay - Only show on hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 text-white transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold line-clamp-2 mb-1 ${
                  gridSize === "large" ? "text-base" : "text-sm"
                }`}
              >
                {media.title}
              </h3>
              <div className="flex items-center gap-2">
                <Avatar
                  className={`ring-1 ring-white/20 ${
                    gridSize === "large" ? "h-6 w-6" : "h-5 w-5"
                  }`}
                >
                  <AvatarImage
                    src={media.creator.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-xs">
                    {media.creator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`opacity-90 ${
                    gridSize === "large" ? "text-sm" : "text-xs"
                  }`}
                >
                  {media.creator.name}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 ${
                gridSize === "large" ? "text-sm" : "text-xs"
              }`}
            >
              {media.type === "video" ? (
                <>
                  <span className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {formatViews(media.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {formatViews(media.likes)}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {formatViews(media.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {formatViews(media.downloads || 0)}
                  </span>
                </>
              )}
            </div>

            {media.duration && (
              <Badge
                variant="secondary"
                className="bg-black/50 text-white text-xs px-1.5 py-0.5"
              >
                {media.duration}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons - Top right corner */}
        <div
          className={`absolute top-2 right-2 flex flex-col gap-1.5 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="bg-black/50 backdrop-blur-sm rounded-full p-1.5 hover:bg-black/70 transition-all hover:scale-110"
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                isLiked ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className="bg-black/50 backdrop-blur-sm rounded-full p-1.5 hover:bg-black/70 transition-all hover:scale-110"
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${
                isSaved ? "fill-yellow-500 text-yellow-500" : "text-white"
              }`}
            />
          </button>

          <button className="bg-black/50 backdrop-blur-sm rounded-full p-1.5 hover:bg-black/70 transition-all hover:scale-110">
            <Share className="h-3.5 w-3.5 text-white" />
          </button>
        </div>

        {/* Dimension indicator for debugging - Remove in production */}
        {media.dimensions && (
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {media.dimensions.width}×{media.dimensions.height}
          </div>
        )}

        {/* Category Badge */}
        {media.category && (
          <Badge
            className={`absolute ${media.trending ? "top-8" : "top-2"} left-2 ${
              media.type === "video"
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gradient-to-r from-blue-500 to-cyan-500"
            } text-white border-0 text-xs px-2 py-0.5 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {media.category}
          </Badge>
        )}

        {/* Trending Badge */}
        {media.trending && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs px-2 py-0.5 animate-pulse">
            🔥
          </Badge>
        )}

        {/* Video duration badge */}
        {media.type === "video" && media.duration && !isHovered && (
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5">
            {media.duration}
          </Badge>
        )}
      </div>
    </Card>
  );
}
