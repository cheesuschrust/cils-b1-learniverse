
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner = ({
  size = "md", 
  className
}: SpinnerProps) => {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-8 w-8";
      case "md":
      default:
        return "h-6 w-6";
    }
  };

  return (
    <Loader2 className={cn(
      "animate-spin text-primary",
      getSizeClass(),
      className
    )} />
  );
};
