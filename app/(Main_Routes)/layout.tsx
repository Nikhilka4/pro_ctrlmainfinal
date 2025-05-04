import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserGreeting } from "@/components/user-greeting";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider
      >
        <AppSidebar />
        <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
           <div className="flex items-center gap-2 px-4">
               <SidebarTrigger className="-ml-1" />
              <span className="border-1 border-gray-400 h-4"></span>
               <UserGreeting />
             </div>
           </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
