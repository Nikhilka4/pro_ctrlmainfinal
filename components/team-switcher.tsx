"use client"
import { GalleryVerticalEnd } from "lucide-react"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

export function TeamSwitcher() {
  const { data: session } = useSession()
  const companyName = (session?.user?.companyName)?.toUpperCase() 
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          {session?.user?.role === "client" && (
          <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{companyName}</span>
              {/* <span className="truncate font-semibold">Constructions</span> */}
            </div>
          </>)}

          {session?.user?.role === "admin" && (
          <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Welcome</span>
              <span className="truncate font-semibold">Admin</span>
            </div>
          </>)}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
