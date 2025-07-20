"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import NotificationCard from "./NotificationCard";
import EmptyState from "./EmptyState";

export default function NotificationList({
  activeTab,
  notifications,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}) {
  return (
    <Tabs defaultValue={activeTab}>
      <TabsContent value={activeTab} className="mt-6">
        <div className="space-y-3 sm:space-y-4">
          {notifications.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onMarkAsUnread={onMarkAsUnread}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
