
/**
 * Helper functions for learning and progress tracking
 */

/**
 * Maps a numerical score to a descriptive proficiency level
 * @param score Numerical score from 0-100
 * @returns String indicating the proficiency level
 */
export function mapScoreToLevel(score: number): string {
  if (score >= 90) return 'Advanced (C1+)';
  if (score >= 80) return 'Upper Intermediate (B2)';
  if (score >= 70) return 'Intermediate (B1)';
  if (score >= 60) return 'Lower Intermediate (A2+)';
  if (score >= 40) return 'Elementary (A2)';
  return 'Beginner (A1)';
}

/**
 * Gets the human-readable name for a skill code
 * @param skillCode The internal skill code
 * @returns Human-readable skill name
 */
export function getSkillName(skillCode: string): string {
  const skillMap: Record<string, string> = {
    'reading': 'Reading',
    'writing': 'Writing',
    'listening': 'Listening',
    'speaking': 'Speaking',
    'grammar': 'Grammar',
    'vocabulary': 'Vocabulary',
    'pronunciation': 'Pronunciation',
    'conversation': 'Conversation',
    'citizenship': 'Citizenship',
    'culture': 'Italian Culture'
  };
  
  return skillMap[skillCode.toLowerCase()] || skillCode;
}

/**
 * Calculates how close a user is to passing the CILS B1 exam
 * @param skills Object with user's current skill scores
 * @returns Percentage readiness (0-100)
 */
export function calculateCILSReadiness(skills: Record<string, number>): number {
  // CILS B1 requirements
  const requirements: Record<string, number> = {
    'reading': 70,
    'writing': 70,
    'listening': 70,
    'speaking': 70,
    'grammar': 65,
    'vocabulary': 65
  };
  
  let totalScore = 0;
  let totalRequired = 0;
  
  Object.entries(requirements).forEach(([skill, requiredScore]) => {
    const userScore = skills[skill] || 0;
    totalScore += Math.min(userScore, requiredScore);
    totalRequired += requiredScore;
  });
  
  return Math.round((totalScore / totalRequired) * 100);
}

/**
 * Calculates the user's appropriate study level
 * @param scores Object with user's current skill scores
 * @returns The recommended study level (A1-C1)
 */
export function calculateUserLevel(scores: Record<string, number>): string {
  const avgScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 
                  Object.values(scores).length;
  
  if (avgScore >= 90) return 'C1';
  if (avgScore >= 80) return 'B2';
  if (avgScore >= 70) return 'B1';
  if (avgScore >= 60) return 'A2+';
  if (avgScore >= 40) return 'A2';
  return 'A1';
}

/**
 * Generates recommendations based on user's current progress
 * @param scores Object with user's current skill scores
 * @returns Array of recommendation objects
 */
export function generateRecommendations(scores: Record<string, number>): Array<{
  area: string,
  recommendation: string,
  priority: 'high' | 'medium' | 'low'
}> {
  const recommendations = [];
  
  // Find the lowest scoring skills
  const sortedSkills = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreA - scoreB);
  
  // Add recommendations for the weakest skills
  if (sortedSkills.length > 0) {
    const [weakestSkill, weakestScore] = sortedSkills[0];
    if (weakestScore < 65) {
      recommendations.push({
        area: getSkillName(weakestSkill),
        recommendation: `Focus on improving your ${weakestSkill.toLowerCase()} skills with daily practice.`,
        priority: 'high'
      });
    }
  }
  
  if (sortedSkills.length > 1) {
    const [secondWeakestSkill, secondWeakestScore] = sortedSkills[1];
    if (secondWeakestScore < 70) {
      recommendations.push({
        area: getSkillName(secondWeakestSkill),
        recommendation: `Work on strengthening your ${secondWeakestSkill.toLowerCase()} abilities with targeted exercises.`,
        priority: 'medium'
      });
    }
  }
  
  // Add general recommendations based on overall level
  const avgScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 
                  Object.values(scores).length;
  
  if (avgScore < 50) {
    recommendations.push({
      area: 'Fundamentals',
      recommendation: 'Build a strong foundation with basic grammar and vocabulary practice.',
      priority: 'high'
    });
  } else if (avgScore >= 50 && avgScore < 70) {
    recommendations.push({
      area: 'Consistency',
      recommendation: 'Maintain a regular study schedule to steadily improve all skill areas.',
      priority: 'medium'
    });
  } else {
    recommendations.push({
      area: 'Advanced Practice',
      recommendation: 'Focus on authentic materials and conversation practice to refine your skills.',
      priority: 'low'
    });
  }
  
  return recommendations;
}

/**
 * Format time spent studying in human-readable format
 * @param minutes Total minutes spent studying
 * @returns Formatted string (e.g., "1h 30m" or "45m")
 */
export function formatStudyTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
}

/**
 * Calculates the estimated completion date for reaching a target score
 * @param currentScore Current score in a particular skill
 * @param targetScore Target score to reach
 * @param weeklyImprovement Average weekly improvement rate
 * @returns Date object representing the estimated completion date
 */
export function estimateCompletionDate(
  currentScore: number,
  targetScore: number,
  weeklyImprovement: number
): Date {
  if (currentScore >= targetScore) return new Date();
  
  const pointsNeeded = targetScore - currentScore;
  const weeksNeeded = pointsNeeded / weeklyImprovement;
  
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + (weeksNeeded * 7));
  
  return completionDate;
}

/**
 * Calculate the total XP needed for a specific level
 * @param level Target level
 * @returns XP required for the level
 */
export function xpForLevel(level: number): number {
  // Exponential XP curve
  return Math.round(100 * Math.pow(level, 1.5));
}

/**
 * Calculate the current level based on total XP
 * @param xp Total XP accumulated
 * @returns Current level
 */
export function levelFromXP(xp: number): number {
  // Inverse of the XP formula
  return Math.floor(Math.pow(xp / 100, 1/1.5));
}

/**
 * Calculate XP progress towards next level
 * @param xp Total XP accumulated
 * @returns Object containing current level, XP for current level, XP needed for next level
 */
export function calculateLevelProgress(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  xpProgress: number;
} {
  const currentLevel = levelFromXP(xp);
  const currentLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const xpProgress = xp - currentLevelXp;
  
  return {
    level: currentLevel,
    currentLevelXp,
    nextLevelXp,
    xpProgress
  };
}
