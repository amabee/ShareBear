"use client";

import ReelsContainer from "@/components/Reels/ReelsContainer";
import ReelsHeader from "@/components/Reels/ReelsHeader";

export default function ReelsPage() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <ReelsHeader />
      <ReelsContainer />
    </div>
  );
}
