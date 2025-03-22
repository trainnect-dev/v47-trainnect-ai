"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Search,
  MessageSquare,
  Menu,
  X,
  Settings,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarLinkProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

interface SidebarBodyProps extends React.ComponentProps<typeof motion.div> {
  className?: string;
  children: React.ReactNode;
}

interface SidebarLinkComponentProps {
  link: SidebarLinkProps;
  className?: string;
}

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
} | null>(null);

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen }: SidebarProps) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
        <Sun size={16} />
      </button>
    );
  }
  
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export const SidebarBody = ({ className, children, ...props }: SidebarBodyProps) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <>
      <motion.div
        {...props}
        animate={{
          width: open ? "240px" : "80px",
          transition: {
            duration: animate ? 0.2 : 0,
          },
        }}
        className={cn(
          "border-r border-border bg-background fixed h-screen flex flex-col p-3 gap-3",
          className
        )}
      >
        <div className="flex items-center justify-between h-12">
          <Logo />
          <div className="flex gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        {children}
      </motion.div>
      <div
        style={{
          width: open ? "240px" : "80px",
          transition: animate ? "width 0.2s" : "none",
        }}
      />
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
}: SidebarLinkComponentProps) => {
  const { open } = useSidebar();

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors",
        className
      )}
    >
      {link.icon}
      <motion.span
        animate={{
          opacity: open ? 1 : 0,
          transition: { duration: 0.2 },
        }}
        className="text-sm whitespace-pre"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const Logo = () => {
  const { open } = useSidebar();
  
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-foreground py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-foreground whitespace-pre"
        >
          Trainnect AI
        </motion.span>
      )}
    </Link>
  );
};

export const SidebarLinks = () => {
  return (
    <div className="flex flex-col gap-1">
      <SidebarLink
        link={{
          label: "Chat",
          href: "/",
          icon: <MessageSquare size={16} />,
        }}
      />
      <SidebarLink
        link={{
          label: "AI Search",
          href: "/tavily-ai-search",
          icon: <Search size={16} />,
        }}
      />
      <SidebarLink
        link={{
          label: "AI Agents",
          href: "/ai-agents",
          icon: <LayoutDashboard size={16} />,
        }}
      />
      <SidebarLink
        link={{
          label: "Prompts",
          href: "/admin/prompts",
          icon: <Settings size={16} />,
        }}
      />
    </div>
  );
};
