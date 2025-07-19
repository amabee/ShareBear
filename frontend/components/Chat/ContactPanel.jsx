"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Video,
  Mail,
  Bell,
  Shield,
  Trash2,
  BlocksIcon as Block,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const contactData = {
  "alice-johnson": {
    name: "Alice Johnson",
    avatar: "A",
    color: "bg-blue-500",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    isOnline: true,
    mutualFriends: 12,
    joinedDate: "March 2023",
  },
};

export function ContactPanel({ conversationId }) {
  const contact = contactData[conversationId] || contactData["alice-johnson"];

  return (
    <div className="w-80 h-full flex flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Contact Header */}
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl",
                  contact.color
                )}
              >
                {contact.avatar}
              </div>
              {contact.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold">{contact.name}</h3>
              <p className="text-sm text-muted-foreground">
                {contact.isOnline ? "Online" : "Last seen 2 hours ago"}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full bg-transparent"
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full bg-transparent"
              >
                <Video className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full bg-transparent"
              >
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Contact Info</h4>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Email</div>
                <div className="text-sm">{contact.email}</div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Phone</div>
                <div className="text-sm">{contact.phone}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Media & Files */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Media & Files</h4>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground">IMG</span>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full text-sm">
              View All Media
            </Button>
          </div>

          <Separator />

          {/* Settings */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Settings</h4>

            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3"
              >
                <Bell className="w-4 h-4 mr-3" />
                <span className="text-sm">Notifications</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3"
              >
                <Shield className="w-4 h-4 mr-3" />
                <span className="text-sm">Privacy</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3"
              >
                <Heart className="w-4 h-4 mr-3" />
                <span className="text-sm">Add to Favorites</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 text-orange-600 hover:text-orange-700"
            >
              <Block className="w-4 h-4 mr-3" />
              <span className="text-sm">Block Contact</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              <span className="text-sm">Delete Conversation</span>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
