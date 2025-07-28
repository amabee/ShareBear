"use client";
import dynamic from "next/dynamic";

const ProfileCard = dynamic(() => import("./ProfileCard"), {
  loading: () => <div>Loading...</div>,
});

export default function TestDynamic() {
  return <ProfileCard />;
} 
