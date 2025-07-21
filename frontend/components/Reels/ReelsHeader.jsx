"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReelsHeader() {
  const router = useRouter();

  const handleClose = () => {
    router.back(); // Go back to previous page
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="flex justify-between items-center pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/40 hover:cursor-pointer text-white rounded-full h-12 w-12
           backdrop-blur-md transition-all hover:scale-110"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </Button>
        {/* <div className="text-white font-semibold text-lg drop-shadow-lg">REELS</div> */}
        <div className="w-12" />
      </div>
    </div>
  );
}
