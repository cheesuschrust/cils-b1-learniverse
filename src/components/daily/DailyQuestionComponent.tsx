
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Award, FileText, BookOpen, Headphones, Edit, MessageSquare } from 'lucide-react';
import { AIGeneratedQuestion, ItalianTestSection, ItalianLevel } from '@/types/italian-types';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useToast } from '@/components/ui/use-toast';
import QuestionAnsweringComponent from '@/components/learning/QuestionAnsweringComponent';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';

interface DailyQuestionComponentProps {
  userId?: string;
}

const DailyQuestionComponent: React.FC<DailyQuestionComponentProps> = ({ userId }) => {
  const [selectedCategory, setSelectedCategory] = useState<ItalianTestSection>('vocabulary');
  const [generatedQuestion, setGeneratedQuestion] = useState<AIGeneratedQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ItalianLevel>('intermediate');
  const [showQuestion, setShowQuestion] = useState(false);
  const [lastSelected, setLastSelected] = useState<Date | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number>(0.75);
  const [dailyQuestionCount, setDailyQuestionCount] = useState<Record<ItalianTestSection, number>>({
    vocabulary: 0,
    grammar: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    listening: 0,
    culture: 0,
    citizenship: 0
  });
  
  const { generateQuestions, isGenerating: isAIGenerating } = useAIUtils();
  const { toast } = useToast();
  
  // Initialize from local storage on component mount
  useEffect(() => {
    const storedDate = localStorage.getItem('lastQuestionDate');
    if (storedDate) {
      setLastSelected(new Date(storedDate));
    }
    
    const storedCategory = localStorage.getItem('lastQuestionCategory');
    if (storedCategory) {
      setSelectedCategory(storedCategory as ItalianTestSection);
    }
    
    const storedCounts = localStorage.getItem('dailyQuestionCounts');
    if (storedCounts) {
      setDailyQuestionCount(JSON.parse(storedCounts));
    }
  }, []);
  
  // Check if the user has already selected today's question
  const isQuestionAvailableToday = (): boolean => {
    if (!lastSelected) return true;
    
    const today = new Date();
    const lastDate = new Date(lastSelected);
    
    return today.getDate() !== lastDate.getDate() || 
           today.getMonth() !== lastDate.getMonth() || 
           today.getFullYear() !== lastDate.getFullYear();
  };
  
  // Get the total questions used today
  const getTotalQuestionsUsed = (): number => {
    return Object.values(dailyQuestionCount).reduce((sum, count) => sum + count, 0);
  };
  
  // Check if the user has reached their daily limit
  const hasReachedDailyLimit = (): boolean => {
    // For demo purposes, we'll set a limit of 1 question per day for free users
    // This would be replaced with a check against the user's subscription status
    return getTotalQuestionsUsed() >= 1;
  };
  
  // Handle category selection
  const handleCategorySelect = (category: ItalianTestSection) => {
    setSelectedCategory(category);
    
    // Adjust AI confidence based on category
    switch(category) {
      case 'vocabulary':
        setAiConfidence(0.9);
        break;
      case 'grammar':
        setAiConfidence(0.85);
        break;
      case 'culture':
      case 'citizenship':
        setAiConfidence(0.78);
        break;
      case 'reading':
        setAiConfidence(0.82);
        break;
      case 'writing':
        setAiConfidence(0.75);
        break;
      case 'listening':
        setAiConfidence(0.72);
        break;
      case 'speaking':
        setAiConfidence(0.7);
        break;
      default:
        setAiConfidence(0.75);
    }
  };
  
  // Generate a question in the selected category
  const handleGenerateQuestion = async () => {
    if (hasReachedDailyLimit() && !isQuestionAvailableToday()) {
      toast({
        title: "Daily Limit Reached",
        description: "You've reached your daily question limit. Upgrade to premium for unlimited questions!",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate questions using the AI Utils
      const result = await generateQuestions({
        contentTypes: [selectedCategory],
        difficulty: selectedDifficulty,
        count: 1,
        isCitizenshipFocused: true,
        language: 'both'
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.questions && result.questions.length > 0) {
        setGeneratedQuestion(result.questions[0]);
        setShowQuestion(true);
        
        // Update local storage for daily tracking
        const today = new Date();
        localStorage.setItem('lastQuestionDate', today.toISOString());
        localStorage.setItem('lastQuestionCategory', selectedCategory);
        
        // Update question count for this category
        const updatedCounts = {
          ...dailyQuestionCount,
          [selectedCategory]: dailyQuestionCount[selectedCategory] + 1
        };
        setDailyQuestionCount(updatedCounts);
        localStorage.setItem('dailyQuestionCounts', JSON.stringify(updatedCounts));
        
        setLastSelected(today);
      } else {
        throw new Error("No questions were generated");
      }
    } catch (error) {
      console.error("Error generating question:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate a question. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle question completion
  const handleQuestionComplete = (score: number) => {
    toast({
      title: "Question Completed",
      description: `You scored ${score}%. Great job!`,
      variant: "success"
    });
    
    setShowQuestion(false);
    setGeneratedQuestion(null);
  };
  
  const getCategoryIcon = (category: ItalianTestSection) => {
    switch(category) {
      case 'vocabulary': return <BookOpen className="h-4 w-4" />;
      case 'grammar': return <FileText className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'writing': return <Edit className="h-4 w-4" />;
      case 'listening': return <Headphones className="h-4 w-4" />;
      case 'speaking': return <MessageSquare className="h-4 w-4" />;
      case 'culture':
      case 'citizenship': return <Award className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Question of the Day</CardTitle>
              <CardDescription>
                Improve your Italian skills with daily practice for the CILS B1 citizenship test
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Daily Reset: 24h</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {showQuestion && generatedQuestion ? (
            <QuestionAnsweringComponent 
              questions={[generatedQuestion]} 
              contentType={selectedCategory}
              onComplete={handleQuestionComplete}
              difficultyLevel={selectedDifficulty}
              userId={userId}
            />
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Select a Category</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a category for today's practice question
                </p>
                
                <Tabs defaultValue={selectedCategory} onValueChange={(value) => handleCategorySelect(value as ItalianTestSection)}>
                  <TabsList className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8">
                    <TabsTrigger value="vocabulary" className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Vocabulary</span>
                    </TabsTrigger>
                    <TabsTrigger value="grammar" className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Grammar</span>
                    </TabsTrigger>
                    <TabsTrigger value="reading" className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Reading</span>
                    </TabsTrigger>
                    <TabsTrigger value="writing" className="flex items-center space-x-1">
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Writing</span>
                    </TabsTrigger>
                    <TabsTrigger value="listening" className="flex items-center space-x-1">
                      <Headphones className="h-4 w-4" />
                      <span className="hidden sm:inline">Listening</span>
                    </TabsTrigger>
                    <TabsTrigger value="speaking" className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Speaking</span>
                    </TabsTrigger>
                    <TabsTrigger value="culture" className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span className="hidden sm:inline">Culture</span>
                    </TabsTrigger>
                    <TabsTrigger value="citizenship" className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span className="hidden sm:inline">Citizenship</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(selectedCategory)}
                        <h3 className="font-medium capitalize">{selectedCategory}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">AI Confidence:</span>
                        <ConfidenceIndicator score={aiConfidence} className="w-32" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedCategory === 'vocabulary' && "Test your Italian vocabulary knowledge with multiple choice questions."}
                      {selectedCategory === 'grammar' && "Practice Italian grammar rules and sentence structures."}
                      {selectedCategory === 'reading' && "Improve your reading comprehension skills with Italian texts."}
                      {selectedCategory === 'writing' && "Practice writing in Italian with guided prompts and feedback."}
                      {selectedCategory === 'listening' && "Test your ability to understand spoken Italian."}
                      {selectedCategory === 'speaking' && "Practice speaking Italian with pronunciation feedback."}
                      {selectedCategory === 'culture' && "Learn about Italian culture, history and traditions."}
                      {selectedCategory === 'citizenship' && "Prepare for the citizenship test with specific questions."}
                    </p>
                  </div>
                </Tabs>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {hasReachedDailyLimit() && !isQuestionAvailableToday() ? (
                    <span className="text-amber-500">
                      You've reached your daily free question limit. Check back tomorrow or upgrade to premium!
                    </span>
                  ) : (
                    <span>
                      Free tier: {getTotalQuestionsUsed()}/1 questions today
                    </span>
                  )}
                </div>
                <Button 
                  onClick={handleGenerateQuestion} 
                  disabled={isGenerating || isAIGenerating || (hasReachedDailyLimit() && !isQuestionAvailableToday())}
                  className="w-full sm:w-auto"
                >
                  {isGenerating || isAIGenerating ? "Generating..." : "Generate Daily Question"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-4 justify-between">
          <div className="text-sm text-muted-foreground">
            <span>Level: <span className="font-medium">{selectedDifficulty}</span></span>
          </div>
          <div className="text-sm text-muted-foreground">
            Aligned with CILS B1 requirements
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DailyQuestionComponent;
