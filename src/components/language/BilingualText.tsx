
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslateButton } from './TranslateButton';
import { SpeakableWord } from '@/components/ui/speakable-word';
import { cn } from '@/lib/utils';

export interface BilingualTextProps {
  english: string;
  italian: string;
  showTranslate?: boolean;
  showSpeak?: boolean;
  className?: string;
  englishClassName?: string;
  italianClassName?: string;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  english,
  italian,
  showTranslate = false,
  showSpeak = false,
  className = "",
  englishClassName = "",
  italianClassName = ""
}) => {
  const { language } = useLanguage();
  
  const shouldShowEnglish = language === 'english' || language === 'both';
  const shouldShowItalian = language === 'italian' || language === 'both';
  
  return (
    <div className={cn("space-y-2", className)}>
      {shouldShowEnglish && (
        <div className={cn("flex items-start gap-2", englishClassName)}>
          <div className="flex-1">
            <p className="text-foreground">{english}</p>
          </div>
          {showSpeak && !shouldShowItalian && (
            <SpeakableWord 
              word={english} 
              language="en-US" 
              iconOnly 
              size="sm"
              className="mt-0.5 flex-shrink-0" 
            />
          )}
        </div>
      )}
      
      {shouldShowItalian && (
        <div className={cn("flex items-start gap-2", italianClassName)}>
          <div className="flex-1">
            <p className={cn(
              "text-foreground",
              language === 'both' ? "italic text-italian-green" : ""
            )}>
              {italian}
            </p>
          </div>
          {showSpeak && (
            <SpeakableWord 
              word={italian} 
              language="it-IT" 
              iconOnly 
              size="sm"
              className="mt-0.5 flex-shrink-0" 
            />
          )}
        </div>
      )}
      
      {showTranslate && (
        <div className="flex justify-end">
          <TranslateButton english={english} italian={italian} />
        </div>
      )}
    </div>
  );
};

export default BilingualText;
