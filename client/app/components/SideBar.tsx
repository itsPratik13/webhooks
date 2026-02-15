"use client";
import {
  AlertCircle,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  TriangleAlert,
  Users2,
  UsersIcon,
  X,
} from "lucide-react";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "../redux";
import { setIsSideBarCollapsed } from "../state";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";

interface SidebarLinksTypes {
  href: string;
  Icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}
const SidebarLinks = ({
  href,
  Icon,
  label,
  isCollapsed,
}: SidebarLinksTypes) => {
  const pathname = usePathname();
  const isActive =
    href === pathname || (pathname == "/" && href == "/dashboard");
  const dispatch = useDispatch();
  const isSideBarCollapsed = useAppSelector((state) => {
    state.global.isSideBarCollapsed;
  });
  return (
    <Link href={href} className="w-full">
      <div className={`flex w-full items-center gap-3 p-3 justify-start`}>
        <Icon className="mr-8 size-5" />
        <span className="text-neutral-800 text-[16px] dark:text-neutral-300">
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const [showProject, setShowProject] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  const dispatch = useAppDispatch();
  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSideBarCollapsed
  );

  return (
    <div
      className={`
        bg-transparent min-h-screen min-w-0
        transition-[width] duration-300 ease-in-out
        ${isSideBarCollapsed ? "w-0 overflow-hidden" : "w-80"}
        flex flex-col justify-start z-20 shadow-2xl dark:bg-neutral-900
      `}
    >
      <div className="w-full min-h-[60px] flex flex-col px-4 py-4">
        {/* HEADER */}
        <div className="py-1 text-2xl font-semibold dark:text-neutral-200 flex justify-between items-center">
          <h1>Hooks</h1>

          {/* CLOSE ICON */}
          <button
            onClick={() => dispatch(setIsSideBarCollapsed(true))}
            className={`
              cursor-pointer shrink-0
              transition-all duration-250 ease-in-out
              ${
                isSideBarCollapsed
                  ? "opacity-0 scale-75 -rotate-45 pointer-events-none"
                  : "opacity-100 scale-100 rotate-0 pointer-events-auto"
              }
              hover:rotate-90 active:scale-90
            `}
          >
            <X size={24} />
          </button>
        </div>

        <hr className="border-neutral-200 mt-1 mb-2 w-full dark:border-neutral-700" />

        {/* TEAM INFO */}
        <div className="flex items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop"
            alt="logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <p className="font-medium text-base dark:text-neutral-300">
              Cartoon's Team
            </p>
            <div className="flex gap-2 items-center">
              <LockIcon size={14} />
              <p className="text-sm text-neutral-600 dark:text-neutral-500">
                Private
              </p>
            </div>
          </div>
        </div>
        <hr className="border-neutral-200 mt-1 mb-2 w-full dark:border-neutral-700 mt-2" />
        {/* links  */}
        <div className={`w-full flex flex-col   `}>
          <SidebarLinks
            href="/"
            Icon={Layers3}
            isCollapsed={isSideBarCollapsed}
            label="Endpoints"
          />
        </div>
        <hr className="border-neutral-200 mt-1 mb-2 w-full dark:border-neutral-700" />

      
      </div>
    </div>
  );
};

export default Sidebar;
