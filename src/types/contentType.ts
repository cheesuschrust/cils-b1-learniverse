
export type ContentType = 
  | 'flashcards' 
  | 'multiple-choice' 
  | 'listening' 
  | 'writing' 
  | 'speaking'
  | 'pdf'
  | 'document'
  | 'video'
  | 'audio'
  | 'image'
  | 'csv'
  | 'grammar'
  | 'vocabulary'
  | 'culture'
  | 'reading'
  | 'citizenship'
  | string;

export interface ContentFeatures {
  supportsAudio: boolean;
  supportsVideo: boolean;
  supportsInteractive: boolean;
  requiresInternet: boolean;
  isDownloadable: boolean;
  isEditable: boolean;
  isPrintable: boolean;
  recommendedDifficulty?: string;
  wordCount?: number;
  sentenceCount?: number;
  paragraphCount?: number;
}

// Map of content types to their standard features
export const contentFeaturesMap: Record<ContentType, Partial<ContentFeatures>> = {
  'flashcards': {
    supportsAudio: true,
    supportsVideo: false,
    supportsInteractive: true,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'multiple-choice': {
    supportsAudio: true,
    supportsVideo: false,
    supportsInteractive: true,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'listening': {
    supportsAudio: true,
    supportsVideo: false,
    supportsInteractive: true,
    requiresInternet: true,
    isDownloadable: false,
    isEditable: false,
    isPrintable: false
  },
  'writing': {
    supportsAudio: false,
    supportsVideo: false,
    supportsInteractive: true,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'speaking': {
    supportsAudio: true,
    supportsVideo: false,
    supportsInteractive: true,
    requiresInternet: true,
    isDownloadable: false,
    isEditable: false,
    isPrintable: false
  },
  'pdf': {
    supportsAudio: false,
    supportsVideo: false,
    supportsInteractive: false,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: false,
    isPrintable: true
  },
  'document': {
    supportsAudio: false,
    supportsVideo: false,
    supportsInteractive: false,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'video': {
    supportsAudio: true,
    supportsVideo: true,
    supportsInteractive: false,
    requiresInternet: true,
    isDownloadable: true,
    isEditable: false,
    isPrintable: false
  },
  'audio': {
    supportsAudio: true,
    supportsVideo: false,
    supportsInteractive: false,
    requiresInternet: true,
    isDownloadable: true,
    isEditable: false,
    isPrintable: false
  },
  'image': {
    supportsAudio: false,
    supportsVideo: false,
    supportsInteractive: false,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: false,
    isPrintable: true
  },
  'csv': {
    supportsAudio: false,
    supportsVideo: false,
    supportsInteractive: false,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'grammar': {
    supportsAudio: false,
    supportsVideo: false,
    supportsInteractive: true,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'vocabulary': {
    supportsAudio: true,
    supportsVideo: false,
    supportsInteractive: true,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'culture': {
    supportsAudio: true,
    supportsVideo: true,
    supportsInteractive: true,
    requiresInternet: true,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'reading': {
    supportsAudio: false,
    supportsVideo: false,
    supportsInteractive: true,
    requiresInternet: false,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  },
  'citizenship': {
    supportsAudio: true,
    supportsVideo: true,
    supportsInteractive: true,
    requiresInternet: true,
    isDownloadable: true,
    isEditable: true,
    isPrintable: true
  }
};
