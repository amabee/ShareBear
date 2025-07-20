"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationHeader({ unreadCount, onMarkAllRead }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell className="h-7 w-7 sm:h-8 sm:w-8" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Notifications
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "All caught up! 🎉"}
          </p>
        </div>
      </div>
      {unreadCount > 0 && (
        <Button
          onClick={onMarkAllRead}
          variant="outline"
          className="w-full sm:w-auto hover:bg-accent transition-colors bg-transparent"
        >
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
      )}
    </div>
  );
}
