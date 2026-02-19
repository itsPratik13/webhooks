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

interface AddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddModal = ({ open, onOpenChange }: AddModalProps) => {
    const[name,setName]=useState("");
    const [isLoading,setIsLoading]=useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Webhook Endpoint</DialogTitle>
          <DialogDescription>
            Generate a unique URL to receive POST requests.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Endpoint Name (optional)</Label>
            <Input
              id="name"
              name="name"
              placeholder="My GitHub Webhook"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Create Endpoint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
