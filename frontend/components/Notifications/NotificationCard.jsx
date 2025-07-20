"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Check,
  MoreHorizontal,
  Trash2,
  User,
  MessageCircle,
  Heart,
  UserPlus,
  Settings,
} from "lucide-react";

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getNotificationIcon = (type) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "mention":
        return <User className={iconClass} />;
      case "comment":
        return <MessageCircle className={iconClass} />;
      case "like":
        return <Heart className={iconClass} />;
      case "follow":
        return <UserPlus className={iconClass} />;
      case "system":
        return <Settings className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "mention":
        return "text-blue-500 border-blue-200";
      case "comment":
        return "text-green-500 border-green-200";
      case "like":
        return "text-red-500 border-red-200";
      case "follow":
        return "text-purple-500 border-purple-200";
      case "system":
        return "text-orange-500 border-orange-200";
      default:
        return "text-gray-500 border-gray-200";
    }
  };

  const getTypeEmoji = (type) => {
    switch (type) {
      case "mention":
        return "👤";
      case "comment":
        return "💬";
      case "like":
        return "❤️";
      case "follow":
        return "👥";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg hover:shadow-black/5 cursor-pointer group ${
        !notification.read
          ? "border-l-4 border-l-blue-500 shadow-md bg-gradient-to-r from-blue-50/30 to-transparent"
          : "hover:border-l-4 hover:border-l-gray-300"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar or Icon */}
          <div className="flex-shrink-0 relative">
            {notification.avatar ? (
              <div className="relative">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-offset-2 ring-transparent group-hover:ring-gray-200 transition-all">
                  <AvatarImage
                    src={notification.avatar || "/placeholder.svg"}
                    alt={notification.username}
                  />
                  <AvatarFallback className="text-sm font-semibold">
                    {notification.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 text-lg">
                  {getTypeEmoji(notification.type)}
                </div>
              </div>
            ) : (
              <div
                className={`p-2 sm:p-3 rounded-full border-2 ${getNotificationColor(
                  notification.type
                )} transition-all group-hover:scale-110`}
              >
                {getNotificationIcon(notification.type)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-semibold text-sm sm:text-base leading-tight ${
                      !notification.read
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {notification.message}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {notification.time}
                  </span>
                  {notification.username &&
                    notification.username !== "system" && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-blue-600 font-medium">
                          @{notification.username}
                        </span>
                      </>
                    )}
                </div>
              </div>

              {/* Actions */}
              <div
                className={`transition-opacity ${
                  isHovered ? "opacity-100" : "opacity-0 sm:opacity-100"
                }`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-accent/50 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {notification.read ? (
                      <DropdownMenuItem
                        onClick={() => onMarkAsUnread(notification.id)}
                        className="cursor-pointer"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Mark as unread
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onMarkAsRead(notification.id)}
                        className="cursor-pointer"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(notification.id)}
                      className="text-destructive cursor-pointer focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
