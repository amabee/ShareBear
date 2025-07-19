"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Hash,
  Volume2,
  Settings,
  ChevronDown,
  Plus,
  Lock,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const textChannels = [
  { id: "general", name: "general", locked: false },
  { id: "random", name: "random", locked: false },
  { id: "announcements", name: "announcements", locked: true },
  { id: "help", name: "help", locked: false },
];

const voiceChannels = [
  { id: "general-voice", name: "General", users: 3 },
  { id: "gaming", name: "Gaming", users: 0 },
  { id: "music", name: "Music", users: 1 },
];

const conversations = [
  {
    id: "alice-johnson",
    name: "Alice Johnson",
    avatar: "A",
    color: "bg-blue-500",
    lastMessage: "Hey! How's the project going?",
    timestamp: "2:30 PM",
    unread: 2,
    isOnline: true,
    isTyping: false,
  },
  {
    id: "bob-smith",
    name: "Bob Smith",
    avatar: "B",
    color: "bg-green-500",
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
    color: "bg-purple-500",
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
    color: "bg-orange-500",
    lastMessage: "Here's the latest mockup",
    timestamp: "Yesterday",
    unread: 1,
    isOnline: true,
    isTyping: false,
  },
];

export function ChannelSidebar({
  selectedChannel,
  onChannelSelect,
  serverName,
  serverType,
  isMobile = false,
}) {
  if (serverType === "dm") {
    // Direct Messages View
    return (
      <div className="w-80 bg-muted/30 flex flex-col">
        {/* Header */}
        <div className={cn("p-4 border-b", isMobile && "pt-6")}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Messages</h2>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 h-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onChannelSelect(conversation.id)}
                className={cn(
                  "p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
                  selectedChannel === conversation.id
                    ? "bg-primary/10 border-primary/20 shadow-sm"
                    : "bg-card border-border hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold",
                        conversation.color
                      )}
                    >
                      {conversation.avatar}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
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
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">
                              {conversation.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.isTyping ? (
                          <span className="text-primary font-medium">
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

        {/* User Info - Updated Design */}
        <div className="p-3 border-t bg-muted/40">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/60 hover:bg-muted/80 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                U
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-medium">Username</div>
                <div className="text-xs text-green-600 font-medium">Online</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 hover:bg-muted"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Server Channels View
  return (
    <div className="w-80 bg-muted/30 flex flex-col">
      {/* Server Header */}
      <div className={cn("p-4 border-b", isMobile && "pt-6")}>
        <Button variant="ghost" className="w-full justify-between h-auto p-2">
          <span className="font-semibold capitalize text-sm sm:text-base">
            {serverName}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Text Channels */}
          <div>
            <div className="px-3 py-2 mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Channels
              </span>
            </div>

            <div className="space-y-2">
              {textChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                  className={cn(
                    "p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
                    selectedChannel === channel.id
                      ? "bg-primary/10 border-primary/20 shadow-sm"
                      : "bg-card border-border hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedChannel === channel.id
                          ? "bg-primary/20"
                          : "bg-muted"
                      )}
                    >
                      {channel.locked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Hash className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{channel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {channel.locked ? "Private channel" : "Public channel"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Channels */}
          <div>
            <div className="px-3 py-2 mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Voice Rooms
              </span>
            </div>

            <div className="space-y-2">
              {voiceChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="p-3 rounded-xl border bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{channel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {channel.users > 0
                          ? `${channel.users} users connected`
                          : "No one here"}
                      </div>
                    </div>
                    {channel.users > 0 && (
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-green-600">
                          {channel.users}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* User Info - Updated Design */}
      <div className="p-3 border-t bg-muted/40">
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/60 hover:bg-muted/80 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
              U
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium">Username</div>
              <div className="text-xs text-green-600 font-medium">Online</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 hover:bg-muted"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
