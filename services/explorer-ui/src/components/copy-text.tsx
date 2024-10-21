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
    <div className="flex md:justify-end md:text-end w-full">
      <div
        onClick={handleCopy}
        style={{ cursor: "pointer", userSelect: "none" }}
        className="flex flex-row gap-2 w-fit"
      >
        <CopyIcon />
        <span className="relative inline-block">{text}</span>
      </div>
    </div>
  );
};
