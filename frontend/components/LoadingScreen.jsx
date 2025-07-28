"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useState } from "react";

const loadingQuotes = [
  "Sharing is caring, loading is preparing...",
  "Your stories are worth the wait...",
  "Connecting you to amazing content...",
  "Almost there, bear with us...",
  "Loading your next adventure...",
  "Preparing something special for you...",
  "Gathering the best content just for you...",
  "Your feed is getting ready...",
  "Loading memories and moments...",
  "Preparing your personalized experience...",
];

const JumpingBear = ({ size = "default" }) => {
  const sizeMap = {
    small: "text-5xl",
    default: "text-7xl",
    large: "text-[10rem]", // Bigger for large screens
  };

  return (
    <div className={`${sizeMap[size]} relative`}>
      <div className="animate-jump-bear">
        <span className="drop-shadow-lg">🐻</span>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-400/30 rounded-full animate-shadow"></div>
    </div>
  );
};

export default function LoadingScreen({
  message = null,
  size = "default",
  showQuotes = true,
  className = "",
  useLottie = true,
}) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    if (showQuotes) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % loadingQuotes.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [showQuotes]);

  const sizeClasses = {
    small: "w-20 h-20",
    default: "w-36 h-36",
    large: "w-56 h-56", // Larger bear size for large screens
  };

  const containerClasses = {
    small: "min-h-[200px]",
    default: "min-h-screen",
    large: "min-h-screen",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className} 
      relative overflow-hidden`}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white 
      to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      />

      {/* Glowing blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-300/20 rounded-full 
        blur-3xl animate-pulse delay-700"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32
         bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-500"
        />
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 transition-opacity duration-500 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Bear */}
        <div
          className={`${sizeClasses[size]} mb-8
         relative`}
        >
          {useLottie ? (
            <Player
              autoplay
              loop
              src="/Jumping Polar Bear.json"
              style={{ width: "100%", height: "100%" }}
              className="drop-shadow-lg"
              fallback={<JumpingBear size={size} />}
            />
          ) : (
            <JumpingBear size={size} />
          )}
          <div className="absolute inset-0 rounded-full blur-xl animate-pulse" />
        </div>

        {/* Message or quote */}
        <div className="max-w-lg min-h-[60px] mb-6">
          {message ? (
            <p className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 animate-pulse">
              {message}
            </p>
          ) : showQuotes ? (
            <p className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300 transition-all duration-500 ease-in-out">
              {loadingQuotes[currentQuote]}
            </p>
          ) : null}
        </div>

        {/* Branding */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ShareBear
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Share your world
          </p>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
