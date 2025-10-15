"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formatPhone, UserAvatar } from "@/helper/transform";
import { LeadDetails } from "./MarkAsLeadButton";
import { AssignAgent } from "./AssignAgent";

export default function ContactDetails({ name, phone, isLead, leadId }) {
  return (
    <div className="space-y-6 px-4 overflow-y-auto h-full pb-6">
      <div className="flex flex-col justify-center items-center py-5 text-center">
        <UserAvatar name={name} size="xl" />
        <h2
          className="text-lg font-semibold mt-3 max-w-[200px] truncate"
          title={name}
        >
          {name || "—"}
        </h2>
        <p
          className="text-sm text-muted-foreground truncate max-w-[180px]"
          title={formatPhone(phone)}
        >
          {formatPhone(phone) || "—"}
        </p>
      </div>

      <Separator />

      <AssignAgent leadId={leadId} />

      <LeadDetails isLead={isLead} leadId={leadId} />

      {/* Team Notes */}
      {/* <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" /> Team Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1">
          <div className="flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a note..."
              className="text-sm"
            />
            <Button onClick={handleAddComment} size="sm" className="text-xs">
              Add
            </Button>
          </div>

          <ScrollArea className="h-48 mt-3 pr-1">
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border p-2 bg-muted/40 text-sm transition hover:bg-muted/60"
                >
                  <div className="flex justify-between items-center">
                    <p
                      className="font-medium truncate max-w-[150px]"
                      title={c.author}
                    >
                      {c.author}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {c.time}
                    </p>
                  </div>
                  <p
                    className="text-muted-foreground text-[13px] leading-snug mt-1 truncate-2"
                    title={c.text}
                  >
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card> */}
    </div>
  );
}
