"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOrganization } from "@clerk/nextjs";
import { Plus, UserPlus2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; // optional utility for conditional classes

const AssignAgent = ({ initialAssignedAgents = [] }) => {
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [assignedAgents, setAssignedAgents] = useState(initialAssignedAgents);

  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  if (!memberships) return null;

  const handleAssign = (agent) => {
    if (!assignedAgents.find((a) => a.id === agent.id)) {
      setAssignedAgents([...assignedAgents, agent]);
    }
    setSelectedAgent(agent);
    setAssignOpen(false);
  };

  return (
    <div>
      {/* Assigned Agents Card */}
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserPlus2 className="h-4 w-4 text-primary" /> Assigned Agents
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-1">
          {assignedAgents.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {assignedAgents.map((agent) => (
                <Badge
                  key={agent.id}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 max-w-[120px] truncate"
                  title={agent.name}
                >
                  {agent.name}
                </Badge>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="ml-auto text-xs"
                onClick={() => setAssignOpen(true)}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">No agent assigned</p>
              <Button
                size="sm"
                onClick={() => setAssignOpen(true)}
                className="flex items-center gap-1 text-xs"
              >
                <Plus className="h-4 w-4" /> Assign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Agent Sheet */}
      <Sheet open={assignOpen} onOpenChange={setAssignOpen}>
        <SheetContent side="right" className="w-[320px] px-4 sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Assign Agent</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-3">
            {memberships.data?.map((membership) => {
              const agent = {
                id: membership.id,
                name: `${membership.publicUserData?.firstName || ""} ${
                  membership.publicUserData?.lastName || ""
                }`.trim(),
                image: membership.publicUserData?.imageUrl || null, // Profile image
              };
              const initials = agent.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={membership.id}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition hover:bg-muted/30",
                    selectedAgent?.id === agent.id &&
                      "border-primary bg-primary/10"
                  )}
                  onClick={() => handleAssign(agent)}
                >
                  <div className="flex items-center gap-2">
                    {agent.image ? (
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                        {initials}
                      </div>
                    )}
                    <span
                      className="font-medium text-sm truncate max-w-[180px]"
                      title={agent.name}
                    >
                      {agent.name}
                    </span>
                  </div>

                  {selectedAgent?.id === agent.id && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </div>
              );
            })}

            {memberships.hasNextPage && (
              <Button
                size="sm"
                onClick={() => memberships.fetchNext()}
                className="mt-2 w-full"
              >
                Load More
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AssignAgent;
