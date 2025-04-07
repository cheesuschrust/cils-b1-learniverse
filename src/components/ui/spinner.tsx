
import React from "react";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * Whether to show the spinner with a transparent background
   * @default false
   */
  transparent?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8"
};

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = "md",
  transparent = false,
  ...props
}) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        transparent ? "opacity-70" : ""
      )} />
    </div>
  );
};

export default Spinner;
