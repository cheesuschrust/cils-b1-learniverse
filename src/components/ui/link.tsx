
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const linkVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "text-primary hover:text-primary/80",
        destructive: "text-destructive hover:text-destructive/80",
        outline: "border border-input hover:border-primary hover:text-primary",
        secondary: "text-secondary-foreground hover:text-secondary-foreground/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        muted: "text-muted-foreground hover:text-foreground",
      },
      size: {
        default: "h-10 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, href, icon, iconPosition = "left", external = false, children, ...props }, ref) => {
    const linkContent = (
      <>
        {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
      </>
    );

    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkVariants({ variant, size, className }))}
          {...props}
        >
          {linkContent}
        </a>
      );
    }

    return (
      <RouterLink
        ref={ref}
        to={href}
        className={cn(linkVariants({ variant, size, className }))}
        {...props}
      >
        {linkContent}
      </RouterLink>
    );
  }
);

Link.displayName = "Link";

export { Link, linkVariants };
