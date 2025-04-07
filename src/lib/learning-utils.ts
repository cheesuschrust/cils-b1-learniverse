
export function calculateLevelProgress(xp: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
} {
  // Define XP thresholds for each level
  // Level formula: level N requires N^2 * 100 XP
  const calculateLevelThreshold = (level: number) => level * level * 100;
  
  // Find the current level
  let level = 1;
  while (xp >= calculateLevelThreshold(level + 1)) {
    level++;
  }
  
  const currentLevelXP = xp;
  const currentLevelThreshold = calculateLevelThreshold(level);
  const nextLevelThreshold = calculateLevelThreshold(level + 1);
  
  // Calculate progress percentage toward next level
  const levelXP = xp - currentLevelThreshold;
  const xpForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progress = Math.min(100, Math.round((levelXP / xpForNextLevel) * 100));
  
  return {
    level,
    currentLevelXP,
    nextLevelXP: nextLevelThreshold,
    progress
  };
}

export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

export function calculateMasteryPercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getSkillLevel(percentage: number): string {
  if (percentage >= 90) return 'Advanced';
  if (percentage >= 70) return 'Intermediate';
  if (percentage >= 50) return 'Basic';
  return 'Beginner';
}
