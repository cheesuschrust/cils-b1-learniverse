
import React, { useEffect } from 'react';
import { useMeta } from '@/components/layout/MetaContext';
import useStructuredData from '@/hooks/useStructuredData';

interface DynamicSEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  keywords?: string;
  type?: 'website' | 'article';
  structuredData?: object;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * DynamicSEO - A component that dynamically updates meta tags using the MetaContext
 * This allows for more dynamic SEO management compared to the static SEO component
 * and can also inject JSON-LD structured data
 */
const DynamicSEO: React.FC<DynamicSEOProps> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  type = 'website',
  structuredData,
  image,
  author,
  publishedTime,
  modifiedTime
}) => {
  const { setTitle, setDescription, setCanonicalUrl, setMeta } = useMeta();
  
  // Use the structured data hook if structured data is provided
  if (structuredData) {
    useStructuredData(structuredData);
  }
  
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
    
    if (image) {
      setMeta('og:image', image);
      setMeta('twitter:image', image);
    }
    
    if (author) {
      setMeta('author', author);
      if (type === 'article') {
        setMeta('article:author', author);
      }
    }
    
    if (publishedTime && type === 'article') {
      setMeta('article:published_time', publishedTime);
    }
    
    if (modifiedTime && type === 'article') {
      setMeta('article:modified_time', modifiedTime);
    }
    
    // Clean up function to reset meta tags when component unmounts
    return () => {
      // Reset is handled by MetaContext defaults
    };
  }, [title, description, canonicalUrl, keywords, type, image, author, publishedTime, modifiedTime, setTitle, setDescription, setCanonicalUrl, setMeta]);
  
  // This component doesn't render anything visible
  return null;
};

export default DynamicSEO;
