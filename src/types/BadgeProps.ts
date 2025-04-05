
import React from 'react';
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge-fixed";

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}
