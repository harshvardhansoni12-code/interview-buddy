"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/authpage");
  }

  return <DashboardPage />;
}
