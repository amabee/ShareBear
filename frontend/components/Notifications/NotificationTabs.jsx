"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function NotificationTabs({
  activeTab,
  onTabChange,
  totalCount,
  unreadCount,
  mentionsCount,
  systemCount,
}) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
        <TabsTrigger
          value="all"
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm"
        >
          <span>All</span>
          {totalCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1 text-xs">
              {totalCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="unread"
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm"
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="h-4 px-1 text-xs animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="mentions"
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Mentions</span>
          <span className="sm:hidden">@</span>
          {mentionsCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1 text-xs">
              {mentionsCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="system"
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">System</span>
          <span className="sm:hidden">⚙️</span>
          {systemCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1 text-xs">
              {systemCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
