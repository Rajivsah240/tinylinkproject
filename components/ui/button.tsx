import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 text-white shadow-lg shadow-zinc-950/50 hover:from-zinc-800 hover:via-zinc-700 hover:to-zinc-600 border border-zinc-700",
        secondary:
          "bg-zinc-900/60 text-white border border-zinc-700 hover:bg-zinc-800/80 shadow shadow-zinc-950/30",
        outline:
          "border border-zinc-700 bg-transparent text-white hover:bg-zinc-900/70",
        ghost: "text-white hover:bg-zinc-900/70",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 border border-red-500 shadow-lg shadow-red-950/30",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
