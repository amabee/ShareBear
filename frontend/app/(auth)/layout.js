"use client";

import { useAuth } from "@/hooks/useNextAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function AuthLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." showQuotes={false} />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
