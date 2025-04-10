
import React from 'react';
import { Helmet, HelmetProvider as OriginalHelmetProvider } from 'react-helmet-async';

// Create a wrapper component for HelmetProvider
export const HelmetWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <OriginalHelmetProvider context={{}}>{children}</OriginalHelmetProvider>;
};

// Create a wrapper component for Helmet
export const CustomHelmet: React.FC<any> = (props) => {
  return <Helmet {...props} />;
};
