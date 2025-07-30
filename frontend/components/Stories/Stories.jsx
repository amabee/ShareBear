"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Plus, Play, Camera, Eye } from "lucide-react";
import { useState } from "react";

export function Stories() {
  const [hoveredStory, setHoveredStory] = useState(null);

  const stories = [];

  const handleStoryClick = (story) => {
    console.log("Opening story:", story.user.username);
  };

  const handleCreateStory = () => {
    console.log("Creating new story");
  };

  return (
    <div className="rounded-2xl p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
          Stories
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          See all
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {/* Create Story Card */}
          <CarouselItem className="pl-4 basis-auto">
            <Card
              className="relative w-32 h-48 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden border-0 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-md"
              onClick={handleCreateStory}
            >
              <CardContent className="p-0 relative h-full w-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="bg-white/20 rounded-full p-3 mb-3 flex items-center justify-center backdrop-blur-sm">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm mb-2">
                    Create Story
                  </span>
                  <div className="flex items-center justify-center bg-white/20 rounded-full p-1 backdrop-blur-sm">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Story Cards */}
          {stories.map((story) => (
            <CarouselItem key={story.id} className="pl-4 basis-auto">
              <Card
                className="relative w-32 h-48 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden border-0 rounded-xl shadow-md"
                onMouseEnter={() => setHoveredStory(story.id)}
                onMouseLeave={() => setHoveredStory(null)}
                onClick={() => handleStoryClick(story)}
              >
                <CardContent className="p-0 h-full w-full rounded-xl overflow-hidden">
                  <img
                    src={story.preview}
                    alt={story.user.username + "'s story preview"}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Story Progress Indicators */}
                  <div className="absolute top-3 left-3 right-3 flex space-x-1 z-20">
                    {Array.from({ length: story.segments || 1 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className={`h-0.5 flex-1 rounded-full ${
                            index < (story.currentSegment || 0)
                              ? "bg-white"
                              : "bg-white/30"
                          }`}
                        />
                      )
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="absolute top-6 left-3 z-20">
                    <div
                      className={`p-0.5 rounded-full ${
                        story.viewed
                          ? "bg-gray-400"
                          : "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400"
                      }`}
                    >
                      <div className="bg-white p-0.5 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={story.user.avatar || "/placeholder.svg"}
                            alt={story.user.username}
                          />
                          <AvatarFallback className="text-xs bg-gray-100">
                            {story.user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>

                  {/* Viewed/Unviewed Eye Indicator */}
                  <div className="absolute top-6 right-3 z-20">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                      <Eye
                        className={`h-3 w-3 ${
                          story.viewed ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* View Count */}
                  {story.views > 0 && (
                    <div className="absolute bottom-12 right-3 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 z-20">
                      <Eye className="h-3 w-3 text-white/80" />
                      <span className="text-xs text-white/80 font-medium">
                        {story.views}
                      </span>
                    </div>
                  )}

                  {/* Username & Timestamp */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6 flex flex-col justify-end z-20">
                    <p className="text-white text-sm font-medium truncate drop-shadow-sm">
                      {story.isOwn ? "Your Story" : story.user.username}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5">
                      {story.timestamp}
                    </p>
                  </div>

                  {/* Play Button Overlay */}
                  {hoveredStory === story.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-200 z-30">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-md transform scale-100 hover:scale-110 transition-transform">
                        <Play className="h-4 w-4 text-gray-900 ml-0.5" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="left-0 bg-white/90
           dark:bg-white/90 
          dark:hover:bg-white
         hover:bg-white shadow-md 
         border border-gray-200
          text-gray-600 
          hover:text-gray-900 backdrop-blur-sm"
        />
        <CarouselNext
          className="right-0 bg-white/90
         dark:bg-white/90 dark:hover:bg-white hover:bg-white shadow-md border
          border-gray-200 text-gray-600 hover:text-gray-900 backdrop-blur-sm"
        />
      </Carousel>
    </div>
  );
}
