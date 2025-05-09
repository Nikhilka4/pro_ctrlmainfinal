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
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOutIcon, CircleUserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLogout = async () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    await signOut({ redirect: false });
    router.push("/auth");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const { data: session } = useSession();

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
        {session?.user?.role === "client" && (<Link href="/profile">
          <SidebarMenuButton
            asChild
            tooltip="Profile"
            className={
              isActive("/profile")
                ? "bg-slate-800 text-white hover:bg-slate-800 hover:text-white"
                : ""
            }
            onClick={() => {
              if (isMobile) {
                setOpenMobile(false);
              }
            }}
          >
            <div>
              <CircleUserRound className="h-4 w-4" />
              <span className="ml-2">Profile</span>
            </div>
          </SidebarMenuButton>
        </Link>)}
        <SidebarMenuButton
          asChild
          tooltip="Logout"
          className="bg-[#df6d71] hover:bg-[#df6d71d0] cursor-pointer"
          onClick={handleLogout}
        >
          <div>
            <LogOutIcon className="h-4 w-4" />
            <span className="ml-2">Logout</span>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
