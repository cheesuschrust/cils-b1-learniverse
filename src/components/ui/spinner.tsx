
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };
  
  return (
    <div className={cn("animate-spin rounded-full border-t-transparent", sizeClasses[size], className)}>
      <div className="h-full w-full rounded-full border-2 border-t-2 border-primary" />
    </div>
  );
};

export default Spinner;
