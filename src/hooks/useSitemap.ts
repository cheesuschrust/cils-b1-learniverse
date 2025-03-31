
import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

export interface SitemapEntry {
  url: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastModified: Date;
  images?: Array<{
    url: string;
    caption?: string;
    title?: string;
  }>;
}

export interface SitemapConfig {
  baseUrl: string;
  defaultPriority: number;
  defaultChangeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  excludePaths: string[];
  includeImages: boolean;
}

export interface UseSitemapReturn {
  entries: SitemapEntry[];
  addEntry: (entry: Partial<SitemapEntry>) => void;
  removeEntry: (url: string) => void;
  updateEntry: (url: string, updates: Partial<SitemapEntry>) => void;
  generateSitemapXML: () => string;
  sitemapConfig: SitemapConfig;
  updateSitemapConfig: (config: Partial<SitemapConfig>) => void;
  scheduleSitemapGeneration: (cron: string) => void;
  submitToSearchEngines: () => Promise<boolean>;
}

/**
 * Hook for managing sitemap generation and submission
 */
export function useSitemap(initialConfig?: Partial<SitemapConfig>): UseSitemapReturn {
  const location = useLocation();
  
  // Default configuration
  const defaultConfig: SitemapConfig = {
    baseUrl: window.location.origin,
    defaultPriority: 0.7,
    defaultChangeFrequency: "weekly",
    excludePaths: ['/admin/*', '/api/*', '/login', '/signup', '/reset-password'],
    includeImages: true
  };
  
  const [sitemapConfig, setSitemapConfig] = useState<SitemapConfig>({
    ...defaultConfig,
    ...initialConfig
  });
  
  const [entries, setEntries] = useState<SitemapEntry[]>([]);
  
  // Add a new sitemap entry
  const addEntry = useCallback((entry: Partial<SitemapEntry>) => {
    if (!entry.url) {
      console.error("Cannot add sitemap entry without a URL");
      return;
    }
    
    const newEntry: SitemapEntry = {
      url: entry.url,
      priority: entry.priority ?? sitemapConfig.defaultPriority,
      changeFrequency: entry.changeFrequency ?? sitemapConfig.defaultChangeFrequency,
      lastModified: entry.lastModified ?? new Date(),
      images: entry.images ?? []
    };
    
    setEntries(prev => {
      // Avoid duplicates
      const filtered = prev.filter(e => e.url !== entry.url);
      return [...filtered, newEntry];
    });
  }, [sitemapConfig]);
  
  // Remove an entry by URL
  const removeEntry = useCallback((url: string) => {
    setEntries(prev => prev.filter(entry => entry.url !== url));
  }, []);
  
  // Update an existing entry
  const updateEntry = useCallback((url: string, updates: Partial<SitemapEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.url === url 
          ? { ...entry, ...updates } 
          : entry
      )
    );
  }, []);
  
  // Update sitemap config
  const updateSitemapConfig = useCallback((config: Partial<SitemapConfig>) => {
    setSitemapConfig(prev => ({
      ...prev,
      ...config
    }));
  }, []);
  
  // Generate sitemap XML
  const generateSitemapXML = useCallback((): string => {
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
    ];
    
    entries.forEach(entry => {
      xml.push('  <url>');
      xml.push(`    <loc>${entry.url.startsWith('http') ? entry.url : sitemapConfig.baseUrl + entry.url}</loc>`);
      xml.push(`    <lastmod>${entry.lastModified.toISOString()}</lastmod>`);
      xml.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
      xml.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      
      // Add image extensions if available and enabled
      if (sitemapConfig.includeImages && entry.images && entry.images.length > 0) {
        entry.images.forEach(image => {
          xml.push('    <image:image>');
          xml.push(`      <image:loc>${image.url.startsWith('http') ? image.url : sitemapConfig.baseUrl + image.url}</image:loc>`);
          if (image.title) {
            xml.push(`      <image:title>${image.title}</image:title>`);
          }
          if (image.caption) {
            xml.push(`      <image:caption>${image.caption}</image:caption>`);
          }
          xml.push('    </image:image>');
        });
      }
      
      xml.push('  </url>');
    });
    
    xml.push('</urlset>');
    return xml.join('\n');
  }, [entries, sitemapConfig]);
  
  // Schedule sitemap generation (simplified version)
  const scheduleSitemapGeneration = useCallback((cron: string) => {
    console.log(`Scheduled sitemap generation with cron pattern: ${cron}`);
    // In a real app, this would set up a cron job or scheduling
  }, []);
  
  // Submit sitemap to search engines
  const submitToSearchEngines = useCallback(async (): Promise<boolean> => {
    try {
      const sitemap = `${sitemapConfig.baseUrl}/sitemap.xml`;
      
      // In a real app, these would be actual API calls
      console.log(`Submitting sitemap to Google: ${sitemap}`);
      console.log(`Submitting sitemap to Bing: ${sitemap}`);
      
      return true;
    } catch (error) {
      console.error("Error submitting sitemap to search engines:", error);
      return false;
    }
  }, [sitemapConfig.baseUrl]);
  
  return {
    entries,
    addEntry,
    removeEntry,
    updateEntry,
    generateSitemapXML,
    sitemapConfig,
    updateSitemapConfig,
    scheduleSitemapGeneration,
    submitToSearchEngines
  };
}

export default useSitemap;
