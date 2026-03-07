"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Endpoint,
  useDeleteEndpointsMutation,
  useUpdateEndpointsMutation,
} from "../state/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint: Endpoint;
}

const UpdateModal = ({ open, onOpenChange, endpoint }: AddModalProps) => {
  const [signingSecret, setSigningSecret] = useState("");
  useEffect(() => {setSigningSecret??""}, [endpoint]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateEndpoint] = useUpdateEndpointsMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateEndpoint({
        id: endpoint.id,
        signingSecret: signingSecret.trim() || null,
      }).unwrap();
      toast.success("Endpoint updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update endpoint");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-full">
        <DialogHeader>
          <DialogTitle>Edit Endpoint</DialogTitle>
          <DialogDescription>
            Update the signing secret for <strong>{endpoint.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-[15px]">
              Signing Secret{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <input
              placeholder="whsec_... or your secret"
              value={signingSecret}
              onChange={(e) => setSigningSecret(e.target.value)}
              disabled={isLoading}
              className="w-full p-2 rounded-md focus:outline-none focus:ring-2 border border-neutral-200 bg-neutral-200/20 focus:ring-zinc-200 dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-zinc-800 dark:bg-neutral-800/20 dark:border dark:border-neutral-600"
            />
            <p className="text-xs text-muted-foreground">
              For Stripe: copy the signing secret from your Stripe webhook
              dashboard and paste it here.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateModal;
