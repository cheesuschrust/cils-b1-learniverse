
import React from 'react';

declare module 'react-helmet-async' {
  // Properly define the Helmet component to work correctly with JSX
  export const Helmet: React.ComponentType<React.PropsWithChildren<any>>;
  export const HelmetProvider: React.ComponentType<React.PropsWithChildren<any>>;
}
