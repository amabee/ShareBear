import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  MessageCircle,
  Play,
  Plus,
  X,
  Sparkles,
  Settings,
  User,
} from "lucide-react";

export function DraggableFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const fabRef = useRef(null);
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });

  const menuItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      color:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    {
      href: "/search",
      icon: Search,
      label: "Search",
      color:
        "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    },
    {
      href: "/reels",
      icon: Play,
      label: "Reels",
      color:
        "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    },
    {
      href: "/create",
      icon: PlusSquare,
      label: "Create",
      color:
        "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    },
    {
      href: "/notifications",
      icon: Heart,
      label: "Notifications",
      color:
        "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700",
      badge: 3,
    },
    {
      href: "/messages",
      icon: MessageCircle,
      label: "Messages",
      color:
        "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
      badge: 12,
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      color:
        "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      color:
        "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
    },
  ];

  // Initialize position after component mounts
  useEffect(() => {
    setIsClient(true);
    // Default position (bottom right)
    setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 120 });
  }, []);

  const DRAG_THRESHOLD = 3; // Reduced threshold for better responsiveness

  const handleDragStart = useCallback(
    (clientX, clientY) => {
      if (isOpen) return false;

      setDragMoved(false);
      dragRef.current = {
        startX: clientX,
        startY: clientY,
        startPosX: position.x,
        startPosY: position.y,
      };
      // Don't set isDragging immediately - wait for actual movement
      return true;
    },
    [isOpen, position]
  );

  const handleDragMove = useCallback(
    (clientX, clientY) => {
      const deltaX = clientX - dragRef.current.startX;
      const deltaY = clientY - dragRef.current.startY;

      // Check if we've moved enough to consider this a drag
      if (
        Math.abs(deltaX) > DRAG_THRESHOLD ||
        Math.abs(deltaY) > DRAG_THRESHOLD
      ) {
        if (!isDragging) {
          setIsDragging(true);
        }
        setDragMoved(true);

        const newX = dragRef.current.startPosX + deltaX;
        const newY = dragRef.current.startPosY + deltaY;

        // Constrain to screen bounds with padding
        const padding = 20;
        const fabSize = 56;
        const maxX = window.innerWidth - fabSize - padding;
        const maxY = window.innerHeight - fabSize - padding;

        setPosition({
          x: Math.max(padding, Math.min(newX, maxX)),
          y: Math.max(padding, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      // Snap to nearest side with smooth animation
      const fabWidth = 56;
      const centerX = position.x + fabWidth / 2;
      const screenWidth = window.innerWidth;
      const padding = 20;

      const snapX =
        centerX < screenWidth / 2 ? padding : screenWidth - fabWidth - padding;

      setPosition((prev) => ({ x: snapX, y: prev.y }));
    }
  }, [isDragging, position]);

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
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    },
    [handleDragMove]
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
    // Only toggle if we haven't dragged
    if (!dragMoved) {
      setIsOpen(!isOpen);
    }
  };

  // Don't render until client-side
  if (!isClient) {
    return null;
  }

  // Determine menu position based on FAB location
  const showMenuAbove = position.y > window.innerHeight / 2;
  const showMenuLeft = position.x > window.innerWidth / 2;

  return (
    <>
      {/* Background Blur Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
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
          transition: isDragging
            ? "transform 0.2s cubic-bezier(.4,0,.2,1)"
            : "all 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Menu Items */}
        {isOpen && (
          <div
            className={`absolute flex gap-3 transition-all duration-300 ${
              showMenuAbove ? "bottom-16" : "top-16"
            } ${
              showMenuLeft
                ? "right-0 flex-col items-end"
                : "left-0 flex-col items-start"
            }`}
          >
            {menuItems.map((item, index) => (
              <div
                key={item.href}
                className={`flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in ${
                  showMenuLeft ? "flex-row-reverse" : "flex-row"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border text-sm font-medium whitespace-nowrap">
                  {item.label}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`h-12 w-12 rounded-full shadow-lg relative ${item.color} transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <item.icon className="h-6 w-6 text-white mx-auto" />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs animate-pulse">
                      {item.badge > 99 ? "99+" : item.badge}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleFabClick}
          className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-200 select-none focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
            isOpen
              ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rotate-45"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          } ${
            isDragging
              ? "cursor-grabbing scale-110"
              : "cursor-grab hover:scale-105"
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white mx-auto" />
          ) : (
            <Plus className="h-6 w-6 text-white mx-auto" />
          )}

          {/* Sparkle effect when not dragging */}
          {!isDragging && (
            <Sparkles className="absolute top-1 right-1 h-3 w-3 text-white/60 animate-pulse" />
          )}
        </button>

        {/* Drag Indicator */}
        {isDragging && (
          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-blue-400 animate-pulse" />
        )}

        {/* Floating particles effect */}
        {isOpen && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 200}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
