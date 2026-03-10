"use client";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu, SearchIcon, Settings,X } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux";
import { setIsSideBarCollapsed, setSearchValue } from "../state";
import { SignOutButton } from "@clerk/nextjs";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSideBarCollapsed
  );
  const search = useAppSelector((state) => state.global.search);

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
         
          <input
            className="w-full rounded-2xl p-2 bg-neutral-100 border border-neutral-300 
            dark:bg-neutral-900 dark:border dark:border-neutral-500 
            focus:outline-none focus:ring-2 focus:ring-neutral-300/50 dark:focus:ring-zinc-700 
            focus:border-neutral-400 dark:focus:border-neutral-400 
            shadow-md focus:shadow-none dark:shadow-md dark:shadow-neutral-600 focus:dark:shadow-none"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e)=>dispatch(setSearchValue(e.target.value))}
          />
          {search && (
            <button onClick={()=>dispatch(setSearchValue("")) }
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 
            hover:text-black dark:hover:text-white  rounded-full cursor-pointer"
            ><X/></button>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Settings />
        </Link>
        <ThemeToggle />
        <SignOutButton redirectUrl="/sign-in">
          <button className="cursor-pointer  px-1 py-1 rounded-xl text-[14px] bg-neutral-100 border border-neutral-300 hover:bg-neutral-200/50 transition-all duration-300 shadow-md dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-600 dark:shadow-md dark:shadow-neutral-600 dark:hover:shadow-none hover:shadow-none ">
            SignOut
          </button>
        </SignOutButton>
      </div>
    </div>
  );
};

export default Navbar;
