
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Wait for a specified time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

/**
 * Get random element from array
 */
export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Compute CILS B1 readiness score based on section scores
 * @param scores Record of scores by section
 * @returns percentage of readiness
 */
export function calculateCILSB1Readiness(scores: Record<string, number>): number {
  // CILS B1 requirements
  const requirements: Record<string, number> = {
    'reading': 70,
    'writing': 70,
    'listening': 70,
    'speaking': 70,
    'grammar': 65,
    'vocabulary': 65,
    'culture': 60,
    'citizenship': 70
  };
  
  let totalScore = 0;
  let totalRequired = 0;
  
  Object.entries(requirements).forEach(([skill, requiredScore]) => {
    const userScore = scores[skill] || 0;
    totalScore += Math.min(userScore, requiredScore);
    totalRequired += requiredScore;
  });
  
  return Math.round((totalScore / totalRequired) * 100);
}
