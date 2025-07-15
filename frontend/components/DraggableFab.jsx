"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  MessageCircle,
  Play,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DraggableFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const fabRef = useRef(null);
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });
  const notificationCount = 3;

  const menuItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      href: "/search",
      icon: Search,
      label: "Search",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      href: "/reels",
      icon: Play,
      label: "Reels",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      href: "/create",
      icon: PlusSquare,
      label: "Create",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      href: "/notifications",
      icon: Heart,
      label: "Notifications",
      color: "bg-red-500 hover:bg-red-600",
      badge: notificationCount,
    },
    {
      href: "/messages",
      icon: MessageCircle,
      label: "Messages",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ];

  // Initialize position after component mounts
  useEffect(() => {
    setIsClient(true);
    const savedPosition = localStorage.getItem("fab-position");
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch {
        // If parsing fails, use default position
        setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 120 });
      }
    } else {
      // Default position (bottom right)
      setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 120 });
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    if (isClient && (position.x !== 0 || position.y !== 0)) {
      localStorage.setItem("fab-position", JSON.stringify(position));
    }
  }, [position, isClient]);

  // Optimized drag handlers
  const handleDragStart = useCallback(
    (clientX, clientY) => {
      if (isOpen) return false;

      setIsDragging(true);
      dragRef.current = {
        startX: clientX,
        startY: clientY,
        startPosX: position.x,
        startPosY: position.y,
      };
      return true;
    },
    [isOpen, position]
  );

  const handleDragMove = useCallback(
    (clientX, clientY) => {
      if (!isDragging) return;

      const deltaX = clientX - dragRef.current.startX;
      const deltaY = clientY - dragRef.current.startY;

      const newX = dragRef.current.startPosX + deltaX;
      const newY = dragRef.current.startPosY + deltaY;

      // Constrain to screen bounds
      const maxX = window.innerWidth - 56;
      const maxY = window.innerHeight - 56;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e) => {
      handleDragMove(e.clientX, e.clientY);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    },
    [isDragging, handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const handleFabClick = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  // Don't render until client-side
  if (!isClient) {
    return null;
  }

  // Simple positioning - always show menu above FAB
  const showMenuAbove = position.y > window.innerHeight / 2;

  return (
    <>
      {/* Background Blur Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <div
        ref={fabRef}
        className="fixed z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isDragging ? "scale(1.1)" : "scale(1)",
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
      >
        {/* Menu Items */}
        {isOpen && (
          <div
            className={cn(
              "absolute left-1/2 transform -translate-x-1/2 flex flex-col gap-3 transition-all duration-300",
              showMenuAbove ? "bottom-16" : "top-16"
            )}
          >
            {menuItems.map((item, index) => (
              <div
                key={item.href}
                className="flex items-center gap-3"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border text-sm font-medium whitespace-nowrap">
                  {item.label}
                </div>
                <Link href={item.href} onClick={() => setIsOpen(false)}>
                  <Button
                    size="icon"
                    className={cn(
                      "h-12 w-12 rounded-full shadow-lg relative",
                      item.color
                    )}
                  >
                    <item.icon className="h-6 w-6 text-white" />
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB Button */}
        <Button
          size="icon"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleFabClick}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 select-none",
            isOpen && "rotate-45",
            isDragging && "cursor-grabbing"
          )}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Plus className="h-6 w-6 text-white" />
          )}
        </Button>

        {/* Drag Indicator */}
        {isDragging && (
          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-purple-400 animate-pulse" />
        )}
      </div>
    </>
  );
}
