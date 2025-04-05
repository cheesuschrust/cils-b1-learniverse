
import React from 'react';
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "citizenship" | "green" | "blue";
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
  size?: "default" | "sm" | "lg";
}
