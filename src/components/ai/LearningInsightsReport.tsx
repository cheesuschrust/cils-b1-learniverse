
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, ArrowUpDown, FileText, RefreshCw, Calendar, Download, Share2 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { format } from 'date-fns';

interface StudySession {
  date: Date;
  duration: number;
  topicsStudied: string[];
  performance: number;
}

interface LearningStyle {
  type: string;
  description: string;
  percentage: number;
}

interface OptimalStudyTime {
  dayOfWeek: string;
  timeOfDay: string;
  effectiveness: number;
}

interface InsightsReport {
  summary: string;
  observations: string[];
  tips: string[];
  generatedAt: Date;
}

const LearningInsightsReport = () => {
  const [activeTab, setActiveTab] = useState('style');
  const [learningStyles, setLearningStyles] = useState<LearningStyle[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [optimalStudyTimes, setOptimalStudyTimes] = useState<OptimalStudyTime[]>([]);
  const [insightsReport, setInsightsReport] = useState<InsightsReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { generateText } = useAI();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchInsights();
  }, []);
  
  const fetchInsights = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, these would be fetched from a backend
      // Here we'll use mock data for demonstration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Learning style data
      setLearningStyles([
        {
          type: "Visual",
          description: "You learn best through visual aids, diagrams, and reading.",
          percentage: 65
        },
        {
          type: "Auditory",
          description: "You benefit from listening to explanations and discussions.",
          percentage: 20
        },
        {
          type: "Interactive",
          description: "You learn effectively through practice exercises and quizzes.",
          percentage: 15
        }
      ]);
      
      // Generate past study sessions
      const now = new Date();
      const pastSessions: StudySession[] = [];
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Skip some days to create a more realistic pattern
        if (i % 4 === 3 || i % 7 === 5) continue;
        
        pastSessions.push({
          date,
          duration: Math.floor(Math.random() * 60) + 15, // 15-75 minutes
          topicsStudied: ["Grammar", "Vocabulary", "Listening"][Math.floor(Math.random() * 3)].split(','),
          performance: Math.floor(Math.random() * 30) + 65 // 65-95%
        });
      }
      
      setStudySessions(pastSessions);
      
      // Optimal study times
      setOptimalStudyTimes([
        {
          dayOfWeek: "Tuesday",
          timeOfDay: "Morning (8-10 AM)",
          effectiveness: 92
        },
        {
          dayOfWeek: "Thursday",
          timeOfDay: "Evening (7-9 PM)",
          effectiveness: 88
        },
        {
          dayOfWeek: "Saturday",
          timeOfDay: "Afternoon (2-4 PM)",
          effectiveness: 85
        }
      ]);
      
      // Insights report
      setInsightsReport({
        summary: "You've made consistent progress in your Italian learning journey, particularly in vocabulary acquisition and grammar comprehension. You maintain a good study streak with occasional gaps on weekends.",
        observations: [
          "You perform 23% better on grammar exercises in the morning compared to evening sessions.",
          "Vocabulary retention increases by 18% when you review words within 48 hours.",
          "Your listening comprehension scores are highest after speaking practice.",
          "You tend to spend more time on topics you already know well, rather than challenging areas."
        ],
        tips: [
          "Schedule your grammar practice sessions in the morning when possible.",
          "Try interleaving different topics in a single study session for better retention.",
          "Increase your focus on the subjunctive mood, which shows lower performance.",
          "Consider adding 5-minute micro-practice sessions throughout your day."
        ],
        generatedAt: new Date()
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Find study session for selected date
  const selectedSession = selectedDate 
    ? studySessions.find(session => 
        session.date.toDateString() === selectedDate.toDateString())
    : null;
  
  // Calculate highlight dates for calendar
  const highlightedDates = studySessions.map(session => ({
    date: session.date,
    performance: session.performance
  }));
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Learning Insights</CardTitle>
            <CardDescription>
              AI-powered analysis of your learning patterns and progress
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchInsights}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mx-4">
          <TabsTrigger value="style">
            <Brain className="h-4 w-4 mr-2" />
            <span>Learning Style</span>
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Clock className="h-4 w-4 mr-2" />
            <span>Study Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="report">
            <FileText className="h-4 w-4 mr-2" />
            <span>Report</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm">
                Based on your learning patterns, we've identified your preferred learning styles:
              </div>
              
              {learningStyles.map((style, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="font-medium">{style.type} Learner</div>
                    <div>{style.percentage}%</div>
                  </div>
                  <Progress value={style.percentage} />
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                </div>
              ))}
              
              <Card className="p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Recommended Learning Activities</h3>
                <ul className="space-y-2 text-sm">
                  <li>Use visual vocabulary cards with images</li>
                  <li>Watch Italian videos with subtitles</li>
                  <li>Practice with interactive grammar exercises</li>
                  <li>Listen to Italian podcasts for passive learning</li>
                </ul>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schedule" className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Your Optimal Study Times</h3>
                <div className="text-sm mb-4">
                  Based on your past performance, these are your most effective study times:
                </div>
                
                <div className="space-y-3">
                  {optimalStudyTimes.map((time, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{time.dayOfWeek}</div>
                          <div className="text-sm text-muted-foreground">{time.timeOfDay}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {time.effectiveness}% Effective
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              <Card className="p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Personalized Study Schedule</h3>
                <div className="text-sm space-y-2">
                  <p>Based on your habits and optimal times, we recommend:</p>
                  <ul className="space-y-1 pl-5 list-disc">
                    <li>Tuesday mornings: Focus on grammar concepts</li>
                    <li>Thursday evenings: Practice conversation and speaking</li>
                    <li>Saturday afternoons: Review vocabulary and listening</li>
                    <li>Add 5-minute reviews throughout the week</li>
                  </ul>
                </div>
              </Card>
              
              <div className="flex justify-center">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Add to Calendar</span>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sessions" className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Your Study Activity</h3>
                  <div className="text-sm text-muted-foreground">
                    Review your past sessions and performance
                  </div>
                </div>
                <StreakCounter showLabel={true} />
              </div>
              
              <div className="flex justify-center">
                <TooltipProvider>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      highlighted: highlightedDates.map(d => d.date)
                    }}
                    modifiersStyles={{
                      highlighted: {
                        backgroundColor: '#e9f5ff',
                        fontWeight: 'bold'
                      }
                    }}
                    components={{
                      DayContent: ({ date, ...props }) => {
                        const highlight = highlightedDates.find(
                          h => h.date.toDateString() === date.toDateString()
                        );
                        
                        return (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div {...props} className="relative w-full h-full flex items-center justify-center">
                                {date.getDate()}
                                {highlight && (
                                  <div 
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full" 
                                    style={{ 
                                      backgroundColor: `rgba(${Math.floor(255 - highlight.performance * 2.55)}, ${Math.floor(highlight.performance * 2.55)}, 0, 0.8)` 
                                    }}
                                  />
                                )}
                              </div>
                            </TooltipTrigger>
                            {highlight && (
                              <TooltipContent>
                                <p>Performance: {highlight.performance}%</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        );
                      }
                    }}
                  />
                </TooltipProvider>
              </div>
              
              {selectedSession ? (
                <Card className="p-4">
                  <h3 className="font-medium">
                    Session on {format(selectedSession.date, 'PPP')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span> {selectedSession.duration} minutes
                    </div>
                    <div>
                      <span className="text-muted-foreground">Performance:</span> {selectedSession.performance}%
                    </div>
                    <div>
                      <span className="text-muted-foreground">Topics:</span> {selectedSession.topicsStudied.join(', ')}
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  Select a date to view session details
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="report" className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : insightsReport ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">Monthly Insights Report</h3>
                  <div className="text-xs text-muted-foreground">
                    Generated on {format(insightsReport.generatedAt, 'PPP')}
                  </div>
                </div>
                
                <Card className="p-4 mt-4 bg-muted/30">
                  <p className="italic">{insightsReport.summary}</p>
                </Card>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Key Observations</h3>
                <ul className="space-y-2">
                  {insightsReport.observations.map((observation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowUpDown className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                      <span className="text-sm">{observation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Personalized Tips</h3>
                <ul className="space-y-2">
                  {insightsReport.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Brain className="h-4 w-4 mt-1 flex-shrink-0 text-purple-500" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download PDF</span>
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Share Report</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No insights report available yet
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LearningInsightsReport;
