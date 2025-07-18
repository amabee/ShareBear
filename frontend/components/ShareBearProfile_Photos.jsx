"use client";

import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ProfilePhotos({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <AspectRatio
          key={post.id}
          ratio={4 / 5}
          className="overflow-hidden rounded-lg cursor-pointer group"
        >
          <Image
            src={post.image || "/placeholder.svg"}
            alt="Photo"
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </AspectRatio>
      ))}
    </div>
  );
}
