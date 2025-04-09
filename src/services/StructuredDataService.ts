
/**
 * StructuredDataService - A service for generating and managing structured data (JSON-LD)
 * for better SEO and rich snippets in search results
 */
export class StructuredDataService {
  /**
   * Generate FAQ Page structured data
   */
  static generateFAQPage(faqs: Array<{ question: string; answer: string }>) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }
  
  /**
   * Generate Course structured data
   */
  static generateCourse(course: {
    name: string;
    description: string;
    provider: string;
    url: string;
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.name,
      "description": course.description,
      "provider": {
        "@type": "Organization",
        "name": course.provider,
        "sameAs": course.url
      }
    };
  }
  
  /**
   * Generate Product structured data for subscription plans
   */
  static generateProduct(product: {
    name: string;
    description: string;
    price: string;
    currency: string;
    sku: string;
    brand: string;
    url: string;
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand
      },
      "sku": product.sku,
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": product.currency,
        "url": product.url,
        "availability": "https://schema.org/InStock"
      }
    };
  }
  
  /**
   * Inject JSON-LD structured data into the page
   */
  static injectStructuredData(data: object): void {
    // Remove any existing JSON-LD scripts with the same ID
    const existingScript = document.getElementById('structured-data-jsonld');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Create and inject the new script
    const script = document.createElement('script');
    script.id = 'structured-data-jsonld';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(data);
    document.head.appendChild(script);
  }
  
  /**
   * Remove JSON-LD structured data from the page
   */
  static removeStructuredData(): void {
    const existingScript = document.getElementById('structured-data-jsonld');
    if (existingScript) {
      existingScript.remove();
    }
  }
}

export default StructuredDataService;
