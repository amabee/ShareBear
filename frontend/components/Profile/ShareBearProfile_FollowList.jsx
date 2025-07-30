"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ProfileFollowList({ users, title, onFollowToggle }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant={user.isFollowing ? "outline" : "default"}
              size="sm"
              onClick={() => onFollowToggle && onFollowToggle(user.id)}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
