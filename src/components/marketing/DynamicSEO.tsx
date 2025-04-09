
import React, { useEffect } from 'react';
import { useMeta } from '@/components/layout/MetaContext';

interface DynamicSEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  keywords?: string;
  type?: 'website' | 'article';
}

/**
 * DynamicSEO - A component that dynamically updates meta tags using the MetaContext
 * This allows for more dynamic SEO management compared to the static SEO component
 */
const DynamicSEO: React.FC<DynamicSEOProps> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  type = 'website'
}) => {
  const { setTitle, setDescription, setCanonicalUrl, setMeta } = useMeta();
  
  useEffect(() => {
    // Update meta information when props change
    setTitle(title);
    setDescription(description);
    
    if (canonicalUrl) {
      setCanonicalUrl(canonicalUrl);
    }
    
    if (keywords) {
      setMeta('keywords', keywords);
    }
    
    setMeta('og:type', type);
    
    // Clean up function to reset meta tags when component unmounts
    return () => {
      // Reset is handled by MetaContext defaults
    };
  }, [title, description, canonicalUrl, keywords, type, setTitle, setDescription, setCanonicalUrl, setMeta]);
  
  // This component doesn't render anything visible
  return null;
};

export default DynamicSEO;
