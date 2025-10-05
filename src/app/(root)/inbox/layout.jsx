"use client";

import ChatInput from "@/components/global/chat/input/input-field";
import { InboxSidebar } from "@/components/inbox-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page({ children }) {
  return (
    <SidebarProvider style={{ "--sidebar-width": "350px" }}>
      {/* Sidebar */}
      <InboxSidebar />

      {/* Main Content */}
      <SidebarInset className="flex flex-col h-screen bg-white dark:bg-black text-black dark:text-white">
        {/* Header */}
        <header className="bg-white dark:bg-black sticky top-0 z-20 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 h-6 data-[orientation=vertical]:h-6"
          />
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-1">
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="hover:underline">
                  All Inboxes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 overflow-y-auto p-4">{children}</main>

        <footer className="sticky bottom-0 z-10 p-4 bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700">
          <ChatInput />
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
