import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRouteLabel } from '@/utils/routeLabels';
import { useLocation } from 'react-router-dom';

/**
 * Hook to set bilingual page titles
 * @param english The English title
 * @param italian The Italian title
 * @param suffix Optional suffix to add to the title (e.g., "- Italian Learning")
 */
export const useBilingualTitle = (
  english?: string, 
  italian?: string, 
  suffix = '- Italian Learning'
) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  useEffect(() => {
    let title: string;
    
    // If custom titles are provided, use them
    if (english || italian) {
      if (language === 'both' && english && italian) {
        title = `${english} / ${italian}`;
      } else if (language === 'italian' && italian) {
        title = italian;
      } else {
        title = english || '';
      }
    } 
    // Otherwise try to get from route labels
    else {
      title = getRouteLabel(location.pathname, language);
    }
    
    if (suffix) {
      title = `${title} ${suffix}`;
    }
    
    document.title = title;
  }, [english, italian, language, location.pathname, suffix]);
};

export default useBilingualTitle;
