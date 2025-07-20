"use client";

import { useState } from "react";
import { HomePageLayout } from "@/components/HomePageLayout";
import TopNavBar from "@/components/TopNavBar";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationTabs from "@/components/notifications/NotificationTabs";
import NotificationList from "@/components/notifications/NotificationList";

const initialNotifications = [
  {
    id: "1",
    type: "mention",
    title: "New mention",
    message:
      'Sarah mentioned you in a comment: "Great work on the project @you! The implementation looks solid 👏"',
    time: "2 minutes ago",
    read: false,
    avatar: "/placeholder.svg?height=32&width=32",
    username: "sarah_dev",
  },
  {
    id: "2",
    type: "like",
    title: "Post liked",
    message:
      "Alex and 12 others liked your recent post about React hooks and modern patterns",
    time: "1 hour ago",
    read: false,
    avatar: "/placeholder.svg?height=32&width=32",
    username: "alex_codes",
  },
  {
    id: "3",
    type: "comment",
    title: "New comment",
    message:
      'Emma commented on your post: "This is exactly what I was looking for! Thanks for sharing 🙌"',
    time: "3 hours ago",
    read: true,
    avatar: "/placeholder.svg?height=32&width=32",
    username: "emma_design",
  },
  {
    id: "4",
    type: "follow",
    title: "New follower",
    message: "Mike started following you and liked 3 of your recent posts",
    time: "1 day ago",
    read: true,
    avatar: "/placeholder.svg?height=32&width=32",
    username: "mike_frontend",
  },
  {
    id: "5",
    type: "system",
    title: "Security update",
    message:
      "Your password was successfully changed from a new device (iPhone 15 Pro)",
    time: "2 days ago",
    read: false,
    username: "system",
  },
  {
    id: "6",
    type: "mention",
    title: "Tagged in post",
    message:
      "Lisa tagged you in a post about the latest Next.js 15 features and improvements",
    time: "3 days ago",
    read: true,
    avatar: "/placeholder.svg?height=32&width=32",
    username: "lisa_nextjs",
  },
  {
    id: "7",
    type: "like",
    title: "Multiple likes",
    message: "Your tutorial on TypeScript got 50+ likes in the last hour! 🔥",
    time: "4 hours ago",
    read: false,
    avatar: "/placeholder.svg?height=32&width=32",
    username: "dev_community",
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const mentionsCount = notifications.filter(
    (n) => n.type === "mention"
  ).length;
  const systemCount = notifications.filter((n) => n.type === "system").length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: false } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "mentions":
        return notifications.filter((n) => n.type === "mention");
      case "system":
        return notifications.filter((n) => n.type === "system");
      default:
        return notifications;
    }
  };

  return (
    <HomePageLayout>
      <TopNavBar />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <NotificationHeader
            unreadCount={unreadCount}
            onMarkAllRead={markAllAsRead}
          />

          <NotificationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalCount={notifications.length}
            unreadCount={unreadCount}
            mentionsCount={mentionsCount}
            systemCount={systemCount}
          />

          <NotificationList
            activeTab={activeTab}
            notifications={getFilteredNotifications()}
            onMarkAsRead={markAsRead}
            onMarkAsUnread={markAsUnread}
            onDelete={deleteNotification}
          />
        </div>
      </div>
    </HomePageLayout>
  );
}
