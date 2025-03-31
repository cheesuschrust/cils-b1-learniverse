
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageSEOProps } from '@/types/core-types';

/**
 * Component for adding SEO metadata to pages
 */
const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
  noIndex = false,
  children
}) => {
  // Default values
  const siteName = "Italian Language Learning Platform";
  const defaultImage = "/assets/og-default.jpg";
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={canonicalUrl || window.location.href} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={twitterImage || ogImage || defaultImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {typeof structuredData === 'string' ? structuredData : JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional head elements */}
      {children}
    </Helmet>
  );
};

export default PageSEO;
