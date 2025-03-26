
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Target, TrendingUp, Lightbulb, RefreshCw, ChevronRight } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relevance: number;
  masteryLevel: number;
  estimatedTime: string;
  category: string;
  isNew?: boolean;
}

interface LearningGoal {
  id: string;
  title: string;
  progress: number;
  topics: string[];
}

const LearningPathRecommendations = () => {
  const [recommendedTopics, setRecommendedTopics] = useState<Topic[]>([]);
  const [knowledgeGaps, setKnowledgeGaps] = useState<Topic[]>([]);
  const [discoveryTopics, setDiscoveryTopics] = useState<Topic[]>([]);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recommended");
  
  const { generateText } = useAI();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchRecommendations();
  }, []);
  
  const fetchRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, these would be generated based on user data
      // For now, we'll use mock data for demonstration
      
      // Simulated delay to represent API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRecommendedTopics([
        {
          id: "1",
          title: "Present Tense Verb Conjugation",
          description: "Practice conjugating regular -are, -ere, and -ire verbs in the present tense",
          difficulty: "intermediate",
          relevance: 95,
          masteryLevel: 62,
          estimatedTime: "45 min",
          category: "Grammar"
        },
        {
          id: "2",
          title: "Food Vocabulary Expansion",
          description: "Learn common food items, restaurant phrases, and cooking terms",
          difficulty: "beginner",
          relevance: 88,
          masteryLevel: 45,
          estimatedTime: "30 min",
          category: "Vocabulary"
        },
        {
          id: "3",
          title: "Listening Comprehension: Everyday Conversations",
          description: "Practice understanding natural conversations between native speakers",
          difficulty: "intermediate",
          relevance: 85,
          masteryLevel: 30,
          estimatedTime: "60 min",
          category: "Listening"
        }
      ]);
      
      setKnowledgeGaps([
        {
          id: "4",
          title: "Irregular Past Participles",
          description: "Review and practice using irregular past participles in different contexts",
          difficulty: "advanced",
          relevance: 92,
          masteryLevel: 15,
          estimatedTime: "40 min",
          category: "Grammar"
        },
        {
          id: "5",
          title: "Subjunctive Mood",
          description: "Learn when and how to use the subjunctive mood in Italian",
          difficulty: "advanced",
          relevance: 90,
          masteryLevel: 10,
          estimatedTime: "60 min",
          category: "Grammar"
        }
      ]);
      
      setDiscoveryTopics([
        {
          id: "6",
          title: "Regional Dialects Introduction",
          description: "Explore the different dialects and regional variations of Italian",
          difficulty: "advanced",
          relevance: 75,
          masteryLevel: 0,
          estimatedTime: "50 min",
          category: "Culture",
          isNew: true
        },
        {
          id: "7",
          title: "Italian Gestures",
          description: "Learn common Italian hand gestures and their meanings",
          difficulty: "beginner",
          relevance: 80,
          masteryLevel: 0,
          estimatedTime: "25 min",
          category: "Culture",
          isNew: true
        },
        {
          id: "8",
          title: "Business Italian",
          description: "Learn vocabulary and phrases for professional settings",
          difficulty: "intermediate",
          relevance: 70,
          masteryLevel: 0,
          estimatedTime: "45 min",
          category: "Vocabulary",
          isNew: true
        }
      ]);
      
      setLearningGoals([
        {
          id: "1",
          title: "Reach Conversational Fluency",
          progress: 65,
          topics: ["1", "3", "7"]
        },
        {
          id: "2",
          title: "Master Italian Grammar Basics",
          progress: 40,
          topics: ["1", "4", "5"]
        }
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshRecommendations = () => {
    fetchRecommendations();
  };
  
  const DifficultyBadge = ({ difficulty }: { difficulty: Topic['difficulty'] }) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-blue-100 text-blue-800",
      advanced: "bg-purple-100 text-purple-800"
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[difficulty]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };
  
  const TopicCard = ({ topic }: { topic: Topic }) => {
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{topic.title}</CardTitle>
              <CardDescription className="mt-1">{topic.description}</CardDescription>
            </div>
            {topic.isNew && (
              <Badge className="bg-amber-500">New</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Difficulty:</span>
              <DifficultyBadge difficulty={topic.difficulty} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Category:</span>
              <Badge variant="outline">{topic.category}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Relevance:</span>
              <span className="text-sm font-medium">{topic.relevance}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Est. Time:</span>
              <span className="text-sm font-medium">{topic.estimatedTime}</span>
            </div>
          </div>
          
          {topic.masteryLevel > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Mastery:</span>
                <span>{topic.masteryLevel}%</span>
              </div>
              <Progress value={topic.masteryLevel} />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="sm">
            <span>Study Now</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Learning Path</CardTitle>
            <CardDescription>
              Personalized recommendations based on your progress and goals
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mx-4">
          <TabsTrigger value="recommended">
            <Target className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Recommended</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge-gaps">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Knowledge Gaps</span>
          </TabsTrigger>
          <TabsTrigger value="discover">
            <Lightbulb className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Discover</span>
          </TabsTrigger>
          <TabsTrigger value="goals">
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended" className="px-4 py-2">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Based on your learning history, we recommend these topics to study next:
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              recommendedTopics.map(topic => (
                <TopicCard key={topic.id} topic={topic} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="knowledge-gaps" className="px-4 py-2">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              These areas need more attention based on your quiz performance:
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              knowledgeGaps.map(topic => (
                <TopicCard key={topic.id} topic={topic} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="discover" className="px-4 py-2">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Explore these new topics that might interest you:
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              discoveryTopics.map(topic => (
                <TopicCard key={topic.id} topic={topic} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="goals" className="px-4 py-2">
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground mb-4">
              Your progress toward learning goals:
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              learningGoals.map(goal => (
                <Card key={goal.id} className="p-4">
                  <div className="font-medium mb-2">{goal.title}</div>
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs">
                      <span>Progress:</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Recommended topics for this goal:
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recommendedTopics
                      .concat(knowledgeGaps)
                      .filter(topic => goal.topics.includes(topic.id))
                      .map(topic => (
                        <Badge key={topic.id} variant="outline">{topic.title}</Badge>
                      ))
                    }
                  </div>
                </Card>
              ))
            )}
            <Button className="w-full">Create New Learning Goal</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LearningPathRecommendations;
