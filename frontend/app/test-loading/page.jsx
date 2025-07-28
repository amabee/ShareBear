"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function TestLoadingPage() {
  const [showLoading, setShowLoading] = useState(false);

  const handleShowLoading = () => {
    setShowLoading(true);
    
    // Show loading for 4 seconds
    setTimeout(() => {
      setShowLoading(false);
    }, 4000);
  };

  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Test Loading Screen
        </h1>
        <p className="text-gray-600 mb-8">
          Click the button below to see the ShareBear loading screen in action!
        </p>
        
        <button
          onClick={handleShowLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Show Loading Screen
        </button>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>You'll see:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>🐻 Jumping polar bear animation</li>
            <li>Rotating ShareBear-themed quotes</li>
            <li>Beautiful gradient background</li>
            <li>ShareBear branding</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
