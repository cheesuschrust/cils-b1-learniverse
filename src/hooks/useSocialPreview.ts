
import { useCallback } from 'react';

export interface SocialPreviewConfig {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  twitterUsername?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageMimeType?: string;
  type?: 'website' | 'article' | 'profile' | 'book';
  locale?: string;
}

export interface UseSocialPreviewReturn {
  generateOpenGraphTags: (config: Partial<SocialPreviewConfig>) => Record<string, string>;
  generateTwitterCardTags: (config: Partial<SocialPreviewConfig>) => Record<string, string>;
  generatePreviewImage: (config: Partial<SocialPreviewConfig>) => Promise<string>;
  renderSocialPreviewTags: (config: Partial<SocialPreviewConfig>) => JSX.Element;
  validatePreviewImage: (imageUrl: string) => Promise<boolean>;
}

/**
 * Hook for managing social media preview metadata
 */
export function useSocialPreview(defaultConfig?: Partial<SocialPreviewConfig>): UseSocialPreviewReturn {
  // Default configuration
  const defaults: SocialPreviewConfig = {
    title: 'Italian Language Learning',
    description: 'Learn Italian with our comprehensive platform for all skill levels',
    url: window.location.href,
    image: `${window.location.origin}/assets/social-preview.png`,
    siteName: 'Italian Language Learning Platform',
    twitterUsername: '@italianlearning',
    imageWidth: 1200,
    imageHeight: 630,
    imageMimeType: 'image/png',
    type: 'website',
    locale: 'en_US',
    ...defaultConfig
  };
  
  // Generate Open Graph tags
  const generateOpenGraphTags = useCallback((config: Partial<SocialPreviewConfig> = {}): Record<string, string> => {
    const mergedConfig = { ...defaults, ...config };
    
    return {
      'og:title': mergedConfig.title,
      'og:description': mergedConfig.description,
      'og:url': mergedConfig.url,
      'og:image': mergedConfig.image,
      'og:image:width': mergedConfig.imageWidth?.toString() || '',
      'og:image:height': mergedConfig.imageHeight?.toString() || '',
      'og:image:type': mergedConfig.imageMimeType || '',
      'og:type': mergedConfig.type || 'website',
      'og:site_name': mergedConfig.siteName,
      'og:locale': mergedConfig.locale || 'en_US'
    };
  }, [defaults]);
  
  // Generate Twitter Card tags
  const generateTwitterCardTags = useCallback((config: Partial<SocialPreviewConfig> = {}): Record<string, string> => {
    const mergedConfig = { ...defaults, ...config };
    
    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': mergedConfig.title,
      'twitter:description': mergedConfig.description,
      'twitter:image': mergedConfig.image,
      'twitter:site': mergedConfig.twitterUsername || '',
      'twitter:creator': mergedConfig.twitterUsername || '',
      'twitter:url': mergedConfig.url
    };
  }, [defaults]);
  
  // Validate preview image dimensions and accessibility
  const validatePreviewImage = useCallback(async (imageUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Check if image meets minimum size requirements
        const validSize = img.width >= 1200 && img.height >= 630;
        resolve(validSize);
      };
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }, []);
  
  // Generate a preview image dynamically (simplified implementation)
  // In a real app, this would use canvas to create a dynamic image
  const generatePreviewImage = useCallback(async (config: Partial<SocialPreviewConfig> = {}): Promise<string> => {
    // This is a mock implementation
    const mergedConfig = { ...defaults, ...config };
    
    console.log('Generating preview image with config:', mergedConfig);
    
    // In a real implementation, this would use Canvas API to draw the image
    // and return a data URL or call a backend service
    
    // For now, just return the default image
    return mergedConfig.image;
  }, [defaults]);
  
  // Render all social preview meta tags
  const renderSocialPreviewTags = useCallback((config: Partial<SocialPreviewConfig> = {}): JSX.Element => {
    const ogTags = generateOpenGraphTags(config);
    const twitterTags = generateTwitterCardTags(config);
    
    return (
      <>
        {/* Open Graph Tags */}
        {Object.entries(ogTags).map(([property, content]) => 
          content ? <meta key={property} property={property} content={content} /> : null
        )}
        
        {/* Twitter Card Tags */}
        {Object.entries(twitterTags).map(([name, content]) => 
          content ? <meta key={name} name={name} content={content} /> : null
        )}
      </>
    );
  }, [generateOpenGraphTags, generateTwitterCardTags]);
  
  return {
    generateOpenGraphTags,
    generateTwitterCardTags,
    generatePreviewImage,
    renderSocialPreviewTags,
    validatePreviewImage
  };
}

export default useSocialPreview;
