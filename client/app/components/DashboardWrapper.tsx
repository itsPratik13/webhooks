"use client";
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";
import StoreProvider from "../redux";
import { useAuth } from "@clerk/nextjs";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-6 h-6 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <>{children}</>;

  return (
    <div className="flex min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <Sidebar />
      <main className="flex w-full min-h-100 flex-col bg-zinc-50 dark:bg-black font-sans mt-2">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;