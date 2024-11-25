import { CopyIcon } from "@radix-ui/react-icons";
import { type FC } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

interface Props {
  additionalClasses?: string;
  toCopy: string;
  text: string;
  textArea?: boolean;
}

export const CopyableText: FC<Props> = ({
  additionalClasses,
  toCopy,
  textArea = false,
  text,
}) => {
  const handleCopy = () => {
    try {
      void navigator.clipboard.writeText(toCopy);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className={`flex w-full ${additionalClasses}`}>
      <div
        onClick={handleCopy}
        style={{ cursor: "pointer", userSelect: "none" }}
        className="flex w-full flex-row gap-2 justify-end items-center"
      >
        <CopyIcon />
        {textArea ? (
          <Textarea className="text-sm flex-grow" value={text} readOnly />
        ) : (
          <span className="relative inline-block font-mono">{text}</span>
        )}
      </div>
    </div>
  );
};
