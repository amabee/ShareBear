"use client";

import { useState, useEffect } from "react";
import { ConversationSidebar } from "./conversation-sidebar";
import { DirectChatArea } from "./direct-chat-area";
import { ContactPanel } from "./contact-panel";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function DirectChatInterface() {
  const [selectedConversation, setSelectedConversation] =
    useState("alice-johnson");
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [showConversationSidebar, setShowConversationSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowConversationSidebar(true);
      } else {
        setShowConversationSidebar(false);
        setShowContactPanel(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background relative">
      {/* Mobile Header */}
      {isMobile && (
        <div className="absolute top-0 left-0 right-0 h-12 bg-background border-b flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() =>
                setShowConversationSidebar(!showConversationSidebar)
              }
            >
              {showConversationSidebar ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Chats</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => setShowContactPanel(!showContactPanel)}
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Conversation Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 z-40",
          isMobile
            ? showConversationSidebar
              ? "fixed inset-y-0 left-0 w-80 bg-background border-r shadow-lg"
              : "w-0 overflow-hidden"
            : "w-80"
        )}
      >
        <ConversationSidebar
          selectedConversation={selectedConversation}
          onConversationSelect={(conversation) => {
            setSelectedConversation(conversation);
            if (isMobile) setShowConversationSidebar(false);
          }}
          isMobile={isMobile}
        />
      </div>

      {/* Main Chat Area */}
      <div className={cn("flex-1 flex flex-col", isMobile && "pt-12")}>
        <DirectChatArea
          conversationId={selectedConversation}
          onToggleContactPanel={() => setShowContactPanel(!showContactPanel)}
          showMobileHeader={!isMobile}
        />
      </div>

      {/* Contact Panel */}
      <div
        className={cn(
          "transition-all duration-300 border-l bg-muted/30 z-30",
          isMobile
            ? showContactPanel
              ? "fixed inset-y-0 right-0 w-80 bg-background shadow-lg"
              : "w-0 overflow-hidden"
            : showContactPanel
            ? "w-80"
            : "w-0 overflow-hidden"
        )}
      >
        {(showContactPanel || !isMobile) && (
          <ContactPanel conversationId={selectedConversation} />
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobile && (showConversationSidebar || showContactPanel) && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => {
            setShowConversationSidebar(false);
            setShowContactPanel(false);
          }}
        />
      )}
    </div>
  );
}
