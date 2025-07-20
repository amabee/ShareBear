"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, Inbox } from "lucide-react";

export default function EmptyState({ type = "all" }) {
  const getEmptyStateContent = () => {
    switch (type) {
      case "unread":
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500 mb-4" />,
          title: "All caught up! 🎉",
          description:
            "You have no unread notifications. Great job staying on top of things!",
        };
      case "mentions":
        return {
          icon: <Bell className="h-16 w-16 text-blue-500 mb-4" />,
          title: "No mentions yet",
          description: "When someone mentions you, you'll see it here.",
        };
      case "system":
        return {
          icon: <Bell className="h-16 w-16 text-orange-500 mb-4" />,
          title: "No system notifications",
          description: "System updates and security alerts will appear here.",
        };
      default:
        return {
          icon: <Inbox className="h-16 w-16 text-gray-400 mb-4" />,
          title: "No notifications",
          description: "When you have notifications, they'll appear here.",
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
        {content.icon}
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">
          {content.title}
        </h3>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-md">
          {content.description}
        </p>
      </CardContent>
    </Card>
  );
}
