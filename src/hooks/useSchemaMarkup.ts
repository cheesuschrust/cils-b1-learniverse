
import { useCallback } from 'react';

export interface SchemaMarkupProps {
  type: string;
  data: Record<string, any>;
}

type SchemaType = 
  | 'Course' 
  | 'Article' 
  | 'FAQPage' 
  | 'LearningResource'
  | 'EducationalOrganization'
  | 'Review'
  | 'Person'
  | 'WebPage'
  | 'BreadcrumbList'
  | 'ItemList'
  | 'Question'
  | 'Organization';

export interface UseSchemaMarkupReturn {
  generateOrganizationSchema: (data: Record<string, any>) => string;
  generateCourseSchema: (data: Record<string, any>) => string;
  generateArticleSchema: (data: Record<string, any>) => string;
  generateFAQSchema: (questions: Array<{question: string, answer: string}>) => string;
  generateBreadcrumbSchema: (items: Array<{name: string, url: string}>) => string;
  generateCustomSchema: (type: SchemaType, data: Record<string, any>) => string;
  renderSchemaMarkup: (schemas: Array<{type: SchemaType, data: Record<string, any>}>) => string;
}

/**
 * Hook for generating structured data for SEO
 */
export function useSchemaMarkup(): UseSchemaMarkupReturn {
  // Generate Organization schema markup
  const generateOrganizationSchema = useCallback((data: Record<string, any>): string => {
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': data.name || 'Italian Language Learning Platform',
      'url': data.url || window.location.origin,
      'logo': data.logo || `${window.location.origin}/logo.png`,
      'sameAs': data.socialLinks || []
    };
    
    if (data.address) {
      orgSchema['address'] = {
        '@type': 'PostalAddress',
        ...data.address
      };
    }
    
    if (data.contactPoint) {
      orgSchema['contactPoint'] = {
        '@type': 'ContactPoint',
        ...data.contactPoint
      };
    }
    
    return JSON.stringify(orgSchema);
  }, []);
  
  // Generate Course schema markup
  const generateCourseSchema = useCallback((data: Record<string, any>): string => {
    const courseSchema = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': data.name || 'Italian Language Course',
      'description': data.description || 'Learn Italian language with our comprehensive course',
      'provider': {
        '@type': 'Organization',
        'name': data.providerName || 'Italian Language Learning Platform',
        'sameAs': data.providerUrl || window.location.origin
      }
    };
    
    if (data.courseCode) courseSchema['courseCode'] = data.courseCode;
    if (data.hasCourseInstance) courseSchema['hasCourseInstance'] = data.hasCourseInstance;
    if (data.offers) courseSchema['offers'] = data.offers;
    
    return JSON.stringify(courseSchema);
  }, []);
  
  // Generate Article schema markup
  const generateArticleSchema = useCallback((data: Record<string, any>): string => {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': data.headline || data.title || 'Italian Language Article',
      'description': data.description || '',
      'image': data.image || [],
      'datePublished': data.datePublished || new Date().toISOString(),
      'dateModified': data.dateModified || new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': data.authorName || 'Italian Learning Expert',
        'url': data.authorUrl || ''
      },
      'publisher': {
        '@type': 'Organization',
        'name': data.publisherName || 'Italian Language Learning Platform',
        'logo': {
          '@type': 'ImageObject',
          'url': data.publisherLogo || `${window.location.origin}/logo.png`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': data.url || window.location.href
      }
    };
    
    return JSON.stringify(articleSchema);
  }, []);
  
  // Generate FAQ schema markup
  const generateFAQSchema = useCallback((questions: Array<{question: string, answer: string}>): string => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': questions.map(q => ({
        '@type': 'Question',
        'name': q.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': q.answer
        }
      }))
    };
    
    return JSON.stringify(faqSchema);
  }, []);
  
  // Generate Breadcrumb schema markup
  const generateBreadcrumbSchema = useCallback((items: Array<{name: string, url: string}>): string => {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    };
    
    return JSON.stringify(breadcrumbSchema);
  }, []);
  
  // Generate custom schema markup based on type
  const generateCustomSchema = useCallback((type: SchemaType, data: Record<string, any>): string => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };
    
    return JSON.stringify(schema);
  }, []);
  
  // Combine multiple schema markup objects
  const renderSchemaMarkup = useCallback((schemas: Array<{type: SchemaType, data: Record<string, any>}>): string => {
    if (schemas.length === 0) return '';
    
    if (schemas.length === 1) {
      return generateCustomSchema(schemas[0].type, schemas[0].data);
    }
    
    // Combine multiple schema objects into a single script
    const scriptContent = schemas.map(schema => {
      return {
        '@context': 'https://schema.org',
        '@type': schema.type,
        ...schema.data
      };
    });
    
    return JSON.stringify(scriptContent);
  }, [generateCustomSchema]);
  
  return {
    generateOrganizationSchema,
    generateCourseSchema,
    generateArticleSchema,
    generateFAQSchema,
    generateBreadcrumbSchema,
    generateCustomSchema,
    renderSchemaMarkup
  };
}

export default useSchemaMarkup;
