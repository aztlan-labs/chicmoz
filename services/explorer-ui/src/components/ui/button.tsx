import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { type ButtonHTMLAttributes, type FC, forwardRef } from "react";
import { FlexBox } from "~/components/ui";
import { cn } from "~/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "text" | "link" | "dropdown" | "icon";
type ButtonSize = "lg" | "sm" | "mobile";
type ArrowDirection = "left" | "right" | "up" | "down" | "none";

type VariantClasses = {
  [key in ButtonVariant]: string;
};

type SizeClasses = {
  [key in ButtonSize]: string;
};

const variantOptions: VariantClasses = {
  primary: "bg-primary drop-shadow-md text-primary-foreground enabled:hover:bg-pink ",
  secondary: "bg-primary inline-flex px-3 drop-shadow-md enabled:hover:bg-pink",
  tertiary: "bg-primary inline-flex px-3 drop-shadow-md enabled:hover:bg-pink",
  destructive: "bg-red inline-flex px-3 drop-shadow-md",
  dropdown: "",
  link: "",
  text: "",
  icon: "uppercase group",
};

const arrowDirectionOptions: {
  [key in ArrowDirection]: string;
} = {
  left: "transform rotate-180",
  right: "transform rotate-0",
  up: "transform rotate-90",
  down: "transform rotate-270",
  none: "",
};

const sizeOptions: SizeClasses = {
  lg: "h-9 font-normal",
  sm: "h-8",
  mobile: "h-8",
};

const buttonVariants = cva(
  "pointer-events-auto cursor-pointer whitespace-nowrap rounded-[5px] transition-colors " +
  "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: variantOptions,
      arrowDirection: arrowDirectionOptions,
      size: sizeOptions,
    },
    defaultVariants: {
      variant: "secondary",
      size: "lg",
      arrowDirection: "none",
    },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
  dark?: boolean;
  arrowDirection?: ArrowDirection;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, loading, asChild = false, children, ...props }, ref) => {
  const Component = asChild ? Slot : "button";
  const renderButtonVariant = () => {
    switch (variant) {
      case "primary":
        return <Primary loading={loading}>{children}</Primary>;
      case "secondary":
        return <Secondary loading={loading}>{children}</Secondary>;
      case "tertiary":
        return <Tertiary loading={loading}>{children}</Tertiary>;
      case "destructive":
        return <Destructive loading={loading}>{children}</Destructive>;
      case "dropdown":
        return <Dropdown loading={loading}>{children}</Dropdown>;
      case "link":
        return <Link loading={loading}>{children}</Link>;
      case "text":
        return (
          <Text
            className={className}
            loading={loading}
          >
            {children}
          </Text>
        );
      case "icon":
        return <Icon loading={loading}>{children}</Icon>;
    }
  };

  return (
    <Component
      className={cn(buttonVariants({ variant, className }))}
      ref={ref}
      {...props}
    >
      {renderButtonVariant()}
    </Component>
  );
});
Button.displayName = "Button";

interface SubProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  arrowDirection?: ArrowDirection;
}
const Primary: FC<SubProps> = ({ children, loading }) => {
  return (
    <FlexBox className="group w-full flex-row items-center justify-center">
      <FlexBox
        className="h-9 w-9 items-center justify-center  rounded shadow-md"
        style={{ boxShadow: "5px 0px 10px -2px rgba(0, 0, 0, 0.25)" }}
      >
        <div className="duration-200 lg:group-hover:translate-x-1">
          {loading && (
            <Loader2 className="h-6 w-6 animate-spin stroke-black" />
          )}
        </div>
      </FlexBox>
      <FlexBox
        className="primary-button h-full flex-1 items-center justify-center px-4 pt-1 text-center uppercase
      leading-none text-black"
      >
        {children}
      </FlexBox>
    </FlexBox>
  );
};

const Secondary: FC<SubProps> = ({ children, loading }) => {
  return (
    <FlexBox className="w-full flex-row items-center justify-center gap-2">
      {loading && (
        <FlexBox className="h-full w-[20px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin stroke-black transition" />
        </FlexBox>
      )}
      <FlexBox className="secondary-button flex-1 items-center justify-center pt-2 text-black">{children}</FlexBox>
    </FlexBox>
  );
};

const Tertiary: FC<SubProps> = ({ children, loading }) => {
  return (
    <FlexBox className="w-full flex-row items-center justify-center gap-2">
      {loading && (
        <FlexBox className="h-full w-[20px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin stroke-black transition" />
        </FlexBox>
      )}
      <FlexBox className="secondary-button flex-1 items-center justify-center pt-1 text-black">{children}</FlexBox>
    </FlexBox>
  );
};


const Destructive: FC<SubProps> = ({ children, loading }) => {
  return (
    <FlexBox className="w-full flex-row items-center justify-center gap-2">
      {loading && (
        <FlexBox className="h-full w-[20px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin stroke-black transition" />
        </FlexBox>
      )}
      <FlexBox className="secondary-button flex-1 items-center justify-center pt-2 text-black">{children}</FlexBox>
    </FlexBox>
  );
};
const Dropdown: FC<SubProps> = ({ children, loading }) => {
  return (
    <FlexBox className="w-full flex-row items-center justify-center gap-2">
      {loading && (
        <FlexBox className="h-full w-[20px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin stroke-black transition" />
        </FlexBox>
      )}
      <FlexBox className="secondary-button flex-1 items-center justify-center pt-1 text-black">{children}</FlexBox>
    </FlexBox>
  );
};

const Link: FC<SubProps> = ({ children }) => {
  return (
    <FlexBox className="group w-full flex-row items-center justify-center mix-blend-difference">
      <FlexBox className="h-full w-6 items-center justify-center transition duration-200 lg:group-hover:translate-x-1 ">
      </FlexBox>
      <FlexBox
        className="link h-full w-full flex-1 items-center justify-start pt-1 text-left uppercase
       text-white lg:group-hover:text-pink"
      >
        {children}
      </FlexBox>
    </FlexBox>
  );
};

const Text: FC<SubProps> = ({ children, className }) => {
  return (
    <div className={cn(" flex h-full w-full items-center justify-center text-center uppercase text-white hover:text-pink", className)}>
      {children}
    </div>
  );
};

const Icon: FC<SubProps> = ({ children }) => {
  return <FlexBox className=" h-full w-full flex-col items-center justify-center text-base">{children}</FlexBox>;
};

export { Button, buttonVariants };
