"use client";
import { MobileBottomNav } from "./MobileBottomNavBar";


export function HomePageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-4 pb-16 lg:pb-0">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
