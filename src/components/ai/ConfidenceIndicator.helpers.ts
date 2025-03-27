
/**
 * Helper functions for the ConfidenceIndicator component
 */

/**
 * Calculate the display score from either percentage or decimal value
 * @param score Score value (can be percentage or decimal)
 * @returns Normalized score as percentage (0-100)
 */
export const normalizeScore = (score: number): number => {
  // If score is in decimal format (0-1), convert to percentage
  const percentageScore = score <= 1 ? Math.round(score * 100) : Math.round(score);
  
  // Ensure score is within valid range (0-100)
  return Math.min(Math.max(percentageScore, 0), 100);
};

/**
 * Get the confidence label based on score value
 * @param score Normalized score (0-100)
 * @returns Text label for the confidence level
 */
export const getConfidenceLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
};

/**
 * Get the appropriate color class based on confidence score
 * @param score Normalized score (0-100)
 * @returns Tailwind color class name
 */
export const getConfidenceColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

/**
 * Get the title text based on content type
 * @param contentType Optional content type identifier
 * @returns Display text for the content type
 */
export const getContentTypeTitle = (contentType?: string): string => {
  if (!contentType) return 'Confidence Score';
  
  switch (contentType) {
    case 'writing': return 'Writing Quality';
    case 'speaking': return 'Pronunciation';
    case 'listening': return 'Comprehension';
    default: return 'Confidence Score';
  }
};
