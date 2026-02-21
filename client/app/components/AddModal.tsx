"use client";

import React, { useState } from "react";
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

const AddModal = ({ open, onOpenChange }: AddModalProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newEndpoint]=useAddEndpointsMutation();
  const handleSubmit=async(e:React.SyntheticEvent)=>{
    e.preventDefault();
    setIsLoading(true);
    try {
      await newEndpoint(name.trim()).unwrap();
      setName("");
      onOpenChange(false);
      
    } catch (error) {
      console.error("Failed to create endpoint:", error);
      
    }finally{
      setIsLoading(false);
    }

  }
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
              Endpoint Name (optional)
            </Label>
            <input
              id="name"
              name="name"
              placeholder="My GitHub Webhook"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              maxLength={100}
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

            <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Endpoint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
