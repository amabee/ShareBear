"use client";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { MobileBottomNav } from "@/components/MobileBottomNavBar";


export default function MessagesPage() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className=" overflow-hidden">
        <ChatInterface />
      </div>
      <MobileBottomNav />
    </div>
  );
}
