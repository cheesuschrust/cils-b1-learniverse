
export type ContentType = 
  | 'grammar' 
  | 'vocabulary' 
  | 'reading' 
  | 'writing' 
  | 'speaking' 
  | 'listening' 
  | 'culture' 
  | 'citizenship';

export interface ContentFeatures {
  supportsAudio: boolean;
  supportsVideo: boolean;
  supportsInteractive: boolean;
  requiresInternet: boolean;
  isDownloadable: boolean;
  level: string;
  wordCount?: number; 
  sentenceCount?: number;
  questionMarks?: number;
  avgSentenceLength?: number;
}

export const formatContentType = (contentType: ContentType): string => {
  const formatted = contentType.charAt(0).toUpperCase() + contentType.slice(1);
  return formatted;
};

export const getContentTypeColor = (contentType: ContentType): string => {
  switch (contentType) {
    case 'grammar':
      return 'bg-blue-100 text-blue-800';
    case 'vocabulary':
      return 'bg-emerald-100 text-emerald-800';
    case 'reading':
      return 'bg-indigo-100 text-indigo-800';
    case 'writing':
      return 'bg-purple-100 text-purple-800';
    case 'speaking':
      return 'bg-amber-100 text-amber-800';
    case 'listening':
      return 'bg-cyan-100 text-cyan-800';
    case 'culture':
      return 'bg-rose-100 text-rose-800';
    case 'citizenship':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
