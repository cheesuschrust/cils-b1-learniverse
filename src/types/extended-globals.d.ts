
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

// Make Helmet work with TypeScript
declare module 'react-helmet-async' {
  export const Helmet: React.ComponentType<React.PropsWithChildren<any>>;
}

// Add missing device icon
declare module 'lucide-react' {
  export const Devices: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  export const Memory: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  export const PuzzlePiece: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  export const Save: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

// Add NavItem type
declare module '@/types' {
  export interface NavItem {
    title: string;
    href: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    external?: boolean;
    label?: string;
  }
}

// Add support for testing assertions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeDisabled(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | string[] | number | null): R;
      toBeChecked(): R;
      toHaveFocus(): R;
    }
  }
}

// For Cypress testing
declare namespace Cypress {
  interface Assertion {
    toBeInTheDocument(): Chainable<Element>;
    toHaveClass(className: string): Chainable<Element>;
    toHaveAttribute(attr: string, value?: string): Chainable<Element>;
  }
}
