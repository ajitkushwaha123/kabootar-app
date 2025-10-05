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
  mails: [
    {
      name: "William Smith",
      email: "williamsmith@example.com",
      subject: "Meeting Tomorrow",
      date: "09:34 AM",
      teaser:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      name: "Alice Smith",
      email: "alicesmith@example.com",
      subject: "Re: Project Update",
      date: "Yesterday",
      teaser:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      name: "Bob Johnson",
      email: "bobjohnson@example.com",
      subject: "Weekend Plans",
      date: "2 days ago",
      teaser:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
  ],
};

export function InboxSidebar({ ...props }) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const [mails, setMails] = React.useState(data.mails);
  const { setOpen } = useSidebar();

  return (
    <div className="flex h-screen shrink-0 border-r bg-background" {...props}>
      {/* Mini Sidebar (icons only) */}
      <aside className="flex w-[60px] flex-col border-r bg-background">
        {/* Logo / Brand */}
        <div className="flex h-14 items-center justify-center border-b">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Command className="size-4" />
          </div>
        </div>

        {/* Nav icons */}
        <SidebarMenu className="flex flex-1 flex-col items-center py-4 space-y-2">
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => {
                  setActiveItem(item);
                  const shuffled = [...data.mails].sort(
                    () => Math.random() - 0.5
                  );
                  setMails(shuffled);
                  setOpen(true);
                }}
                isActive={activeItem?.title === item.title}
                className="flex h-10 w-10 items-center justify-center rounded-md"
              >
                <item.icon className="size-5" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* User Avatar at bottom */}
        <div className="flex h-14 items-center justify-center border-t">
          <NavUser user={data.user} />
        </div>
      </aside>

      {/* Main Sidebar (search + mails) */}
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
              {mails.map((mail) => (
                <a
                  href="#"
                  key={mail.email}
                  className="hover:bg-accent hover:text-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{mail.name}</span>
                    <span className="ml-auto text-xs">{mail.date}</span>
                  </div>
                  <span className="font-medium">{mail.subject}</span>
                  <span className="line-clamp-2 w-full text-xs whitespace-break-spaces">
                    {mail.teaser}
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
