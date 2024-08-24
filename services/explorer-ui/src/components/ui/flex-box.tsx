import * as React from "react";
import { cn } from "~/lib/utils";

const FlexBox = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("box-border flex", className)}
    {...props}
  />
));
FlexBox.displayName = "FlexBox";

export { FlexBox };
