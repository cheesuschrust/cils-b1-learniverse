
// Allow SVG imports
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Allow image imports
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.webp";

// Fix badge component type issues
declare module "@/components/ui/badge" {
  import { VariantProps } from "class-variance-authority";
  
  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof badgeVariants> {
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
}

// JSX declarations
declare namespace React {
  interface PropsWithChildren<P> {
    children?: React.ReactNode;
  }
}

// Fix environment variables
interface ImportMeta {
  env: {
    [key: string]: string | undefined;
    MODE: string;
    BASE_URL: string;
    PROD: boolean;
    DEV: boolean;
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
  };
}

// Add process variable for cross-compatibility
declare var process: {
  env: {
    [key: string]: string | undefined;
    NODE_ENV: 'development' | 'production' | 'test';
  };
};
