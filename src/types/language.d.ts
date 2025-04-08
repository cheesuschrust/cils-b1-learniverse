
export type LanguageOption = 'english' | 'italian' | 'both';

export interface TranslationPair {
  english: string;
  italian: string;
}

export interface BilingualTextProps {
  english: string;
  italian: string;
  showTranslate?: boolean;
  showSpeak?: boolean;
  className?: string;
  englishClassName?: string;
  italianClassName?: string;
}

export interface SpeakableWordProps {
  word: string;
  language?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
  size?: 'sm' | 'default' | 'lg';
  onClick?: () => void;
  iconOnly?: boolean;
}

export interface TranslateButtonProps {
  english: string;
  italian: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}
