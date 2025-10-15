"use client";

import ChatHeader from "@/components/global/chat/chat-header";
import ContactDetails from "@/components/global/chat/contact-details";
import ChatInput from "@/components/global/chat/input/input-field";
import { InboxSidebar } from "@/components/inbox-sidebar";
import { ChatHeaderSkeleton } from "@/components/skeleton/ChatHeaderSkeleton";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useConversation } from "@/store/hooks/useConversation";
export default function Page({ children }) {
  const { chatDetails, chatDetailsLoading } = useConversation();

  return (
    <SidebarProvider style={{ "--sidebar-width": "350px" }}>
      <InboxSidebar />

      <SidebarInset className="flex flex-col h-screen bg-white dark:bg-black text-black dark:text-white">
        <Sheet>
          <SheetTrigger asChild>
            <header
              className="
        sticky w-full top-0 z-10 bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700"
            >
              {chatDetailsLoading ? (
                <ChatHeaderSkeleton />
              ) : (
                <ChatHeader
                  name={chatDetails?.contactId?.primaryName}
                  phone={chatDetails?.contactId?.primaryPhone}
                />
              )}
            </header>
          </SheetTrigger>

          <SheetContent position="right" size="sm">
            <SheetHeader>
              <SheetTitle>Contact Details</SheetTitle>
            </SheetHeader>
            <ContactDetails
              name={chatDetails?.contactId?.primaryName}
              phone={chatDetails?.contactId?.primaryPhone}
              isLead={chatDetails?.isLead}
              leadId={chatDetails?.leadId}
            />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto p-4">{children}</main>

        <footer className="sticky bottom-0 z-10 p-4 bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700">
          <ChatInput />
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
