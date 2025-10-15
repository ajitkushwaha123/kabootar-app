"use client";

import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export const LeadSkeleton = () => (
  <div className="animate-pulse space-y-2 p-4 border rounded-lg shadow-sm bg-card">
    <div className="h-4 w-1/3 bg-gray-300 rounded" />
    <div className="h-3 w-full bg-gray-300 rounded" />
    <div className="h-3 w-full bg-gray-300 rounded" />
    <div className="h-3 w-2/3 bg-gray-300 rounded" />
  </div>
);

const leadAPI = {
  fetchLead: async (leadId) => {
    const { data } = await axios.get(`/api/organization/inbox/leads/${leadId}`);
    return data.lead || null;
  },
  updateLead: async (leadId, payload) => {
    const { data } = await axios.put(
      `/api/organization/inbox/leads/${leadId}`,
      payload
    );
    return data.lead;
  },
};

export function LeadDetails({ leadId }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchLead = async () => {
    if (!leadId) return;
    setFetching(true);
    try {
      const data = await leadAPI.fetchLead(leadId);
      setLead(data);
    } catch (err) {
      console.error("Failed to fetch lead:", err);
      toast.error("Failed to load lead details");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const formik = useFormik({
    initialValues: {
      title: lead?.title || "",
      description: lead?.description || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Title is required"),
      description: Yup.string().trim(),
    }),
    onSubmit: async (values) => {
      if (!leadId) return;
      setLoading(true);
      try {
        const updatedLead = await leadAPI.updateLead(leadId, values);
        setLead(updatedLead);
        toast.success("Lead updated successfully");
        setOpen(false);
      } catch (err) {
        console.error("Failed to update lead:", err);
        toast.error("Failed to update lead");
      } finally {
        setLoading(false);
      }
    },
  });

  if (fetching) return <LeadSkeleton />;
  if (!lead) return null;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{lead?.title}</h3>
          <p className="text-sm text-muted-foreground">
            {lead?.description || "No description"}
          </p>
        </div>

        {/* Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Lead Details</DialogTitle>
              <DialogDescription>
                Update title and description for this lead.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-sm text-red-500">{formik.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
              </div>

              <DialogFooter className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </div>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
