
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Calendar, Check, Clock, Star, Trophy } from 'lucide-react';
import { ItalianTestSection, AIGeneratedQuestion, ItalianLevel } from '@/types/italian-types';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import ConfidenceIndicator from '../ai/ConfidenceIndicator';
import QuestionAnsweringComponent from './QuestionAnsweringComponent';

interface QuestionOfTheDayProps {
  userId: string;
  onComplete?: (section: ItalianTestSection, score: number) => void;
}

const QuestionOfTheDay: React.FC<QuestionOfTheDayProps> = ({ userId, onComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<ItalianTestSection>('grammar');
  const [question, setQuestion] = useState<AIGeneratedQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [dailySelectionsUsed, setDailySelectionsUsed] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(0.75); // Default confidence score

  const { generateQuestions, isGenerating } = useAIUtils();
  const { toast } = useToast();

  const MAX_DAILY_SELECTIONS = 1; // Free users can select one question per day
  const difficulty: ItalianLevel = 'B1'; // CILS B1 Italian Language Test level

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Fetch user's daily question selection on component mount
  useEffect(() => {
    const fetchDailySelection = async () => {
      // This would typically come from an API or database
      // Mocking for demonstration purposes
      setDailySelectionsUsed(0); // Assume user hasn't used their daily selection yet
      setIsCompleted(false);
    };

    fetchDailySelection();
  }, [userId]);

  // Generate a question for the selected category
  const generateQuestion = async () => {
    if (dailySelectionsUsed >= MAX_DAILY_SELECTIONS) {
      toast({
        title: "Daily limit reached",
        description: "Free users can only select one question per day. Upgrade to premium for unlimited access.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await generateQuestions({
        contentTypes: [selectedCategory],
        difficulty: difficulty,
        isCitizenshipFocused: true,
        count: 1,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.questions.length > 0) {
        setQuestion(result.questions[0]);
        
        // Set AI confidence based on the question's complexity and context
        // In a real application, this would come from the AI model
        const randomConfidence = 0.6 + Math.random() * 0.35; // Between 0.6 and 0.95
        setAiConfidence(randomConfidence);
        
        // Increment daily selections used
        setDailySelectionsUsed(prevCount => prevCount + 1);
        
        toast({
          title: "Question generated",
          description: `Your daily ${selectedCategory} question is ready!`,
        });
      } else {
        throw new Error("No questions were generated");
      }
    } catch (error) {
      console.error("Error generating question:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate question",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle question completion
  const handleQuestionComplete = (questionScore: number) => {
    setScore(questionScore);
    setIsCompleted(true);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(selectedCategory, questionScore);
    }
    
    toast({
      title: "Question completed",
      description: `You scored ${questionScore}% on today's question!`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Question of the Day</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {today}
            </Badge>
          </div>
          <CardDescription>
            Select one category to practice today. Free users get 1 question per day.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Daily Selections</p>
                <div className="flex items-center gap-2">
                  <Progress value={(dailySelectionsUsed / MAX_DAILY_SELECTIONS) * 100} className="w-[100px]" />
                  <span className="text-xs text-muted-foreground">{dailySelectionsUsed}/{MAX_DAILY_SELECTIONS}</span>
                </div>
              </div>
              
              {question && (
                <div className="text-right">
                  <p className="text-sm font-medium">AI Confidence</p>
                  <ConfidenceIndicator score={aiConfidence} className="w-32" />
                </div>
              )}
            </div>
            
            {!question ? (
              <Tabs defaultValue="grammar" value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ItalianTestSection)}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="grammar">Grammar</TabsTrigger>
                  <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                  <TabsTrigger value="reading">Reading</TabsTrigger>
                  <TabsTrigger value="listening">Listening</TabsTrigger>
                </TabsList>
                
                <TabsContent value="grammar">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Grammar Practice</CardTitle>
                      <CardDescription>Test your understanding of Italian grammar rules</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Focus on verb conjugations, prepositions, articles, and sentence structure.
                        Perfect for citizenship test preparation.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={generateQuestion} disabled={isLoading || isGenerating || dailySelectionsUsed >= MAX_DAILY_SELECTIONS}>
                        {isLoading || isGenerating ? "Generating..." : "Generate Question"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="vocabulary">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vocabulary Practice</CardTitle>
                      <CardDescription>Expand your Italian vocabulary knowledge</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Learn essential vocabulary for daily conversation, citizenship topics, 
                        cultural terms, and more.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={generateQuestion} disabled={isLoading || isGenerating || dailySelectionsUsed >= MAX_DAILY_SELECTIONS}>
                        {isLoading || isGenerating ? "Generating..." : "Generate Question"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reading">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Reading Comprehension</CardTitle>
                      <CardDescription>Improve your Italian reading skills</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Practice reading authentic Italian texts and answer comprehension questions.
                        Focus on citizenship-related content.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={generateQuestion} disabled={isLoading || isGenerating || dailySelectionsUsed >= MAX_DAILY_SELECTIONS}>
                        {isLoading || isGenerating ? "Generating..." : "Generate Question"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="listening">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Listening Practice</CardTitle>
                      <CardDescription>Train your Italian listening skills</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Listen to Italian audio clips and answer questions about the content.
                        Important for the CILS B1 citizenship test.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={generateQuestion} disabled={isLoading || isGenerating || dailySelectionsUsed >= MAX_DAILY_SELECTIONS}>
                        {isLoading || isGenerating ? "Generating..." : "Generate Question"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="capitalize">
                    {selectedCategory}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> CILS B1 Level
                    </Badge>
                    {isCompleted && (
                      <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800">
                        <Check className="h-3 w-3" /> Completed
                      </Badge>
                    )}
                  </div>
                </div>
                
                <QuestionAnsweringComponent 
                  questions={[question]}
                  contentType={selectedCategory}
                  onComplete={handleQuestionComplete}
                  difficultyLevel={difficulty}
                  userId={userId}
                />
                
                {isCompleted && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" /> 
                        Your Result
                      </h3>
                      <Badge variant="outline">{score}%</Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {score >= 80 ? (
                        <p className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          Excellent! You've mastered this concept.
                        </p>
                      ) : score >= 60 ? (
                        <p>Good job! Keep practicing to improve further.</p>
                      ) : (
                        <p className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          This area needs more practice. Consider reviewing the related materials.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {isCompleted && (
                  <Button onClick={() => setQuestion(null)} variant="outline" className="w-full">
                    Return to Category Selection
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionOfTheDay;
