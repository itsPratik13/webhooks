"use client";

import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
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
import { useAddEndpointsMutation } from "../state/api";

interface AddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const schema = z.object({
  name: z
    .string()
    .min(1, "Endpoint name is required")
    .max(100, "Endpoint name must be less than 100 characters"),
});

const AddModal = ({ open, onOpenChange }: AddModalProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newEndpoint] = useAddEndpointsMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const validatedName = schema.safeParse({ name: name.trim() });
    if (!validatedName.success) {
      const errorMessage = validatedName.error.issues[0].message;
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await newEndpoint(validatedName.data.name).unwrap();
      toast.success("Endpoint created successfully!");
      setName("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create endpoint. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-full">
        <DialogHeader className="">
          <DialogTitle className="">Create Webhook Endpoint</DialogTitle>
          <DialogDescription className="">
            Generate a unique URL to receive POST requests.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label htmlFor="name" className="gap-2 text-[15px]">
              Endpoint Name *
            </Label>
            <input
              id="name"
              name="name"
              placeholder="My GitHub Webhook"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              maxLength={100}
              autoFocus
              className="w-full  mx-auto p-2 rounded-md focus:outline-none focus:ring-2 border border-neutral-200 bg-neutral-200/20 focus:ring-zinc-200 dark:focus:outline-none dark:focus:ring-2  dark:focus:ring-zinc-800 dark:bg-neutral-800/20 dark:border dark:border-neutral-600"
            />
           
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
              {isLoading ? "Creating..." : "Create Endpoint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
