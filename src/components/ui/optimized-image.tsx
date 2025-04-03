
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  blurDataURL?: string;
  style?: React.CSSProperties;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  className,
  objectFit = 'cover',
  priority = false,
  placeholder = 'empty',
  onLoad,
  onError,
  loading: loadingProp,
  blurDataURL,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [srcSet, setSrcSet] = useState<string | undefined>(undefined);
  
  // Determine loading strategy
  const loading = priority ? 'eager' : loadingProp || 'lazy';

  // Dynamically generate srcSet for responsive images if width is provided
  useEffect(() => {
    if (width && !error) {
      // Get file extension
      const ext = src.split('.').pop()?.toLowerCase();
      
      // If webp or avif, don't regenerate
      if (ext === 'webp' || ext === 'avif') {
        setSrcSet(undefined);
        return;
      }
      
      if (width) {
        const baseSizes = [width / 4, width / 2, width, width * 1.5, width * 2].filter(
          (size) => size >= 100 && size <= 2048
        );
        
        const uniqueSizes = Array.from(new Set(baseSizes.map((size) => Math.floor(size))));
        
        // For regular images
        const srcSetEntries = uniqueSizes.map(
          (size) => `${getSizedImageUrl(src, size)} ${size}w`
        );
        
        setSrcSet(srcSetEntries.join(', '));
      }
    }
  }, [src, width, error]);

  // Handle successful image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image loading error
  const handleError = () => {
    setError(true);
    if (onError) onError();
  };

  // Function to get placeholder style
  const getPlaceholderStyle = () => {
    if (placeholder === 'blur' && blurDataURL) {
      return { 
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(20px)',
      };
    }
    return { backgroundColor: '#f0f0f0' };
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        ...style,
      }}
    >
      {!isLoaded && placeholder !== 'empty' && (
        <div
          className="absolute inset-0 animate-pulse"
          style={getPlaceholderStyle()}
          aria-hidden="true"
        />
      )}
      
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          {
            "opacity-0": !isLoaded,
            "opacity-100": isLoaded,
          },
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down",
        )}
        {...props}
      />

      {error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted"
          aria-hidden="true"
        >
          <span className="text-muted-foreground text-sm">Image failed to load</span>
        </div>
      )}
    </div>
  );
}

// Helper function to get sized image URL
function getSizedImageUrl(url: string, width: number): string {
  // For external images, use the original URL
  if (url.startsWith('http') && !url.includes(window.location.hostname)) {
    return url;
  }

  try {
    const urlObj = new URL(url, window.location.origin);
    
    // Add width parameter to URL
    urlObj.searchParams.set('w', width.toString());
    
    // Optional: Add WebP format if supported
    if (supportsWebP()) {
      urlObj.searchParams.set('format', 'webp');
    }
    
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, return the original URL
    return url;
  }
}

// Helper function to check WebP support
function supportsWebP(): boolean {
  if (typeof document === 'undefined') return false;
  
  const elem = document.createElement('canvas');
  if (!elem.getContext || !elem.getContext('2d')) {
    return false;
  }
  
  // WebP support test
  return elem.toDataURL('image/webp').startsWith('data:image/webp');
}

export default OptimizedImage;
