
import * as React from 'react';
import { cva } from 'class-variance-authority';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "citizenship" | "green" | "blue";
  className?: string;
  key?: string | number;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  onClick?: () => any;
  asChild?: boolean;
}

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
        success: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
        citizenship: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100",
        green: "bg-green-500 text-white border-green-500",
        blue: "bg-blue-500 text-white border-blue-500"
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-base px-3 py-1"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
