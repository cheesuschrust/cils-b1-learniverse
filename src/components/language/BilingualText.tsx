
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BilingualTextProps {
  english: string;
  italian: string;
  className?: string;
  as?: React.ElementType;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  english,
  italian,
  className = '',
  as: Component = 'span'
}) => {
  const { language } = useLanguage();
  
  if (language === 'english') {
    return <Component className={className}>{english}</Component>;
  }
  
  if (language === 'italian') {
    return <Component className={className}>{italian}</Component>;
  }
  
  // For 'both' language setting, display both
  return (
    <Component className={className}>
      <span className="english-text">{english}</span>
      <span className="mx-1 text-muted-foreground">|</span>
      <span className="italian-text">{italian}</span>
    </Component>
  );
};

export default BilingualText;
