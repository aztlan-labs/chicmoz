import * as React from "react";
import { SearchIcon } from "~/assets";

import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className="flex items-center  pl-3 w-fit bg-white rounded-md border-input focus-visible:ring-1 focus-visible:ring-ring"
        {...props}
      >
        <SearchIcon className="h-4 w-4" />
        <input
          type={type}
          className={cn(
            "flex h-9 rounded-md bg-transparent px-3 py-1 text-sm w-full transition-colors focus-visible:outline-none  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          placeholder="Search"
          ref={ref}
        />
      </div>
    );
  },
);
export { Input, SearchInput };
