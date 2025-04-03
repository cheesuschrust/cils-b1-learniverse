
/**
 * Application audit utilities to detect and fix common issues
 */

// Types of issues to check for
export enum AuditIssueType {
  ACCESSIBILITY = 'accessibility',
  PERFORMANCE = 'performance',
  SEO = 'seo',
  SECURITY = 'security',
  BEST_PRACTICE = 'best-practice'
}

// Severity levels
export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Issue interface
export interface AuditIssue {
  type: AuditIssueType;
  severity: AuditSeverity;
  message: string;
  element?: HTMLElement | null;
  fix?: () => void;
}

/**
 * Run accessibility audit on the current page
 */
export function runAccessibilityAudit(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // Check for images without alt text
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: AuditIssueType.ACCESSIBILITY,
        severity: AuditSeverity.ERROR,
        message: 'Image is missing alt text',
        element: img,
        fix: () => {
          img.alt = 'Image';
        }
      });
    }
  });
  
  // Check for buttons without accessible names
  document.querySelectorAll('button').forEach(button => {
    if (!button.textContent && !button.getAttribute('aria-label')) {
      issues.push({
        type: AuditIssueType.ACCESSIBILITY,
        severity: AuditSeverity.ERROR,
        message: 'Button has no accessible name',
        element: button,
        fix: () => {
          button.setAttribute('aria-label', 'Button');
        }
      });
    }
  });
  
  // Check for inadequate color contrast (simplified check)
  document.querySelectorAll('*').forEach(el => {
    const bgColor = window.getComputedStyle(el).backgroundColor;
    const color = window.getComputedStyle(el).color;
    
    if (bgColor && color && bgColor !== 'rgba(0, 0, 0, 0)' && isLowContrast(color, bgColor)) {
      issues.push({
        type: AuditIssueType.ACCESSIBILITY,
        severity: AuditSeverity.WARNING,
        message: 'Element may have insufficient color contrast',
        element: el
      });
    }
  });
  
  // Check for missing page title
  if (!document.title) {
    issues.push({
      type: AuditIssueType.ACCESSIBILITY,
      severity: AuditSeverity.ERROR,
      message: 'Page is missing a title',
      fix: () => {
        document.title = 'Page Title';
      }
    });
  }
  
  // Check for missing form labels
  document.querySelectorAll('input, select, textarea').forEach(field => {
    const id = field.id;
    if (id && !document.querySelector(`label[for="${id}"]`)) {
      issues.push({
        type: AuditIssueType.ACCESSIBILITY,
        severity: AuditSeverity.ERROR,
        message: 'Form field is missing a label',
        element: field
      });
    }
  });
  
  return issues;
}

/**
 * Run performance audit on the current page
 */
export function runPerformanceAudit(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  
  if (typeof document === 'undefined' || typeof window === 'undefined') return issues;
  
  // Check for unoptimized images
  document.querySelectorAll('img').forEach(img => {
    // Check if image dimensions are set
    if (!img.width && !img.height && !img.style.width && !img.style.height) {
      issues.push({
        type: AuditIssueType.PERFORMANCE,
        severity: AuditSeverity.WARNING,
        message: 'Image missing width/height attributes which may cause layout shifts',
        element: img
      });
    }
    
    // Check if image is properly sized
    if (img.src && img.naturalWidth > 0) {
      const displayWidth = img.clientWidth;
      if (img.naturalWidth > displayWidth * 2.5) {
        issues.push({
          type: AuditIssueType.PERFORMANCE,
          severity: AuditSeverity.WARNING,
          message: 'Image is significantly larger than its display size',
          element: img
        });
      }
    }
  });
  
  // Check for excessive DOM size
  const domSize = document.querySelectorAll('*').length;
  if (domSize > 1500) {
    issues.push({
      type: AuditIssueType.PERFORMANCE,
      severity: domSize > 3000 ? AuditSeverity.ERROR : AuditSeverity.WARNING,
      message: `DOM size is large (${domSize} elements), which may affect performance`
    });
  }
  
  // Check for render-blocking resources
  if (document.querySelectorAll('link[rel="stylesheet"]').length > 5) {
    issues.push({
      type: AuditIssueType.PERFORMANCE,
      severity: AuditSeverity.WARNING,
      message: 'Multiple stylesheets may be blocking rendering'
    });
  }
  
  // Check for lazy-loaded images
  document.querySelectorAll('img').forEach(img => {
    if (!img.loading) {
      issues.push({
        type: AuditIssueType.PERFORMANCE,
        severity: AuditSeverity.INFO,
        message: 'Image does not use lazy loading',
        element: img,
        fix: () => {
          img.loading = 'lazy';
        }
      });
    }
  });
  
  return issues;
}

/**
 * Run SEO audit on the current page
 */
export function runSEOAudit(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // Check for meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    issues.push({
      type: AuditIssueType.SEO,
      severity: AuditSeverity.ERROR,
      message: 'Page is missing a meta description'
    });
  }
  
  // Check for heading hierarchy
  const h1Elements = document.querySelectorAll('h1');
  if (h1Elements.length === 0) {
    issues.push({
      type: AuditIssueType.SEO,
      severity: AuditSeverity.ERROR,
      message: 'Page is missing an H1 heading'
    });
  } else if (h1Elements.length > 1) {
    issues.push({
      type: AuditIssueType.SEO,
      severity: AuditSeverity.WARNING,
      message: 'Page has multiple H1 headings'
    });
  }
  
  // Check for proper heading structure
  const headingLevels = [0, 0, 0, 0, 0, 0]; // h1 to h6
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    const level = parseInt(heading.tagName[1]) - 1;
    headingLevels[level]++;
  });
  
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] > 0 && headingLevels[i-1] === 0) {
      issues.push({
        type: AuditIssueType.SEO,
        severity: AuditSeverity.WARNING,
        message: `Found h${i+1} without preceding h${i}, which may affect SEO`
      });
    }
  }
  
  // Check for canonical URL
  if (!document.querySelector('link[rel="canonical"]')) {
    issues.push({
      type: AuditIssueType.SEO,
      severity: AuditSeverity.WARNING,
      message: 'Page is missing a canonical URL'
    });
  }
  
  // Check for structured data
  if (!document.querySelector('script[type="application/ld+json"]')) {
    issues.push({
      type: AuditIssueType.SEO,
      severity: AuditSeverity.INFO,
      message: 'Page does not use structured data (JSON-LD)'
    });
  }
  
  return issues;
}

/**
 * Run security audit on the current page
 */
export function runSecurityAudit(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // Check for target="_blank" without rel="noopener noreferrer"
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    const rel = link.getAttribute('rel') || '';
    if (!rel.includes('noopener') && !rel.includes('noreferrer')) {
      issues.push({
        type: AuditIssueType.SECURITY,
        severity: AuditSeverity.WARNING,
        message: 'External link uses target="_blank" without rel="noopener noreferrer"',
        element: link,
        fix: () => {
          link.setAttribute('rel', `${rel} noopener noreferrer`.trim());
        }
      });
    }
  });
  
  // Check for inline scripts (potential XSS vectors)
  const inlineScripts = document.querySelectorAll('script:not([src])');
  if (inlineScripts.length > 0) {
    issues.push({
      type: AuditIssueType.SECURITY,
      severity: AuditSeverity.INFO,
      message: `Found ${inlineScripts.length} inline script(s), which may pose XSS risks`
    });
  }
  
  return issues;
}

/**
 * Run best practices audit on the current page
 */
export function runBestPracticesAudit(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // Check for missing doctype
  if (!document.doctype) {
    issues.push({
      type: AuditIssueType.BEST_PRACTICE,
      severity: AuditSeverity.WARNING,
      message: 'Document is missing a doctype declaration'
    });
  }
  
  // Check for elements with no spacing around text
  document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span').forEach(el => {
    if (el.textContent && el.textContent.trim() === el.textContent) {
      const style = window.getComputedStyle(el);
      if (parseFloat(style.lineHeight) < 1.2 * parseFloat(style.fontSize)) {
        issues.push({
          type: AuditIssueType.BEST_PRACTICE,
          severity: AuditSeverity.INFO,
          message: 'Element has low line-height which may reduce readability',
          element: el
        });
      }
    }
  });
  
  // Check for fixed font sizes
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.fontSize && style.fontSize.endsWith('px')) {
      const fontSize = parseFloat(style.fontSize);
      if (fontSize < 12) {
        issues.push({
          type: AuditIssueType.BEST_PRACTICE,
          severity: AuditSeverity.WARNING,
          message: 'Element has small fixed font size which may affect readability',
          element: el
        });
      }
    }
  });
  
  return issues;
}

/**
 * Run all audits and return combined results
 */
export function runAllAudits(): AuditIssue[] {
  return [
    ...runAccessibilityAudit(),
    ...runPerformanceAudit(),
    ...runSEOAudit(),
    ...runSecurityAudit(),
    ...runBestPracticesAudit()
  ];
}

/**
 * Simple function to check for low contrast (simplified)
 */
function isLowContrast(color1: string, color2: string): boolean {
  // This is a simplified check - a real implementation would use proper color contrast algorithms
  const rgb1 = parseRGB(color1);
  const rgb2 = parseRGB(color2);
  
  if (!rgb1 || !rgb2) return false;
  
  // Calculate relative luminance using a simplified formula
  const lum1 = 0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b;
  const lum2 = 0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b;
  
  // Calculate contrast ratio
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05) < 3; // Simplified contrast check
}

/**
 * Parse RGB color string
 */
function parseRGB(color: string): { r: number, g: number, b: number } | null {
  const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  const rgbaRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;
  
  let match = color.match(rgbRegex);
  if (!match) match = color.match(rgbaRegex);
  
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10)
    };
  }
  
  return null;
}
