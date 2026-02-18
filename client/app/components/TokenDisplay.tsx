import { useState } from "react";
import CopyButton from "./CopyButton";
import HideButton from "./HideButton";

const TokenDisplay = ({ token }: { token: string }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex justify-between items-center gap-4">
      <span className="tracking-tight">{visible ? token : "*******"}</span>
      <div className="flex gap-2">
        <CopyButton
          text={token}
          classname="rounded-2xl   hover:bg-neutral-300 cursor-pointer border border-neutral-300 dark:border dark:border-neutral-700 dark:hover:bg-neutral-800"
        />
        <HideButton
          visible={visible}
          onToggle={() => setVisible(!visible)}
          classname="rounded-2xl hover:bg-neutral-300 cursor-pointer border border-neutral-300 dark:border dark:border-neutral-700 dark:hover:bg-neutral-800"
        />
      </div>
    </div>
  );
};

export default TokenDisplay;
