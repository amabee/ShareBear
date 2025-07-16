"use client";
import React from "react";

export default function TopNavBar() {
  return (
    <nav
      className="w-full shadow-sm px-4 py-2 flex 
    items-center justify-center sticky top-0 z-50 bg-background border-gray-600 dark:border-b dark:bg-background "
    >
      <span
        className="text-3xl flex items-center gap-2 text-gray-800 tracking-wide
         select-none dark:text-white "
        style={{
          fontFamily: "'Pacifico', 'Comic Sans MS', cursive, sans-serif",
        }}
      >
        <span role="img" aria-label="bear">
          🐻
        </span>
        ShareBear
      </span>
    </nav>
  );
}
