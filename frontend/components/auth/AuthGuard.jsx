"use client";

import { useAuth } from "@/hooks/useNextAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/Reusables/LoadingScreen";

export default function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen message="Loading..." showQuotes={false} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
