
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
  fill?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, max = 100, indicatorClassName, fill, ...props }, ref) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
        className
      )}
      {...props}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          indicatorClassName,
          {
            "bg-green-500": fill === "green" || fill === "success",
            "bg-red-500": fill === "red" || fill === "error",
            "bg-yellow-500": fill === "yellow" || fill === "warning",
            "bg-blue-500": fill === "blue" || fill === "info"
          }
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
