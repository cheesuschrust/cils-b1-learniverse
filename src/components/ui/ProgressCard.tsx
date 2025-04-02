
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const ProgressCard = ({
  title,
  value,
  maxValue,
  icon,
  color = "bg-primary",
  className,
  onClick,
}: ProgressCardProps) => {
  const percentage = Math.min(Math.round((value / maxValue) * 100), 100);

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground font-normal">
            {value}/{maxValue}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-full bg-accent/50">{icon}</div>
          <div className="w-full space-y-1">
            <div className="h-2 rounded-full bg-muted w-full">
              <div
                className={cn("h-full rounded-full", color)}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {percentage}% Complete
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
