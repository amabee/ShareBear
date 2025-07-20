"use client";

import { Button } from "@/components/ui/button";
import { Hash, Users, Search, Inbox, HelpCircle } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { conversationData } from "@/data/message";

export function DirectChatArea({ conversationId, showMobileHeader = true }) {
  const conversation = conversationData[conversationId] || {
    name: "Unknown",
    type: "dm",
    description: "Chat",
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Header - Hidden on mobile when mobile header is shown */}
      {showMobileHeader && (
        <div className="h-12 border-b border-border/50 flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground">
              <Hash className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{conversation.name}</span>
              <span className="text-xs text-muted-foreground">
                {conversation.description}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-muted/50 rounded-lg transition-all duration-200"
            >
              <Search className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-muted/50 rounded-lg transition-all duration-200"
            >
              <Inbox className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-muted/50 rounded-lg transition-all duration-200"
            >
              <HelpCircle className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-muted/50 rounded-lg transition-all duration-200"
            >
              <Users className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <MessageList />
        <MessageInput channelName={conversation.name} />
      </div>
    </div>
  );
}
