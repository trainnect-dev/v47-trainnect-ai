"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "./icons";
import cn from "classnames";

export function Navigation() {
  const pathname = usePathname();
  
  return (
    <div className="fixed top-4 right-4 z-10 flex gap-2">
      <Link
        href="/"
        className={cn(
          "p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors",
          {
            "bg-zinc-200 dark:bg-zinc-700": pathname === "/",
          }
        )}
        aria-label="Home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>
      
      <Link
        href="/tavily-ai-search"
        className={cn(
          "p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors",
          {
            "bg-zinc-200 dark:bg-zinc-700": pathname === "/tavily-ai-search",
          }
        )}
        aria-label="Tavily AI Search"
      >
        <SearchIcon size={24} />
      </Link>
    </div>
  );
}
