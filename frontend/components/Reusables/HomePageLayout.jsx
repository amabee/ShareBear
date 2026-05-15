"use client";
import { MobileBottomNav } from "./MobileBottomNavbar";

export function HomePageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-4 pb-20 lg:pb-6">{children}</main>
      <MobileBottomNav />
    </div>
  );
}

