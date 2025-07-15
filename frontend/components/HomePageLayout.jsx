"use client";
import { DraggableFab } from "./DraggableFab";
import { MobileBottomNav } from "./MobileBottomNavBar";
import { ShareBearNavBar } from "./ShareBearNavBar";


export function HomePageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <ShareBearNavBar />
      <main className="pt-16 pb-16 lg:pb-0">{children}</main>
      <MobileBottomNav />
      <DraggableFab />
    </div>
  );
}
