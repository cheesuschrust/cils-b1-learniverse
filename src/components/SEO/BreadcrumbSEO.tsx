
import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbSEOProps {
  items: BreadcrumbItem[];
  currentPageName?: string;
}

/**
 * Component for adding breadcrumb structured data to pages
 */
const BreadcrumbSEO: React.FC<BreadcrumbSEOProps> = ({ items, currentPageName }) => {
  // Generate the breadcrumb list
  let breadcrumbItems = [...items];
  
  // Add current page if provided
  if (currentPageName) {
    breadcrumbItems.push({
      name: currentPageName,
      url: window.location.href
    });
  }
  
  // Create breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default BreadcrumbSEO;
