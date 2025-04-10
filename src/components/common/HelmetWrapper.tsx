
import React from 'react';
import { Helmet as ReactHelmet, HelmetProvider as OriginalHelmetProvider } from 'react-helmet-async';

// Create a wrapper component for HelmetProvider
export const HelmetWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <OriginalHelmetProvider context={{}}>{children}</OriginalHelmetProvider>;
};

// Create a wrapper component for Helmet that works with JSX
export const CustomHelmet: React.FC<any> = (props) => {
  return <ReactHelmet {...props} />;
};

// Export Helmet directly for usage in components
export const Helmet = ReactHelmet;
