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
  provider: z.enum(["stripe", "github", "razorpay"]),
  signinSecret: z.string().optional(),
});

const AddModal = ({ open, onOpenChange }: AddModalProps) => {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<
    "stripe" | "github" | "razorpay" | ""
  >("");
  const [isLoading, setIsLoading] = useState(false);
  const [signinSecret, setSigningSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [newEndpoint] = useAddEndpointsMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const validated = schema.safeParse({
      name: name.trim(),
      provider,
      signinSecret: signinSecret.trim() || undefined,
    });

    if (!validated.success) {
      const errorMessage = validated.error.issues[0].message;
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await newEndpoint({
        name: validated.data.name,
        provider: validated.data.provider,
        signingSecret: validated.data.signinSecret,
      }).unwrap();
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
            <Label htmlFor="name" className="gap-2 text-[15px]">
              Provider Name *
            </Label>
            <select
              value={provider}
              onChange={(e) =>
                setProvider(
                  e.target.value as "stripe" | "github" | "razorpay" | ""
                )
              }
              disabled={isLoading}
              className="w-full p-2 rounded-md border  border-neutral-200 bg-neutral-200/20 dark:bg-neutral-800/20 dark:border-neutral-600 "
            >
              <option value="" className="text-muted-foreground">
                Select Provider
              </option>
              <option value="github">GitHub</option>
              <option value="stripe">Stripe</option>
              <option value="razorpay">Razorpay</option>
            </select>
            <Label htmlFor="name" className="gap-2 text-[15px]">
              Signing Secret
            </Label>
            <input
              id="signingSecret"
              name="signingSecret"
              placeholder="Signing Secret"
              value={name}
              onChange={(e) => setSigningSecret(e.target.value)}
              disabled={isLoading}
              maxLength={100}
              autoFocus
              className="w-full  mx-auto p-2 rounded-md focus:outline-none focus:ring-2 border 
border-neutral-200 bg-neutral-200/20 focus:ring-zinc-200 dark:focus:outline-none 
dark:focus:ring-2  dark:focus:ring-zinc-800 dark:bg-neutral-800/20 dark:border 
dark:border-neutral-600"
            />
            <p className="text-xs text-muted-foreground -mt-2">
              Used to cryptographically verify incoming webhook signatures.
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
              {isLoading ? "Creating..." : "Create Endpoint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
