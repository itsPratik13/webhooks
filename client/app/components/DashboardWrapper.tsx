"use client";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";
import ThemeToggle from "./ThemeToggle";
import StoreProvider, { useAppSelector } from "../redux";
import EndpointsTable from "./EndpointsTable";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex min-h-screen w-full  bg-zinc-50 font-sans dark:bg-black">
      <Sidebar />

      <main className="flex w-full  min-h-100 flex-col  bg-zinc-50 dark:bg-black font-sans  mt-2">
        <Navbar />
        <div className="w-full  h-full flex-1 ">
          <EndpointsTable />
        
        </div>
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
