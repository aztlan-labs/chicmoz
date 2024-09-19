import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        success:
          "border-transparent bg-green text-white shadow hover:bg-green/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div></div>
   // <div className={cn(badgeVariants({ variant }), className)} {...props}>
   //   {variant === "success" && (
   //     <svg
   //       className="h-3 w-3 text-white"
   //       width="24"
   //       height="24"
   //       viewBox="0 0 24 24"
   //       stroke-width="2"
   //       stroke="currentColor"
   //       fill="none"
   //       stroke-linecap="round"
   //       stroke-linejoin="round"
   //     >
   //       <path stroke="none" d="M0 0h24v24H0z" /> <path d="M5 12l5 5l10 -10" />
   //     </svg>
   //   )}{" "}
   //   {props.children}
   // </div>
  );
}

export { Badge, badgeVariants };
