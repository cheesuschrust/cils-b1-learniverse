
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SpeakableWord } from '@/components/ui/speakable-word';
import { cn } from '@/lib/utils';
import { TranslateButton } from './TranslateButton';

interface BilingualTitleProps {
  english: string;
  italian: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  showTranslate?: boolean;
  showSpeak?: boolean;
  subtitle?: {
    english: string;
    italian: string;
  };
}

export const BilingualTitle: React.FC<BilingualTitleProps> = ({
  english,
  italian,
  as = 'h1',
  className,
  showTranslate = false,
  showSpeak = false,
  subtitle
}) => {
  const { language } = useLanguage();
  
  const shouldShowEnglish = language === 'english' || language === 'both';
  const shouldShowItalian = language === 'italian' || language === 'both';
  
  const Heading = as;
  
  const renderContent = () => {
    if (language === 'both') {
      return (
        <>
          <span>{english}</span>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-italian-green italic">{italian}</span>
        </>
      );
    }
    
    return language === 'english' ? english : italian;
  };
  
  const renderSubtitle = () => {
    if (!subtitle) return null;
    
    if (language === 'both') {
      return (
        <p className="text-muted-foreground text-sm md:text-base mt-1">
          <span>{subtitle.english}</span>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-italian-green/70 italic">{subtitle.italian}</span>
        </p>
      );
    }
    
    return (
      <p className="text-muted-foreground text-sm md:text-base mt-1">
        {language === 'english' ? subtitle.english : subtitle.italian}
      </p>
    );
  };
  
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Heading className={cn("font-bold", className)}>
          {renderContent()}
        </Heading>
        
        {showSpeak && (
          <SpeakableWord
            word={language === 'english' ? english : italian}
            language={language === 'english' ? 'en-US' : 'it-IT'}
            size="sm"
            className="mt-1"
          />
        )}
        
        {showTranslate && (
          <TranslateButton 
            english={english} 
            italian={italian} 
            size="sm"
          />
        )}
      </div>
      
      {renderSubtitle()}
    </div>
  );
};

export default BilingualTitle;
