"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversationSidebar } from "./ConversationSidebar";
import { DirectChatArea } from "./DirectChatArea";

export function ChatInterface() {
  const [selectedConversation, setSelectedConversation] =
    useState("alice-johnson");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-full bg-background overflow-hidden pb-16">
      {/* Conversations Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out flex-shrink-0",
          isMobile
            ? showSidebar
              ? "fixed inset-y-0 left-16 w-80 bg-background/95 backdrop-blur-sm border-r border-border/50 shadow-2xl z-40"
              : "w-0 overflow-hidden"
            : "w-80 border-r border-border/50"
        )}
      >
        <ConversationSidebar
          selectedConversation={selectedConversation}
          onConversationSelect={(conversation) => {
            setSelectedConversation(conversation);
            if (isMobile) setShowSidebar(false);
          }}
          isMobile={isMobile}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        {/* Mobile Toggle Button */}
        {isMobile && (
          <div className="h-12 border-b border-border/50 flex items-center px-4 bg-background/80 backdrop-blur-sm flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 hover:bg-muted/50"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}

        <DirectChatArea
          conversationId={selectedConversation}
          showMobileHeader={!isMobile}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}
