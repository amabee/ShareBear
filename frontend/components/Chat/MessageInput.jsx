"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessageInput({ channelName }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${channelName}...`}
            className="pl-3 pr-12 h-10 rounded-lg border-border/50 bg-muted/30 focus:bg-background transition-all duration-200 text-sm resize-none"
          />

          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-muted/50 rounded-lg transition-all duration-200"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className={cn(
            "w-10 h-10 rounded-lg flex-shrink-0 transition-all duration-200",
            message.trim() 
              ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105" 
              : "bg-muted/50 text-muted-foreground"
          )}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
