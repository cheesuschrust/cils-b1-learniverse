
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  analyzeSEO, 
  getKeywordSuggestions, 
  PageMetadata,
  SEOScore 
} from '@/utils/seo';
import { ContentType } from '@/types/contentType';

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

export interface UseSEOReturn {
  setPageMetadata: (metadata: Partial<PageMetadata>) => void;
  analyzePageSEO: () => SEOScore;
  getSuggestedKeywords: (contentType: ContentType) => string[];
  generateStructuredData: (type: string, data: Record<string, any>) => string;
  renderSEOTags: (props: SEOProps) => JSX.Element;
  optimizeHeadings: (content: string, keywords: string[], level?: number) => string;
  pageMetadata: PageMetadata;
}

/**
 * Hook for managing SEO-related functionality
 */
export function useSEO(): UseSEOReturn {
  const location = useLocation();
  
  // Create default metadata based on current location
  const defaultMetadata: PageMetadata = useMemo(() => ({
    url: window.location.href,
    title: "Italian Language Learning",
    description: "Learn Italian with our comprehensive platform",
    keywords: ["learn italian", "italian language", "language learning"],
    h1Tags: [],
    h2Tags: [],
    imageCount: 0,
    wordCount: 0,
    contentType: 'multiple-choice',
    internalLinks: [],
    externalLinks: [],
    lastUpdated: new Date()
  }), [location]);
  
  const [pageMetadata, setPageMetadata] = useState<PageMetadata>(defaultMetadata);
  
  // Update page metadata
  const updatePageMetadata = useCallback((metadata: Partial<PageMetadata>) => {
    setPageMetadata(prev => ({
      ...prev,
      ...metadata,
      lastUpdated: new Date()
    }));
  }, []);
  
  // Analyze current page SEO
  const analyzePageSEO = useCallback((): SEOScore => {
    return analyzeSEO(pageMetadata);
  }, [pageMetadata]);
  
  // Get keyword suggestions for content type
  const getSuggestedKeywords = useCallback((contentType: ContentType): string[] => {
    return getKeywordSuggestions(contentType);
  }, []);
  
  // Generate structured data JSON-LD
  const generateStructuredData = useCallback((type: string, data: Record<string, any>): string => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };
    
    return JSON.stringify(structuredData);
  }, []);
  
  // Optimize headings with keywords
  const optimizeHeadings = useCallback((content: string, keywords: string[], level: number = 1): string => {
    // Simple implementation - in a real app, this would be more sophisticated
    if (!content || keywords.length === 0) return content;
    
    const keywordRegex = new RegExp(`(${keywords.join('|')})`, 'gi');
    return content.replace(keywordRegex, '<strong>$1</strong>');
  }, []);
  
  // Render SEO tags using Helmet
  const renderSEOTags = useCallback((props: SEOProps): JSX.Element => {
    const {
      title,
      description,
      keywords,
      canonicalUrl,
      ogImage,
      ogTitle,
      ogDescription,
      twitterTitle,
      twitterDescription,
      twitterImage,
      noIndex,
      structuredData
    } = props;
    
    const siteName = "Italian Language Learning Platform";
    const defaultImage = "/assets/og-default.jpg";
    
    return (
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
        
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
      </Helmet>
    );
  }, []);
  
  return {
    setPageMetadata: updatePageMetadata,
    analyzePageSEO,
    getSuggestedKeywords,
    generateStructuredData,
    renderSEOTags,
    optimizeHeadings,
    pageMetadata
  };
}

export default useSEO;
