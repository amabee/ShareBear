"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Mic, Camera } from "lucide-react";

export default function SearchHeader({
  onSearchFocus,
  onSearchChange,
  searchValue,
  isSearching,
}) {
  return (
    <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for people, videos, hashtags..."
              className="pl-10 pr-12 h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
              onFocus={onSearchFocus}
              onChange={(e) => onSearchChange(e.target.value)}
              value={searchValue}
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                onClick={() => onSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-11 w-11">
              <Mic className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-11 w-11">
              <Camera className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
