"use client";

import type * as React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,

  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { CircleUserIcon } from "lucide-react";


// Simplified data structure

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth");
  };

  const { data: session } = useSession();
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="border-t pt-2">
      {session?.user?.role === "client" && (
          <SidebarMenuButton
            asChild
            tooltip="Profile"
            className={
              isActive("/profile")
                ? "bg-slate-800 text-white hover:bg-slate-800 hover:text-white"
                : ""
            }
          >
            <Link href="/profile">
              <CircleUserIcon className="h-4 w-4" />
              <span className="ml-2">Profile</span>
            </Link>
          </SidebarMenuButton>
        )}
          <SidebarMenuButton asChild tooltip="Logout" className="bg-[#df6d71] hover:bg-[#df6d71d0] cursor-pointer" onClick={handleLogout}>
            <div>
              <LogOutIcon className="h-4 w-4" />
              <span className="ml-2">Logout</span>
            </div>
          </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
