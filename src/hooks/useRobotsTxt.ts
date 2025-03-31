
import { useCallback, useState } from 'react';

export interface RobotRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
}

export interface RobotsTxtConfig {
  rules: RobotRule[];
  sitemaps: string[];
  host?: string;
  comments?: string[];
}

export interface UseRobotsTxtReturn {
  config: RobotsTxtConfig;
  updateConfig: (config: Partial<RobotsTxtConfig>) => void;
  addRule: (rule: RobotRule) => void;
  removeRule: (userAgent: string) => void;
  updateRule: (userAgent: string, updates: Partial<RobotRule>) => void;
  addSitemap: (url: string) => void;
  removeSitemap: (url: string) => void;
  generateRobotsTxt: () => string;
}

/**
 * Hook for managing robots.txt configuration
 */
export function useRobotsTxt(initialConfig?: Partial<RobotsTxtConfig>): UseRobotsTxtReturn {
  // Default configuration
  const defaultConfig: RobotsTxtConfig = {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/admin/', '/api/', '/private/'],
        crawlDelay: 1
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/public/'],
        disallow: ['/admin/', '/api/']
      }
    ],
    sitemaps: [`${window.location.origin}/sitemap.xml`],
    host: window.location.origin,
    comments: ['Italian Language Learning Platform - Robots.txt Configuration']
  };
  
  const [config, setConfig] = useState<RobotsTxtConfig>({
    ...defaultConfig,
    ...initialConfig
  });
  
  // Update the entire config
  const updateConfig = useCallback((newConfig: Partial<RobotsTxtConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);
  
  // Add a new rule
  const addRule = useCallback((rule: RobotRule) => {
    setConfig(prev => {
      // Filter out any existing rule with the same user-agent
      const filteredRules = prev.rules.filter(r => r.userAgent !== rule.userAgent);
      return {
        ...prev,
        rules: [...filteredRules, rule]
      };
    });
  }, []);
  
  // Remove a rule by user-agent
  const removeRule = useCallback((userAgent: string) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.userAgent !== userAgent)
    }));
  }, []);
  
  // Update an existing rule
  const updateRule = useCallback((userAgent: string, updates: Partial<RobotRule>) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.map(rule => 
        rule.userAgent === userAgent 
          ? { ...rule, ...updates } 
          : rule
      )
    }));
  }, []);
  
  // Add sitemap URL
  const addSitemap = useCallback((url: string) => {
    setConfig(prev => {
      if (prev.sitemaps.includes(url)) return prev;
      return {
        ...prev,
        sitemaps: [...prev.sitemaps, url]
      };
    });
  }, []);
  
  // Remove sitemap URL
  const removeSitemap = useCallback((url: string) => {
    setConfig(prev => ({
      ...prev,
      sitemaps: prev.sitemaps.filter(sitemap => sitemap !== url)
    }));
  }, []);
  
  // Generate robots.txt content
  const generateRobotsTxt = useCallback((): string => {
    const lines: string[] = [];
    
    // Add comments
    if (config.comments && config.comments.length > 0) {
      config.comments.forEach(comment => {
        lines.push(`# ${comment}`);
      });
      lines.push('');
    }
    
    // Add rules
    config.rules.forEach(rule => {
      lines.push(`User-agent: ${rule.userAgent}`);
      
      rule.allow.forEach(path => {
        lines.push(`Allow: ${path}`);
      });
      
      rule.disallow.forEach(path => {
        lines.push(`Disallow: ${path}`);
      });
      
      if (rule.crawlDelay !== undefined) {
        lines.push(`Crawl-delay: ${rule.crawlDelay}`);
      }
      
      lines.push('');
    });
    
    // Add host
    if (config.host) {
      lines.push(`Host: ${config.host}`);
      lines.push('');
    }
    
    // Add sitemaps
    config.sitemaps.forEach(sitemap => {
      lines.push(`Sitemap: ${sitemap}`);
    });
    
    return lines.join('\n');
  }, [config]);
  
  return {
    config,
    updateConfig,
    addRule,
    removeRule,
    updateRule,
    addSitemap,
    removeSitemap,
    generateRobotsTxt
  };
}

export default useRobotsTxt;
