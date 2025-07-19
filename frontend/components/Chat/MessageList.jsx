"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";

const mockMessages = [
  {
    id: "1",
    user: {
      name: "Alice Johnson",
      avatar: "A",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      isOnline: true,
    },
    content: "Hey everyone! How's the project going?",
    timestamp: "Today at 2:30 PM",
    reactions: [
      { emoji: "👍", count: 3, reacted: false },
      { emoji: "❤️", count: 1, reacted: true },
    ],
  },
  {
    id: "2",
    user: {
      name: "Bob Smith",
      avatar: "B",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      isOnline: true,
    },
    content:
      "Making great progress! Just finished the authentication system. The new design looks amazing 🚀",
    timestamp: "Today at 2:32 PM",
    reactions: [
      { emoji: "🚀", count: 5, reacted: true },
      { emoji: "🔥", count: 2, reacted: false },
    ],
  },
  {
    id: "3",
    user: {
      name: "Carol Davis",
      avatar: "C",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      isOnline: false,
    },
    content:
      "That's awesome! I'll review the PR later today. Also, should we schedule a meeting for tomorrow?",
    timestamp: "Today at 2:35 PM",
    reactions: [],
  },
  {
    id: "4",
    user: {
      name: "David Wilson",
      avatar: "D",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      isOnline: true,
    },
    content: "I'm free after 3 PM. By the way, here's the latest mockup:",
    timestamp: "Today at 2:37 PM",
    reactions: [{ emoji: "👀", count: 2, reacted: false }],
    hasAttachment: true,
  },
  {
    id: "5",
    user: {
      name: "Alice Johnson",
      avatar: "A",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      isOnline: true,
    },
    content:
      "Perfect timing! The mockup looks great. I love the color scheme you chose.",
    timestamp: "Today at 2:40 PM",
    reactions: [],
  },
];

export function MessageList() {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full px-4">
        <div className="space-y-4 py-4">
          {mockMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
