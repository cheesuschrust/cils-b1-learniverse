
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-600",
        citizenship:
          "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-600",
        green:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        blue:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "h-6 px-2.5 py-0.5 text-xs",
        sm: "h-5 px-1.5 py-0 text-xs",
        lg: "h-7 px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  size?: "default" | "sm" | "lg";
}

function Badge({
  className,
  variant,
  size,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
