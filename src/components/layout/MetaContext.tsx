
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface MetaContextType {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCanonicalUrl: (url: string) => void;
  setMeta: (name: string, content: string) => void;
}

const MetaContext = createContext<MetaContextType>({
  setTitle: () => {},
  setDescription: () => {},
  setCanonicalUrl: () => {},
  setMeta: () => {},
});

interface MetaProviderProps {
  children: ReactNode;
  defaultTitle?: string;
  defaultDescription?: string;
  siteName?: string;
}

export function MetaProvider({
  children,
  defaultTitle = 'CILS Italian Citizenship Test Prep',
  defaultDescription = 'Prepare for the Italian citizenship test with comprehensive study resources and practice questions.',
  siteName = 'CILS B1 Learniverse'
}: MetaProviderProps) {
  const [title, setTitle] = useState<string>(defaultTitle);
  const [description, setDescription] = useState<string>(defaultDescription);
  const [canonicalUrl, setCanonicalUrl] = useState<string>('');
  const [metaTags, setMetaTags] = useState<Record<string, string>>({});
  
  const value = {
    setTitle: (newTitle: string) => setTitle(newTitle ? `${newTitle} | ${siteName}` : defaultTitle),
    setDescription,
    setCanonicalUrl,
    setMeta: (name: string, content: string) => {
      setMetaTags(prev => ({ ...prev, [name]: content }));
    },
  };
  
  return (
    <MetaContext.Provider value={value}>
      <HelmetProvider>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          
          {/* Open Graph Tags */}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
          
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          
          {/* Canonical URL */}
          {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
          
          {/* Dynamic Meta Tags */}
          {Object.entries(metaTags).map(([name, content]) => (
            <meta key={name} name={name} content={content} />
          ))}
        </Helmet>
        
        {children}
      </HelmetProvider>
    </MetaContext.Provider>
  );
}

export function useMeta() {
  return useContext(MetaContext);
}
