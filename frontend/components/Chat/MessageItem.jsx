"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Reply, Smile } from "lucide-react";
import { useState } from "react";

export function MessageItem({ message }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="group flex gap-3 px-3 py-2 hover:bg-muted/30 rounded-xl transition-all duration-200 relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg",
            message.user.color
          )}
        >
          {message.user.avatar}
        </div>
        {message.user.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-lg" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-sm">{message.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
        </div>

        <div className="text-sm leading-relaxed break-words text-foreground/90">
          {message.content}
        </div>

        {message.hasAttachment && (
          <div className="mt-3 p-3 bg-muted/30 rounded-xl border-l-4 border-primary/50">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center border border-border/50">
                <span className="text-xs font-mono text-muted-foreground">IMG</span>
              </div>
              <div>
                <div className="text-xs font-semibold">design-mockup.png</div>
                <div className="text-xs text-muted-foreground">1.2 MB</div>
              </div>
            </div>
          </div>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 text-xs rounded-full border transition-all duration-200 hover:scale-105",
                  reaction.reacted
                    ? "bg-primary/10 border-primary/30 text-primary shadow-md"
                    : "bg-muted/50 border-border/50 hover:bg-muted hover:border-border"
                )}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Message Actions */}
      {showActions && (
        <div className="absolute -top-1 right-3 bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl flex p-1">
          <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-muted/50 rounded-lg">
            <Smile className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-muted/50 rounded-lg">
            <Reply className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-muted/50 rounded-lg">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
