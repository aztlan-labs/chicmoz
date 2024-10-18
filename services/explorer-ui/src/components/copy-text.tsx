import { CopyIcon } from "@radix-ui/react-icons";
import { type FC } from "react";
import { toast } from "sonner";

interface Props {
  toCopy: string;
  text: string;
}

export const CopyableText: FC<Props> = ({ toCopy, text }) => {
  const handleCopy = () => {
    try {
      void navigator.clipboard.writeText(toCopy);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="flex flex-row items-center w-full gap-2 md:justify-end md:text-end">
      <CopyIcon />
      <span
        onClick={handleCopy}
        style={{ cursor: "pointer", userSelect: "none" }}
        className="relative inline-block"
      >
        {text}
      </span>
    </div>
  );
};
