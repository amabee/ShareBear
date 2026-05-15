"use client";
import React, { useState } from "react";
import { Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = ["For You", "Following", "Trending"];

export default function TopNavBar() {
  const [activeTab, setActiveTab] = useState("For You");

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top row */}
        <div className="flex items-center justify-between h-14">
          <span
            className="text-2xl select-none bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
            style={{ fontFamily: "'Pacifico', 'Comic Sans MS', cursive, sans-serif" }}
          >
            🐻 ShareBear
          </span>
          <div className="flex items-center gap-1">
            <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-background" />
            </button>
          </div>
        </div>

        {/* Feed tab switcher */}
        <div className="flex items-center gap-1 pb-2.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                activeTab === tab
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

