"use client";

import { Button } from "@/components/ui/button";
import { Hash, Users, Search, Inbox, HelpCircle } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";


export function ChatArea({
  channelName,
  onToggleUserPanel,
  showMobileHeader = true,
}) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header - Hidden on mobile when mobile header is shown */}
      {showMobileHeader && (
        <div className="h-12 border-b flex items-center justify-between px-4 bg-background/50">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-sm sm:text-base">
              {channelName}
            </span>
            <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {channelName.includes("-")
                ? `Chat with ${channelName.replace("-", " ")}`
                : `Welcome to ${channelName}!`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hidden sm:flex"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hidden sm:flex"
            >
              <Inbox className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hidden sm:flex"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hidden lg:flex"
              onClick={onToggleUserPanel}
            >
              <Users className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList />
        <MessageInput channelName={channelName} />
      </div>
    </div>
  );
}
