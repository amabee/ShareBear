"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  TrendingUp,
  Hash,
  User,
  Play,
  Heart,
  Download,
  Eye,
  Users,
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { searchSuggestions } from "@/data/searchData";

const mockSearchResults = {
  videos: [
    {
      id: "1",
      title: "Amazing sunset timelapse over the mountains",
      creator: "NatureLover",
      thumbnail:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop",
      views: "1.2M",
      duration: "0:45",
    },
    {
      id: "2",
      title: "Street food adventure in Tokyo",
      creator: "FoodieAdventures",
      thumbnail:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&h=80&fit=crop",
      views: "890K",
      duration: "2:15",
    },
    {
      id: "3",
      title: "Modern dance choreography tutorial",
      creator: "DanceStudio",
      thumbnail:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&h=80&fit=crop",
      views: "456K",
      duration: "3:22",
    },
  ],
  images: [
    {
      id: "1",
      title: "Minimalist workspace setup",
      creator: "DesignStudio",
      thumbnail:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=120&h=80&fit=crop",
      likes: "89K",
      downloads: "12K",
    },
    {
      id: "2",
      title: "Abstract geometric art",
      creator: "ArtistCollective",
      thumbnail:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=120&h=80&fit=crop",
      likes: "156K",
      downloads: "45K",
    },
    {
      id: "3",
      title: "Urban architecture photography",
      creator: "CityScapes",
      thumbnail:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=80&fit=crop",
      likes: "203K",
      downloads: "78K",
    },
  ],
};

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchModal({
  isOpen,
  onClose,
  searchValue,
  onSearchChange,
}) {
  const [results, setResults] = useState({
    recent: searchSuggestions.recent,
    trending: searchSuggestions.trending,
    users: searchSuggestions.users,
    videos: mockSearchResults.videos.slice(0, 3),
    images: mockSearchResults.images.slice(0, 3),
  });
  const [isSearching, setIsSearching] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue || "");

  // Debounce the search value with 300ms delay
  const debouncedSearchValue = useDebounce(localSearchValue, 300);

  // Update parent component when debounced value changes
  useEffect(() => {
    onSearchChange(debouncedSearchValue);
  }, [debouncedSearchValue, onSearchChange]);

  // Sync local value with prop changes
  useEffect(() => {
    setLocalSearchValue(searchValue || "");
  }, [searchValue]);

  // Handle search loading state
  useEffect(() => {
    if (debouncedSearchValue && debouncedSearchValue !== searchValue) {
      setIsSearching(true);
    }
  }, [localSearchValue]);

  useEffect(() => {
    if (debouncedSearchValue) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 200); // Shorter delay since we're already debouncing input
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchValue]);

  const handleInputChange = useCallback((value) => {
    setLocalSearchValue(value);
  }, []);

  const handleSuggestionClick = useCallback(
    (term) => {
      setLocalSearchValue(term);
      onSearchChange(term);
    },
    [onSearchChange]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-none h-[95vh] p-0 gap-0 bg-white/95 dark:bg-gray-900/95
          backdrop-blur-xl border-0 shadow-2xl overflow-hidden flex flex-col
          [&>button]:hidden"
      >
        <VisuallyHidden>
          <DialogTitle>Search</DialogTitle>
        </VisuallyHidden>

        {/* Search Header with gradient */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          <div className="relative p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for people, videos, hashtags..."
                className="pl-12 h-14 text-base bg-gray-50/80 dark:bg-gray-800/80 border-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:bg-white dark:focus-visible:bg-gray-800 transition-all duration-200"
                value={localSearchValue}
                onChange={(e) => handleInputChange(e.target.value)}
                autoFocus
              />
              {/* Loading indicator in search bar */}
              {isSearching && localSearchValue && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Results - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isSearching && debouncedSearchValue ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
              </div>
              <p className="text-gray-500 mt-4 text-sm">Searching...</p>
            </div>
          ) : debouncedSearchValue ? (
            <div className="space-y-8">
              {/* Users */}
              {results.users.length > 0 && (
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">People</h3>
                    <Badge variant="secondary" className="text-xs">
                      {results.users.length}
                    </Badge>
                  </div>
                  <div className="grid gap-3">
                    {results.users.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Avatar className="h-12 w-12 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300 transition-all">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {user.name}
                            </span>
                            {user.verified && (
                              <div className="p-0.5 bg-blue-500 rounded-full">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>@{user.username}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{user.followers}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {results.videos.length > 0 && (
                <div className="animate-in slide-in-from-bottom-4 duration-300 delay-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">Videos</h3>
                    <Badge variant="secondary" className="text-xs">
                      {results.videos.length}
                    </Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-1">
                    {results.videos.map((video, index) => (
                      <div
                        key={video.id}
                        className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/10 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play
                              className="h-6 w-6 text-white opacity-80"
                              fill="currentColor"
                            />
                          </div>
                          <Badge className="absolute bottom-1 right-1 text-xs px-1.5 py-0.5 bg-black/80 text-white border-0">
                            {video.duration}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="truncate">{video.creator}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{video.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              {results.images && results.images.length > 0 && (
                <div className="animate-in slide-in-from-bottom-4 duration-300 delay-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">Images</h3>
                    <Badge variant="secondary" className="text-xs">
                      {results.images.length}
                    </Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-1">
                    {results.images.map((image, index) => (
                      <div
                        key={image.id}
                        className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={image.thumbnail}
                            alt={image.title}
                            className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/10 rounded-lg group-hover:bg-black/5 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {image.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="truncate">{image.creator}</span>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{image.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                <span>{image.downloads}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Recent Searches */}
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Recent</h3>
                </div>
                <div className="grid gap-2">
                  {results.recent.map((term, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-left group hover:scale-[1.02]"
                      onClick={() => handleSuggestionClick(term)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Clock className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                        {term}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="animate-in slide-in-from-bottom-4 duration-300 delay-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Trending</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.trending.map((hashtag, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900/20 dark:hover:to-orange-800/20 transition-all duration-200 text-left group hover:scale-[1.02] border border-gray-200/50 dark:border-gray-600/50"
                      onClick={() => handleSuggestionClick(hashtag)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="p-1.5 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
                        <Hash className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                        {hashtag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
