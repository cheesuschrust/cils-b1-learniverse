
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TranslateButtonProps {
  english: string;
  italian: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const TranslateButton: React.FC<TranslateButtonProps> = ({
  english,
  italian,
  size = 'sm',
  variant = 'ghost',
}) => {
  const { language, toggleLanguage } = useLanguage();
  
  const getTooltipText = () => {
    switch (language) {
      case 'english': return 'Show in Italian';
      case 'italian': return 'Show in Both Languages';
      case 'both': return 'Show in English';
      default: return 'Change Language';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            onClick={toggleLanguage} 
            className="flex items-center gap-1"
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="text-xs">
              {language === 'english' ? 'IT' : 
               language === 'italian' ? 'EN+IT' : 'EN'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{getTooltipText()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
