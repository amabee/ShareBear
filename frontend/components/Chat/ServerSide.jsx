"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const servers = [
  { id: "personal", name: "Personal", color: "bg-blue-500", type: "dm" },
  { id: "work", name: "Work", color: "bg-green-500", type: "server" },
  { id: "family", name: "Family", color: "bg-purple-500", type: "server" },
  { id: "friends", name: "Friends", color: "bg-pink-500", type: "server" },
  { id: "friends", name: "Friends", color: "bg-pink-500", type: "server" },
];

export function ServerSidebar({ selectedServer, onServerSelect }) {
  return (
    <div className="w-16 bg-muted/50 flex flex-col items-center py-3 space-y-2">
      <TooltipProvider>
        <div className="w-8 h-0.5 bg-muted-foreground/20 rounded-full" />

        {/* Server List */}
        <ScrollArea className="flex-1 w-full">
          <div className="space-y-3 px-2">
            {servers.map((server) => (
              <Tooltip key={server.id}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => onServerSelect(server.id)}
                    className={cn(
                      "p-2 rounded-2xl transition-all duration-200 cursor-pointer group",
                      selectedServer === server.id
                        ? "bg-primary/10 shadow-lg scale-105"
                        : "hover:bg-primary/5 hover:scale-105 hover:shadow-md"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-white font-semibold text-sm transition-all duration-200",
                        server.color,
                        selectedServer === server.id
                          ? "scale-110"
                          : "group-hover:scale-105"
                      )}
                    >
                      {server.type === "dm" ? (
                        <MessageCircle className="w-4 h-4" />
                      ) : (
                        server.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">{server.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </ScrollArea>

        {/* Add Server Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-2xl bg-muted hover:bg-green-500 hover:rounded-xl transition-all duration-200 text-green-500 hover:text-white"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Add Server</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
