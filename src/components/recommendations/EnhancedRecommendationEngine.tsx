
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { personalizedLearningService } from '@/services/personalizedLearningService';
import { BookOpen, Brain, Calendar, Clock, FlaskConical, LightbulbIcon, Target, Zap } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Recommendation {
  type: string;
  focus: string;
  reason: string;
  priority: string;
  [key: string]: any;
}

interface LearningInsight {
  learningPatterns: {
    consistencyScore: number;
    sessionLengthPreference: string;
    frequencyPattern: string;
  };
  learningVelocity: {
    speed: string;
    averageItemsPerDay: number;
    trend: string;
  };
  optimalConditions: {
    optimalTimeOfDay: string;
    bestDays: string[];
    sessionLength: number;
  };
  knowledgeGaps: Array<{
    tag: string;
    count: number;
    difficulty: string[];
    percentage: number;
  }>;
  strengths: Array<{
    category: string;
    masteryPercentage: number;
    totalQuestions: number;
  }>;
  personaType: string;
}

const EnhancedRecommendationEngine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<LearningInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");
  
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Load personalized insights
        const insightsData = await personalizedLearningService.generatePersonalizedInsights(user.id);
        setInsights(insightsData);
        
        // Load recommendations
        const recommendationsData = await personalizedLearningService.generateContentRecommendations(user.id);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error("Error loading recommendations:", error);
        toast({
          title: "Error loading recommendations",
          description: "We couldn't load your personalized recommendations. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecommendations();
  }, [user]);
  
  const getIconForRecommendationType = (type: string) => {
    switch (type) {
      case 'knowledge_gap':
        return <Brain className="h-5 w-5 text-yellow-500" />;
      case 'session_type':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'schedule':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'optimal_time':
        return <Zap className="h-5 w-5 text-purple-500" />;
      case 'learning_path':
        return <Target className="h-5 w-5 text-red-500" />;
      case 'content_variety':
        return <BookOpen className="h-5 w-5 text-cyan-500" />;
      default:
        return <LightbulbIcon className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 'medium':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 'low':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };
  
  const getLearnerPersonaDescription = (personaType: string) => {
    switch (personaType) {
      case 'Dedicated Learner':
        return "You have a consistent study habit and dedicate significant time to learning. You thrive on structured, comprehensive content.";
      case 'Curious Explorer':
        return "You enjoy exploring various topics and learning diverse aspects of Italian. Variety keeps you engaged and motivated.";
      case 'Perfectionist':
        return "You focus on mastering content before moving on. You prefer thorough understanding over rapid progress.";
      case 'Intensive Studier':
        return "You prefer intensive study sessions, even if less frequent. You can cover significant material in a single session.";
      case 'Quick Practicer':
        return "You consistently engage in short, focused practice sessions. Regular repetition works well for your learning style.";
      case 'Casual Learner':
        return "You approach learning at a relaxed pace, engaging when time allows. Flexibility in learning structure suits you best.";
      default:
        return "Your learning style is still emerging. As you engage more with the platform, we'll provide more tailored insights.";
    }
  };
  
  const getVelocityTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <span className="text-green-500">↑</span>;
      case 'declining':
        return <span className="text-red-500">↓</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Enhanced Learning Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions based on your learning patterns and progress
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="daily">Today's Focus</TabsTrigger>
              <TabsTrigger value="insights">Learning Insights</TabsTrigger>
              <TabsTrigger value="plan">Study Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
                    <div className="h-4 w-48 bg-primary/20 rounded mb-2"></div>
                    <div className="h-3 w-36 bg-primary/10 rounded"></div>
                  </div>
                </div>
              ) : recommendations.length > 0 ? (
                <>
                  {recommendations.slice(0, 3).map((recommendation, index) => (
                    <Card key={index} className="border-l-4" style={{ borderLeftColor: recommendation.priority === 'high' ? '#ef4444' : '#3b82f6' }}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            {getIconForRecommendationType(recommendation.type)}
                            <div>
                              <h4 className="font-medium mb-1">{recommendation.focus}</h4>
                              <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
                            </div>
                          </div>
                          <Badge className={`ml-2 ${getPriorityColor(recommendation.priority)}`}>
                            {recommendation.priority}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 py-2 bg-muted/50">
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Start Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Continue using the platform to receive personalized recommendations.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
                    <div className="h-4 w-48 bg-primary/20 rounded mb-2"></div>
                    <div className="h-3 w-36 bg-primary/10 rounded"></div>
                  </div>
                </div>
              ) : insights ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Learner Profile</h3>
                      <Card className="bg-primary/5">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                              <Brain className="h-10 w-10 text-primary/70" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{insights.personaType}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {getLearnerPersonaDescription(insights.personaType)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Consistency</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="mb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Consistency Score</span>
                              <span className="text-sm">{insights.learningPatterns.consistencyScore}%</span>
                            </div>
                            <Progress value={insights.learningPatterns.consistencyScore} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Session Preference</p>
                              <p className="font-medium capitalize">{insights.learningPatterns.sessionLengthPreference}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Study Pattern</p>
                              <p className="font-medium capitalize">{insights.learningPatterns.frequencyPattern}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Learning Velocity</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Learning Speed</p>
                              <p className="font-semibold capitalize">{insights.learningVelocity.speed}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Trend</p>
                              <p className="font-semibold flex items-center justify-end gap-1">
                                {insights.learningVelocity.trend} {getVelocityTrendIcon(insights.learningVelocity.trend)}
                              </p>
                            </div>
                          </div>
                          <Separator className="mb-4" />
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Average Items Per Active Day</p>
                            <p className="text-2xl font-bold">{insights.learningVelocity.averageItemsPerDay}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Optimal Learning Conditions</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Best Time of Day</p>
                              <p className="font-medium">{insights.optimalConditions.optimalTimeOfDay !== 'unknown' ? insights.optimalConditions.optimalTimeOfDay : 'Not enough data'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Ideal Session Length</p>
                              <p className="font-medium">{insights.optimalConditions.sessionLength} minutes</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">Best Days for Study</p>
                            <div className="flex flex-wrap gap-2">
                              {insights.optimalConditions.bestDays.map((day, index) => (
                                <Badge key={index} variant="secondary">{day}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Strengths & Knowledge Gaps</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Top Strengths</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {insights.strengths.length > 0 ? (
                              <ul className="space-y-2">
                                {insights.strengths.map((strength, index) => (
                                  <li key={index} className="flex justify-between items-center">
                                    <span className="text-sm">{strength.category}</span>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                                      {strength.masteryPercentage}%
                                    </Badge>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">Not enough data yet</p>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Knowledge Gaps</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {insights.knowledgeGaps.length > 0 ? (
                              <ul className="space-y-2">
                                {insights.knowledgeGaps.map((gap, index) => (
                                  <li key={index} className="flex justify-between items-center">
                                    <span className="text-sm">{gap.tag}</span>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300">
                                      {gap.percentage}%
                                    </Badge>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">Not enough data yet</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Continue using the platform to generate learning insights.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="plan" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Weekly Study Plan</h3>
                <Button size="sm" variant="outline">Customize</Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
                    <div className="h-4 w-48 bg-primary/20 rounded mb-2"></div>
                    <div className="h-3 w-36 bg-primary/10 rounded"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const isOptimalDay = insights?.optimalConditions?.bestDays?.includes(day) || false;
                    
                    return (
                      <Card key={day} className={isOptimalDay ? 'border-green-500 dark:border-green-700' : ''}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{day}</div>
                            {isOptimalDay && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                                Optimal Day
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {insights?.optimalConditions?.optimalTimeOfDay !== 'unknown' 
                                  ? insights?.optimalConditions?.optimalTimeOfDay 
                                  : 'Flexible time'}
                              </span>
                            </div>
                            <div className="text-sm flex items-center gap-2">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {isOptimalDay 
                                  ? `${insights?.learningVelocity?.averageItemsPerDay || 10} items` 
                                  : 'Rest day or light review'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRecommendationEngine;
