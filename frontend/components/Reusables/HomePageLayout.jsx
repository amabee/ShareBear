"use client";
import { MobileBottomNav } from "./MobileBottomNavBar";

export function HomePageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-16 lg:pb-14">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
