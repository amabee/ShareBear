"use client";
import ReelsContainer from "@/components/reels/ReelsContainer";
import ReelsHeader from "@/components/reels/ReelsHeader";

export default function ReelsPage() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <ReelsHeader />
      <ReelsContainer />
    </div>
  );
}
