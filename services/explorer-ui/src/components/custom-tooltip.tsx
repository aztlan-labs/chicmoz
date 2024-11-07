import React, { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

interface CustomTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CustomTooltip: FC<CustomTooltipProps> = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}) => {
  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" align="center" {...props}>
          {content}
          <TooltipArrow className="fill-primary" width={11} height={5} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
