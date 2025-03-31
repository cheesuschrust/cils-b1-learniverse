
import React, { useEffect, useState } from 'react';
import useSitemap, { SitemapEntry } from '@/hooks/useSitemap';

interface SitemapGeneratorProps {
  baseUrl: string;
  pages: Array<{
    path: string;
    priority?: number;
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    images?: Array<{
      url: string;
      caption?: string;
      title?: string;
    }>;
  }>;
  onGenerated?: (xml: string) => void;
  autoSubmit?: boolean;
}

/**
 * Component for generating and optionally submitting sitemaps
 */
const SitemapGenerator: React.FC<SitemapGeneratorProps> = ({
  baseUrl,
  pages,
  onGenerated,
  autoSubmit = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { 
    addEntry, 
    generateSitemapXML, 
    submitToSearchEngines,
    updateSitemapConfig
  } = useSitemap();
  
  useEffect(() => {
    // Update sitemap config with baseUrl
    updateSitemapConfig({
      baseUrl
    });
  }, [baseUrl, updateSitemapConfig]);
  
  useEffect(() => {
    // Add all pages to the sitemap
    pages.forEach(page => {
      addEntry({
        url: page.path.startsWith('http') ? page.path : `${baseUrl}${page.path}`,
        priority: page.priority || 0.7,
        changeFrequency: page.changeFrequency || 'weekly',
        lastModified: new Date(),
        images: page.images
      });
    });
  }, [pages, addEntry, baseUrl]);
  
  // Generate sitemap XML
  const generateSitemap = () => {
    setIsGenerating(true);
    
    try {
      const xml = generateSitemapXML();
      setLastGenerated(new Date().toISOString());
      
      if (onGenerated) {
        onGenerated(xml);
      }
      
      // Auto-submit if enabled
      if (autoSubmit) {
        handleSubmit();
      }
      
      return xml;
    } catch (error) {
      console.error('Error generating sitemap:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Submit sitemap to search engines
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const success = await submitToSearchEngines();
      setSubmitStatus(success ? 'success' : 'error');
    } catch (error) {
      console.error('Error submitting sitemap:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="sitemap-generator">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Sitemap Generator</h2>
          {lastGenerated && (
            <p className="text-sm text-muted-foreground">
              Last generated: {new Date(lastGenerated).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={generateSitemap}
            className="px-4 py-2 bg-primary text-white rounded-md"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Sitemap'}
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-secondary text-white rounded-md"
            disabled={isSubmitting || !lastGenerated}
          >
            {isSubmitting ? 'Submitting...' : 'Submit to Search Engines'}
          </button>
        </div>
      </div>
      
      {submitStatus === 'success' && (
        <div className="p-3 bg-green-100 text-green-800 rounded-md mb-4">
          Sitemap successfully submitted to search engines
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md mb-4">
          Error submitting sitemap to search engines
        </div>
      )}
      
      <div className="overflow-auto max-h-60 border rounded-md p-4">
        <h3 className="font-medium mb-2">Pages in Sitemap ({pages.length})</h3>
        <ul className="space-y-1">
          {pages.map(page => (
            <li key={page.path} className="text-sm flex justify-between">
              <span>{page.path}</span>
              <span className="text-muted-foreground">
                Priority: {page.priority || 0.7}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SitemapGenerator;
