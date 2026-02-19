"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  classname?: string;
}
const CopyButton = ({ text, classname }: CopyButtonProps) => {
  
  const [copied, setCopied] = useState(false);

  const handlecopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");

    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={classname}
          onClick={handlecopy}
        >
          {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black">
        {copied ? "Copied!" : "Copy to clipboard"}
      </TooltipContent>
    </Tooltip>
  );
};

export default CopyButton;
