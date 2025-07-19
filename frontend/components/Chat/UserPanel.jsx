"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const onlineUsers = [
  {
    name: "Alice Johnson",
    avatar: "A",
    color: "bg-blue-500",
    status: "online",
  },
  { name: "Bob Smith", avatar: "B", color: "bg-green-500", status: "online" },
  {
    name: "David Wilson",
    avatar: "D",
    color: "bg-orange-500",
    status: "online",
  },
];

const offlineUsers = [
  {
    name: "Carol Davis",
    avatar: "C",
    color: "bg-purple-500",
    status: "offline",
  },
  { name: "Eve Brown", avatar: "E", color: "bg-pink-500", status: "offline" },
  {
    name: "Frank Miller",
    avatar: "F",
    color: "bg-indigo-500",
    status: "offline",
  },
];

export function UserPanel() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b">
        <h3 className="font-semibold text-sm">
          Members — {onlineUsers.length + offlineUsers.length}
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Online Users */}
          <div>
            <div className="px-3 py-2 mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Online — {onlineUsers.length}
              </span>
            </div>

            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div
                  key={user.name}
                  className="p-3 rounded-xl border bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm",
                          user.color
                        )}
                      >
                        {user.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Online
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Users */}
          <div>
            <div className="px-3 py-2 mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Offline — {offlineUsers.length}
              </span>
            </div>

            <div className="space-y-2">
              {offlineUsers.map((user) => (
                <div
                  key={user.name}
                  className="p-3 rounded-xl border bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:bg-muted/50 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm",
                          user.color
                        )}
                      >
                        {user.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-muted-foreground border-2 border-background rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last seen 2h ago
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
