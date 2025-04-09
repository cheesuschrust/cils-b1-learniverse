
/**
 * Service for handling JSON-LD structured data injection and removal
 */
class StructuredDataService {
  private static readonly SCRIPT_ID = 'structured-data-json-ld';

  /**
   * Injects JSON-LD structured data into the page
   * @param data The structured data object to inject
   */
  public static injectStructuredData(data: object): void {
    // Remove any existing structured data first
    this.removeStructuredData();
    
    // Create a new script element for the structured data
    const script = document.createElement('script');
    script.id = this.SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    
    // Add it to the head of the document
    document.head.appendChild(script);
  }

  /**
   * Removes the JSON-LD structured data from the page
   */
  public static removeStructuredData(): void {
    const existingScript = document.getElementById(this.SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }
  }

  /**
   * Create standard structured data for an organization
   * @param name Organization name
   * @param url Website URL
   * @param logo Logo URL
   * @param description Organization description
   * @returns Organization structured data object
   */
  public static createOrganizationData(
    name: string, 
    url: string, 
    logo: string,
    description: string
  ): object {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": name,
      "url": url,
      "logo": logo,
      "description": description
    };
  }

  /**
   * Create structured data for a website breadcrumb
   * @param items Breadcrumb items
   * @returns Breadcrumb structured data object
   */
  public static createBreadcrumbData(
    items: Array<{name: string, url: string}>
  ): object {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }

  /**
   * Create structured data for an article
   * @param headline Article headline
   * @param description Article description
   * @param authorName Author name
   * @param publisherName Publisher name
   * @param publisherLogo Publisher logo URL
   * @param datePublished Publication date
   * @param dateModified Modification date
   * @param imageUrl Featured image URL
   * @returns Article structured data object
   */
  public static createArticleData(
    headline: string,
    description: string,
    authorName: string,
    publisherName: string,
    publisherLogo: string,
    datePublished: string,
    dateModified: string,
    imageUrl: string
  ): object {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": headline,
      "description": description,
      "author": {
        "@type": "Person",
        "name": authorName
      },
      "publisher": {
        "@type": "Organization",
        "name": publisherName,
        "logo": {
          "@type": "ImageObject",
          "url": publisherLogo
        }
      },
      "datePublished": datePublished,
      "dateModified": dateModified,
      "image": imageUrl
    };
  }

  /**
   * Create structured data for a product
   * @param name Product name
   * @param description Product description
   * @param imageUrl Product image URL
   * @param price Product price
   * @param priceCurrency Price currency code
   * @param availability Product availability
   * @returns Product structured data object
   */
  public static createProductData(
    name: string,
    description: string,
    imageUrl: string,
    price: number,
    priceCurrency: string,
    availability: string
  ): object {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": description,
      "image": imageUrl,
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": priceCurrency,
        "availability": availability
      }
    };
  }
}

export default StructuredDataService;
