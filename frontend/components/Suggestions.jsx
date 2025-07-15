"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestions } from "@/data/suggestions";


export function Suggestions() {
  return (
    <div className="space-y-6">
      {/* Your Profile */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src="/placeholder.svg?height=48&width=48"
                alt="Your profile"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">johndoe</p>
              <p className="text-xs text-muted-foreground">John Doe</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              Switch
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Suggested for you
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              See All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {suggestions.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.displayName}
                  />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Followed by {user.mutualFollowers} others
                  </p>
                </div>
                <Button size="sm" className="text-xs">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="text-xs text-muted-foreground space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Press
          </a>
          <a href="#" className="hover:underline">
            API
          </a>
          <a href="#" className="hover:underline">
            Jobs
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
        <p>© 2025 ShareBear</p>
      </div>
    </div>
  );
}
