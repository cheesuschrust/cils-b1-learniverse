
interface ReviewResult {
  interval: number;
  easeFactor: number;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
}

interface ReviewParams {
  quality: number; // 0-4 scale where 0 = completely forgot, 4 = perfect recall
  previousInterval: number; // in days
  previousEaseFactor: number; // usually starts at 2.5
  isNew: boolean; // whether this is the first review
}

// Spaced repetition algorithm (SM-2 inspired)
export function calculateReviewPerformance(params: ReviewParams): ReviewResult {
  const { quality, previousInterval, previousEaseFactor, isNew } = params;
  
  // Calculate easeFactor
  let easeFactor = previousEaseFactor;
  if (!isNew) {
    // SM-2 formula: EF := EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = Math.max(
      1.3, // minimum ease factor
      previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
  }
  
  // Calculate next interval
  let interval = 0;
  let status: 'new' | 'learning' | 'reviewing' | 'mastered' = 'new';
  
  if (quality < 2) {
    // Poor recall, reset to first interval
    interval = 1;
    status = 'learning';
  } else if (isNew || previousInterval === 0) {
    // First successful recall
    interval = 1;
    status = 'learning';
  } else if (previousInterval === 1) {
    // Second successful recall
    interval = 6;
    status = 'reviewing';
  } else {
    // Subsequent successful recalls
    interval = Math.round(previousInterval * easeFactor);
    
    if (interval > 30) {
      status = 'mastered';
    } else {
      status = 'reviewing';
    }
  }
  
  return { interval, easeFactor, status };
}
