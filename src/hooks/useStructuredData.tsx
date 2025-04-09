
import { useEffect } from 'react';
import StructuredDataService from '@/services/StructuredDataService';

/**
 * A hook that injects JSON-LD structured data into the page
 * and removes it when the component unmounts
 */
export function useStructuredData(data: object): void {
  useEffect(() => {
    // Inject the structured data when the component mounts
    StructuredDataService.injectStructuredData(data);
    
    // Clean up by removing the structured data when the component unmounts
    return () => {
      StructuredDataService.removeStructuredData();
    };
  }, [data]);
}

export default useStructuredData;
