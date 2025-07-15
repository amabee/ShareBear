"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { stories } from "@/data/stories";
import { Plus } from "lucide-react";



export function Stories() {
  return (
    <div className="bg-background border rounded-lg p-3">
      <ScrollArea className="w-full">
        <div className="flex space-x-3 pb-2">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center space-y-1 min-w-0"
            >
              <div className="relative">
                <div
                  className={`p-0.5 rounded-full ${
                    story.hasNewStory
                      ? "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                      : story.isOwn
                      ? "bg-muted"
                      : "bg-muted"
                  }`}
                >
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarImage
                      src={story.user.avatar || "/placeholder.svg"}
                      alt={story.user.username}
                    />
                    <AvatarFallback>
                      {story.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {story.isOwn && (
                  <Button
                    size="icon"
                    className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <span className="text-xs text-center max-w-[60px] truncate">
                {story.isOwn ? "Your Story" : story.user.username}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
