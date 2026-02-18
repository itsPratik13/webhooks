"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface HideButtonProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  classname?: string;
}
const HideButton = ({ visible, setVisible, classname }: HideButtonProps) => {
  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={classname}
      onClick={toggleVisibility}
    >
      {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
    </Button>
  );
};

export default HideButton;
