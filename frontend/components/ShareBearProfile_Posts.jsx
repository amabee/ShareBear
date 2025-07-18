"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Heart,
  MessageCircle,
  FileText,
  Video,
  PlaySquare,
  ImageIcon,
} from "lucide-react";
import { formatCount } from "@/utils/formatCount";

export function ProfilePosts({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="group border-none overflow-hidden cursor-pointer hover:shadow-lg transition-all p-0 rounded-md"
        >
          {post.type === "text" ? (
            <AspectRatio ratio={4 / 5}>
              <div
                className="relative w-full h-full flex items-center justify-center p-6 overflow-hidden"
                style={{
                  background:
                    post.backgroundColor || post.backgroundImage
                      ? post.backgroundImage
                        ? `url(${post.backgroundImage})`
                        : post.backgroundColor
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 text-center">
                  <p className="text-white text-base font-medium leading-relaxed drop-shadow-lg line-clamp-6">
                    {post.content}
                  </p>
                </div>
                <Badge className="absolute top-2 right-2">
                  <FileText className="h-3 w-3 mr-1" />
                  Text
                </Badge>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="h-5 w-5" />
                      <span className="font-bold">
                        {formatCount(post.likes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-bold">
                        {formatCount(post.comments)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AspectRatio>
          ) : (
            <AspectRatio ratio={4 / 5}>
              <div className="relative w-full h-full">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt="Post"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-5 w-5 text-white" />
                      <span className="font-bold text-white">
                        {formatCount(post.likes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-5 w-5 text-white" />
                      <span className="font-bold text-white">
                        {formatCount(post.comments)}
                      </span>
                    </div>
                  </div>
                </div>
                {post.type === "video" && (
                  <Badge className="absolute top-2 right-2">
                    <Video className="h-3 w-3 mr-1" />
                    Video
                  </Badge>
                )}
                {post.type === "reel" && (
                  <Badge className="absolute top-2 right-2">
                    <PlaySquare className="h-3 w-3 mr-1" />
                    Reel
                  </Badge>
                )}
                {post.type === "image" && (
                  <Badge className="absolute top-2 right-2">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Image
                  </Badge>
                )}
              </div>
            </AspectRatio>
          )}
        </Card>
      ))}
    </div>
  );
}
