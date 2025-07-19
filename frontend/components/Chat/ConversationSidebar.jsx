"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const conversations = [
  {
    id: "alice-johnson",
    name: "Alice Johnson",
    avatar: "A",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    lastMessage:
      "Hey! How's the project going?, Hey! How's the project going?,",
    timestamp: "2:30 PM",
    unread: 2,
    isOnline: true,
    isTyping: false,
  },
  {
    id: "bob-smith",
    name: "Bob Smith",
    avatar: "B",
    color: "bg-gradient-to-br from-green-500 to-green-600",
    lastMessage: "Just finished the authentication system 🚀",
    timestamp: "1:45 PM",
    unread: 0,
    isOnline: true,
    isTyping: true,
  },
  {
    id: "carol-davis",
    name: "Carol Davis",
    avatar: "C",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    lastMessage: "I'll review the PR later today",
    timestamp: "Yesterday",
    unread: 0,
    isOnline: false,
    isTyping: false,
  },
  {
    id: "david-wilson",
    name: "David Wilson",
    avatar: "D",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    lastMessage: "Here's the latest mockup",
    timestamp: "Yesterday",
    unread: 1,
    isOnline: true,
    isTyping: false,
  },
];

export function ConversationSidebar({
  selectedConversation,
  onConversationSelect,
  isMobile = false,
}) {
  return (
    <div className="w-80 bg-background/95 backdrop-blur-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          "p-4 border-b border-border/50 flex-shrink-0",
          isMobile && "pt-6"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Messages
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:bg-muted/50 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 h-9 rounded-lg border-border/50 bg-muted/30 focus:bg-background transition-all duration-200 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={cn(
                  "p-3 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group",
                  selectedConversation === conversation.id
                    ? "bg-primary/10 border-primary/30 shadow-lg scale-[1.02]"
                    : "bg-card/50 border-border/50 hover:bg-muted/30 hover:border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg",
                        conversation.color
                      )}
                    >
                      {conversation.avatar}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-lg" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm truncate">
                        {conversation.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                        {conversation.unread > 0 && (
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-md">
                            <span className="text-xs text-primary-foreground font-bold">
                              {conversation.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {conversation.isTyping ? (
                          <span className="text-primary font-medium animate-pulse">
                            typing...
                          </span>
                        ) : (
                          conversation.lastMessage
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Info */}
      <div className="p-3 border-t border-border/50 bg-muted/20 flex-shrink-0">
        <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 hover:bg-muted/60 cursor-pointer transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xs shadow-md">
              JD
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-semibold">John Doe</div>
              <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Online
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 hover:bg-muted/60 rounded-md transition-all duration-200"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
