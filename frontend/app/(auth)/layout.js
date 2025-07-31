"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/Reusables/LoadingScreen";

export default function AuthLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <LoadingScreen message="Checking authentication..." showQuotes={false} />
    );
  }

  if (status === "authenticated" && session?.user) {
    return null;
  }

  return <>{children}</>;
}
