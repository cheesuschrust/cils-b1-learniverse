
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
        {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg",
          "h-12 w-12": size === "xl",
        },
        "text-primary",
        className
      )}
      role="status"
      aria-label="loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
