import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface HideButtonProps {
  visible: boolean;
  onToggle: () => void;
  classname?: string;
}

const HideButton = ({ visible, onToggle, classname }: HideButtonProps) => {
  return (
    <Button variant="ghost" size="icon-sm" className={classname} onClick={onToggle}>
      {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
    </Button>
  );
};

export default HideButton;
