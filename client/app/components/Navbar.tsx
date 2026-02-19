"use client";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu, SearchIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux";
import { setIsSideBarCollapsed } from "../state";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSideBarCollapsed
  );


  return (
    <div className="flex justify-between items-center px-4 py-2">
      <div className="flex items-center gap-6">
        {/* MENU ICON */}
        <Menu
          onClick={() => dispatch(setIsSideBarCollapsed(false))}
          className={`
            shrink-0 cursor-pointer
            transition-all duration-250 ease-out
            ${
              isSideBarCollapsed
                ? "opacity-100 scale-100 rotate-0 pointer-events-auto"
                : "opacity-0 scale-75 rotate-45 pointer-events-none"
            }
            hover:scale-110 active:scale-95
          `}
          size={24}
        />

        {/* SEARCH */}
        <div className="flex h-min w-80 relative">
          <SearchIcon className="absolute right-1 top-1/2 mr-2 size-5 -translate-y-1/2 transform cursor-pointer" />
          <input
            className="w-full rounded-2xl p-2 bg-neutral-100 border border-neutral-300 dark:bg-transparent dark:border dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-700 shadow-md focus:shadow-none dark:shadow-md dark:shadow-neutral-600 focus:dark:shadow-none "
            type="search"
            placeholder="Search"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Settings />
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
