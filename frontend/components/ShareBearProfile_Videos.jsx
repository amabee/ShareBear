"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ProfileVideos({ posts }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="overflow-hidden p-0 cursor-pointer group border-none"
        >
          <AspectRatio ratio={4 / 5}>
            <div className="relative w-full h-full">
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Video"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-black/70 transition-colors">
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
                </div>
              </div>
              <Badge className="absolute top-2 right-2">
                {post.type === "reel" ? "Reel" : "Video"}
              </Badge>
            </div>
          </AspectRatio>
        </Card>
      ))}
    </div>
  );
}
