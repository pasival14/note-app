"use client";

import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  return (
    <main>
      {session ? <Dashboard /> : <AuthPage />}
    </main>
  );
}