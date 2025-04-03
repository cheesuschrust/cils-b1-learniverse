
import { analyticsService } from './AnalyticsService';
import { DateRange } from '@/types/analytics';

/**
 * Service that provides personalized learning recommendations based on user analytics
 */
class PersonalizedLearningService {
  /**
   * Generate personalized learning insights based on user analytics
   */
  async generatePersonalizedInsights(userId: string): Promise<any> {
    try {
      // Get recent user activity data for the last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const dateRange: DateRange = {
        from: thirtyDaysAgo,
        to: today
      };
      
      // Collect analytics data in parallel
      const [
        activityData,
        knowledgeGaps,
        categoryPerformance,
        sessionStats
      ] = await Promise.all([
        analyticsService.getUserActivityData(userId, dateRange),
        analyticsService.getKnowledgeGaps(userId, dateRange),
        analyticsService.getPerformanceByCategory(userId, dateRange),
        analyticsService.getSessionStatistics(userId, dateRange)
      ]);
      
      // Identify learning patterns
      const learningPatterns = this.analyzeLearningPatterns(activityData, sessionStats);
      
      // Calculate learning velocity
      const learningVelocity = this.calculateLearningVelocity(activityData);
      
      // Identify optimal learning conditions
      const optimalConditions = this.identifyOptimalConditions(activityData, sessionStats);
      
      return {
        learningPatterns,
        learningVelocity,
        optimalConditions,
        knowledgeGaps: knowledgeGaps.slice(0, 5), // Top 5 knowledge gaps
        strengths: this.identifyStrengths(categoryPerformance),
        personaType: this.determineLearnerPersona(activityData, categoryPerformance, sessionStats)
      };
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      throw error;
    }
  }
  
  /**
   * Analyze learning patterns from user activity
   */
  private analyzeLearningPatterns(activityData: any[], sessionStats: any): any {
    // Calculate consistency score (0-100)
    const activeDays = activityData.filter(day => day.total > 0).length;
    const totalDays = activityData.length;
    const consistencyScore = Math.round((activeDays / totalDays) * 100);
    
    // Determine session length preference
    const sessionLengthPreference = sessionStats.averageSessionLength <= 10 
      ? 'short'
      : sessionStats.averageSessionLength <= 25
        ? 'medium'
        : 'long';
    
    // Determine frequency pattern
    const frequencyPattern = activeDays <= Math.floor(totalDays * 0.3)
      ? 'infrequent'
      : activeDays <= Math.floor(totalDays * 0.7)
        ? 'regular'
        : 'frequent';
        
    return {
      consistencyScore,
      sessionLengthPreference,
      frequencyPattern
    };
  }
  
  /**
   * Calculate learning velocity based on activity data
   */
  private calculateLearningVelocity(activityData: any[]): any {
    const activeData = activityData.filter(day => day.total > 0);
    if (activeData.length === 0) return { speed: 'undetermined', trend: 'stable' };
    
    // Calculate content completion rate
    const itemsPerDay = activeData.map(day => day.total);
    const averageItemsPerDay = itemsPerDay.reduce((sum, items) => sum + items, 0) / activeData.length;
    
    // Determine speed category
    let speed = 'medium';
    if (averageItemsPerDay < 10) speed = 'slow';
    if (averageItemsPerDay > 30) speed = 'fast';
    
    // Calculate trend (improving, stable, declining)
    let trend = 'stable';
    if (activeData.length >= 7) {
      const recentDays = activeData.slice(-7);
      const olderDays = activeData.slice(-14, -7);
      
      if (olderDays.length > 0) {
        const recentAvg = recentDays.reduce((sum, day) => sum + day.total, 0) / recentDays.length;
        const olderAvg = olderDays.reduce((sum, day) => sum + day.total, 0) / olderDays.length;
        
        if (recentAvg > olderAvg * 1.2) trend = 'improving';
        if (recentAvg < olderAvg * 0.8) trend = 'declining';
      }
    }
    
    return {
      speed,
      averageItemsPerDay: Math.round(averageItemsPerDay),
      trend
    };
  }
  
  /**
   * Identify optimal learning conditions
   */
  private identifyOptimalConditions(activityData: any[], sessionStats: any): any {
    // Find optimal time of day based on performance
    const optimalTimeOfDay = sessionStats.optimalTimeOfDay || 'unknown';
    
    // Find days of week with highest activity and performance
    const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats = [0, 1, 2, 3, 4, 5, 6].map(dayNum => {
      const daysData = activityData.filter(d => new Date(d.date).getDay() === dayNum);
      const totalQuestions = daysData.reduce((sum, d) => sum + d.total, 0);
      const correctAnswers = daysData.reduce((sum, d) => sum + d.correct, 0);
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      
      return {
        day: dayMapping[dayNum],
        totalQuestions,
        accuracy: Math.round(accuracy)
      };
    });
    
    // Sort by accuracy and activity
    const sortedDays = [...dayStats].sort((a, b) => {
      if (b.accuracy === a.accuracy) return b.totalQuestions - a.totalQuestions;
      return b.accuracy - a.accuracy;
    });
    
    const bestDays = sortedDays.slice(0, 3).map(d => d.day);
    
    return {
      optimalTimeOfDay,
      bestDays,
      sessionLength: sessionStats.averageSessionLength,
    };
  }
  
  /**
   * Identify user strengths based on category performance
   */
  private identifyStrengths(categoryPerformance: any[]): any[] {
    // Sort categories by mastery percentage
    return [...categoryPerformance]
      .filter(category => category.total >= 5) // Need minimum sample size
      .sort((a, b) => b.masteryPercentage - a.masteryPercentage)
      .slice(0, 3) // Top 3 strengths
      .map(category => ({
        category: category.category,
        masteryPercentage: category.masteryPercentage,
        totalQuestions: category.total
      }));
  }
  
  /**
   * Determine learner persona type based on analytics
   */
  private determineLearnerPersona(activityData: any[], categoryPerformance: any[], sessionStats: any): string {
    // Analyze learning behaviors to determine persona
    const activeDays = activityData.filter(day => day.total > 0).length;
    const totalDays = activityData.length;
    const consistencyScore = (activeDays / totalDays) * 100;
    
    const totalQuestions = activityData.reduce((sum, day) => sum + day.total, 0);
    const questionVariety = categoryPerformance.length / Math.max(1, categoryPerformance.reduce((sum, cat) => sum + (cat.total >= 3 ? 1 : 0), 0));
    
    // Determine primary persona
    if (consistencyScore > 70 && sessionStats.averageSessionLength > 20) {
      return "Dedicated Learner";
    } else if (questionVariety > 0.8 && totalQuestions > 100) {
      return "Curious Explorer";
    } else if (sessionStats.completionRate > 90) {
      return "Perfectionist";
    } else if (activeDays < totalDays * 0.3 && sessionStats.averageSessionLength > 30) {
      return "Intensive Studier";
    } else if (consistencyScore > 50 && sessionStats.averageSessionLength < 15) {
      return "Quick Practicer";
    } else {
      return "Casual Learner";
    }
  }
  
  /**
   * Generate personalized content recommendations based on user insights
   */
  async generateContentRecommendations(userId: string): Promise<any[]> {
    try {
      const insights = await this.generatePersonalizedInsights(userId);
      const recommendations = [];
      
      // Recommend based on knowledge gaps
      if (insights.knowledgeGaps && insights.knowledgeGaps.length > 0) {
        insights.knowledgeGaps.forEach((gap: any) => {
          recommendations.push({
            type: 'knowledge_gap',
            focus: gap.tag,
            reason: `Fill your knowledge gap in ${gap.tag}`,
            priority: gap.count > 10 ? 'high' : 'medium',
            difficulty: gap.difficulty && gap.difficulty[0] || 'intermediate'
          });
        });
      }
      
      // Recommend based on learning patterns
      if (insights.learningPatterns) {
        const { sessionLengthPreference, frequencyPattern } = insights.learningPatterns;
        
        if (sessionLengthPreference === 'short') {
          recommendations.push({
            type: 'session_type',
            focus: 'Quick Review Sessions',
            reason: 'Matches your preference for shorter study sessions',
            priority: 'medium',
            contentLength: 'short'
          });
        }
        
        if (frequencyPattern === 'infrequent') {
          recommendations.push({
            type: 'schedule',
            focus: 'Consistent Weekly Schedule',
            reason: 'Helps build a more regular study habit',
            priority: 'high',
            frequency: 'scheduled'
          });
        }
      }
      
      // Recommend based on optimal conditions
      if (insights.optimalConditions && insights.optimalConditions.bestDays) {
        recommendations.push({
          type: 'optimal_time',
          focus: 'Optimal Study Schedule',
          reason: `You perform best on ${insights.optimalConditions.bestDays.join(', ')}`,
          priority: 'medium',
          bestDays: insights.optimalConditions.bestDays,
          bestTime: insights.optimalConditions.optimalTimeOfDay
        });
      }
      
      // Add learner persona specific recommendations
      if (insights.personaType) {
        switch (insights.personaType) {
          case 'Dedicated Learner':
            recommendations.push({
              type: 'learning_path',
              focus: 'Advanced Study Path',
              reason: 'Structured advanced content for dedicated learners',
              priority: 'medium',
              pathType: 'comprehensive'
            });
            break;
          case 'Curious Explorer':
            recommendations.push({
              type: 'content_variety',
              focus: 'Diverse Content Topics',
              reason: 'Explore a variety of new topics matching your curious nature',
              priority: 'medium',
              contentVariety: 'high'
            });
            break;
          case 'Quick Practicer':
            recommendations.push({
              type: 'session_type',
              focus: 'Daily Micro-Practice',
              reason: 'Short, focused practice sessions that fit your style',
              priority: 'high',
              sessionLength: 'very_short'
            });
            break;
        }
      }
      
      return recommendations.slice(0, 5); // Return top 5 recommendations
    } catch (error) {
      console.error('Error generating content recommendations:', error);
      return [];
    }
  }
}

export const personalizedLearningService = new PersonalizedLearningService();
export default personalizedLearningService;
