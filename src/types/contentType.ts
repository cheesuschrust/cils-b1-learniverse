
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
  wordCount?: number;
  questionMarks?: number;
  sentenceCount?: number;
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

// Utility functions for ContentType
export function formatContentType(contentType: ContentType): string {
  const formattedNames: Record<ContentType, string> = {
    'grammar': 'Grammar',
    'vocabulary': 'Vocabulary',
    'culture': 'Culture',
    'listening': 'Listening',
    'reading': 'Reading',
    'writing': 'Writing',
    'speaking': 'Speaking',
    'multiple-choice': 'Multiple Choice',
    'flashcards': 'Flashcards',
    'pdf': 'PDF Document',
    'document': 'Document',
    'video': 'Video',
    'audio': 'Audio',
    'image': 'Image',
    'unknown': 'Unknown'
  };
  
  return formattedNames[contentType] || contentType;
}

export function getContentTypeColor(contentType: ContentType): string {
  const colors: Record<ContentType, string> = {
    'grammar': '#3B82F6',      // blue-500
    'vocabulary': '#8B5CF6',   // violet-500
    'culture': '#EC4899',      // pink-500
    'listening': '#10B981',    // emerald-500
    'reading': '#F59E0B',      // amber-500
    'writing': '#6366F1',      // indigo-500
    'speaking': '#EF4444',     // red-500
    'multiple-choice': '#8B5CF6', // violet-500
    'flashcards': '#8B5CF6',   // violet-500
    'pdf': '#64748B',          // slate-500
    'document': '#64748B',     // slate-500
    'video': '#06B6D4',        // cyan-500
    'audio': '#14B8A6',        // teal-500
    'image': '#F472B6',        // pink-400
    'unknown': '#9CA3AF'       // gray-400
  };
  
  return colors[contentType] || '#9CA3AF';
}
