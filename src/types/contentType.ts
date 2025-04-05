
// Define Content Type
export type ContentType = 
  | 'grammar' 
  | 'vocabulary' 
  | 'culture' 
  | 'listening' 
  | 'reading' 
  | 'writing' 
  | 'speaking'
  | 'multiple-choice'
  | 'flashcards'
  | 'pdf'
  | 'document'
  | 'video'
  | 'audio'
  | 'image'
  | 'unknown';

export interface ContentFeatures {
  supportsAudio: boolean;
  supportsVideo: boolean;
  supportsInteractive: boolean;
  requiresInternet: boolean;
  offlineCapable: boolean;
  multipleChoice: boolean;
  freeResponse: boolean;
}

// Map to determine which features are available for each content type
export const contentFeatureMap: Record<ContentType, Partial<ContentFeatures>> = {
  'grammar': {
    supportsInteractive: true,
    offlineCapable: true,
    multipleChoice: true,
    freeResponse: true
  },
  'vocabulary': {
    supportsAudio: true,
    offlineCapable: true,
    multipleChoice: true
  },
  'culture': {
    supportsVideo: true,
    requiresInternet: true,
    multipleChoice: true
  },
  'listening': {
    supportsAudio: true,
    requiresInternet: true,
    multipleChoice: true,
    freeResponse: true
  },
  'reading': {
    offlineCapable: true,
    multipleChoice: true,
    freeResponse: true
  },
  'writing': {
    offlineCapable: true,
    freeResponse: true
  },
  'speaking': {
    supportsAudio: true,
    requiresInternet: true,
    freeResponse: true
  },
  'multiple-choice': {
    offlineCapable: true,
    multipleChoice: true
  },
  'flashcards': {
    offlineCapable: true,
    supportsAudio: true
  },
  'pdf': {
    offlineCapable: true
  },
  'document': {
    offlineCapable: true
  },
  'video': {
    supportsVideo: true,
    requiresInternet: true
  },
  'audio': {
    supportsAudio: true,
    requiresInternet: true
  },
  'image': {
    offlineCapable: true
  },
  'unknown': {}
};
