"use client";

import * as React from "react";
import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useConversation } from "@/store/hooks/useConversation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Inbox", url: "#", icon: Inbox, isActive: true },
    { title: "Drafts", url: "#", icon: File, isActive: false },
    { title: "Sent", url: "#", icon: Send, isActive: false },
    { title: "Junk", url: "#", icon: ArchiveX, isActive: false },
    { title: "Trash", url: "#", icon: Trash2, isActive: false },
  ],
};

export function InboxSidebar({ ...props }) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();

  const { conversations, getConversations } = useConversation();

  React.useEffect(() => {
    getConversations();
  }, []);

  return (
    <div className="flex h-screen shrink-0 border-r bg-background" {...props}>
      <aside className="flex w-[60px] flex-col border-r bg-background">
        <div className="flex h-14 items-center justify-center border-b">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <Command className="h-4 w-4" />
          </div>
        </div>

        <SidebarMenu className="flex flex-1 flex-col items-center py-4 space-y-2">
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => {
                  setActiveItem(item);
                  setOpen(true);
                }}
                isActive={activeItem?.title === item.title}
                className="flex h-10 w-10 items-center justify-center rounded-md"
              >
                <item.icon className="h-5 w-5" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="flex h-14 items-center justify-center border-t">
          <NavUser user={data.user} />
        </div>
      </aside>

      <aside className="flex w-[290px] flex-col">
        <SidebarHeader className="sticky top-0 z-10 border-b bg-background p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium">{activeItem?.title}</div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              {conversations?.map((conv) => (
                <a
                  href="#"
                  key={conv._id}
                  className="hover:bg-accent hover:text-accent-foreground flex flex-col items-start gap-1 border-b p-4 text-sm leading-tight last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="text-medium">
                      {conv.leadId?.name || "Unknown Lead"}
                    </span>
                    <span className="ml-auto text-xs">
                      {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="font-medium">
                    {/* {conv.lastMessageId?.messageType === "text"
                      ? conv.lastMessageId.text?.body
                      : "Media/Other Message"} */}
                  </span>
                  <span className="line-clamp-2 w-full text-xs whitespace-break-spaces">
                    {conv.lastMessageId?.messageType === "text"
                      ? conv.lastMessageId.text?.body
                      : ""}
                  </span>
                </a>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </aside>
    </div>
  );
}
