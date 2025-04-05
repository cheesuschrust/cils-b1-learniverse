
import { ContentType } from '@/types/contentType';
import { ItalianTestSection } from '@/types/ai';

/**
 * Maps ContentType values to ItalianTestSection values and vice versa
 * This helps with compatibility between different modules
 */
export const contentTypeMapping: Record<string, string> = {
  // ContentType to ItalianTestSection
  'multiple-choice': 'grammar',
  'flashcards': 'vocabulary',
  'pdf': 'reading',
  'document': 'reading',
  'video': 'listening',
  'audio': 'listening',
  'image': 'culture',
  
  // ItalianTestSection to ContentType
  'citizenship': 'culture',
  
  // Common types (direct mapping)
  'grammar': 'grammar',
  'vocabulary': 'vocabulary',
  'listening': 'listening',
  'reading': 'reading',
  'writing': 'writing',
  'speaking': 'speaking',
  'culture': 'culture'
};

/**
 * Convert ContentType to ItalianTestSection
 */
export function toItalianTestSection(contentType: ContentType): ItalianTestSection {
  const mapping = contentTypeMapping[contentType];
  if (mapping && isItalianTestSection(mapping)) {
    return mapping as ItalianTestSection;
  }
  return 'grammar'; // Default fallback
}

/**
 * Convert ItalianTestSection to ContentType
 */
export function toContentType(section: ItalianTestSection): ContentType {
  const reverseMapping = Object.entries(contentTypeMapping).find(([_, value]) => value === section);
  if (reverseMapping && isContentType(reverseMapping[0])) {
    return reverseMapping[0] as ContentType;
  }
  return 'grammar'; // Default fallback
}

/**
 * Type guard for ItalianTestSection
 */
function isItalianTestSection(value: string): value is ItalianTestSection {
  return [
    'grammar', 'vocabulary', 'culture', 'listening',
    'reading', 'writing', 'speaking', 'citizenship'
  ].includes(value);
}

/**
 * Type guard for ContentType
 */
function isContentType(value: string): value is ContentType {
  return [
    'grammar', 'vocabulary', 'culture', 'listening', 'reading',
    'writing', 'speaking', 'multiple-choice', 'flashcards',
    'pdf', 'document', 'video', 'audio', 'image', 'unknown'
  ].includes(value);
}

/**
 * Convert content types between different interfaces to ensure type compatibility
 */
export function convertContentTypes(types: (ContentType | ItalianTestSection)[]): ContentType[] {
  return types.map(type => {
    if (isContentType(type)) {
      return type;
    } else if (isItalianTestSection(type)) {
      return toContentType(type);
    }
    return 'unknown' as ContentType;
  });
}

export default {
  toItalianTestSection,
  toContentType,
  contentTypeMapping,
  convertContentTypes
};
