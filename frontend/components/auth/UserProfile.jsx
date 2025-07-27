"use client";

import { useAuth, useLogout } from "@/hooks/useNextAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">Please sign in to view your profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Username</p>
          <p className="font-medium">{user?.username}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">User ID</p>
          <p className="font-medium">{user?.id}</p>
        </div>
        <Button 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          variant="destructive"
          className="w-full"
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </CardContent>
    </Card>
  );
} 
