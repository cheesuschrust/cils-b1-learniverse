
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AIGeneratedQuestion, 
  ItalianLevel, 
  ItalianTestSection,
  AnswerResults 
} from '@/types/italian-types';
import { useAIUtils } from '@/hooks/useAIUtils';
import QuestionAnsweringComponent from './learning/QuestionAnsweringComponent';
import { Loader2, BookOpen, Mic, FileText, PenTool, Languages } from 'lucide-react';

interface ItalianPracticeComponentProps {
  initialSection?: ItalianTestSection;
  level?: ItalianLevel;
  testSection?: ItalianTestSection;
  isCitizenshipMode?: boolean;
  onComplete?: (results: AnswerResults) => void;
  userId?: string;
}

// Export as named export
export const ItalianPracticeComponent: React.FC<ItalianPracticeComponentProps> = ({
  initialSection = 'grammar',
  level = 'intermediate',
  testSection,
  isCitizenshipMode = false,
  onComplete,
  userId
}) => {
  const [activeTab, setActiveTab] = useState<ItalianTestSection>(initialSection);
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSections, setCompletedSections] = useState<Record<ItalianTestSection, number>>({
    grammar: 0,
    vocabulary: 0,
    culture: 0,
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    citizenship: 0
  });
  
  const { generateQuestions } = useAIUtils();
  
  // Load questions when section changes
  useEffect(() => {
    loadQuestionsForSection(activeTab);
  }, [activeTab]);
  
  // Function to load questions for a specific section
  const loadQuestionsForSection = async (section: ItalianTestSection) => {
    setIsLoading(true);
    try {
      const result = await generateQuestions({
        contentTypes: [section],
        difficulty: level,
        count: 5,
        isCitizenshipFocused: isCitizenshipMode,
        language: 'italian'
      });
      
      if (result && result.questions) {
        setQuestions(result.questions);
      }
    } catch (error) {
      console.error(`Error loading ${section} questions:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle section completion
  const handleSectionComplete = (score: number) => {
    setCompletedSections(prev => ({
      ...prev,
      [activeTab]: score
    }));
    
    if (onComplete) {
      onComplete({score, time: 0});
    }
  };
  
  // Get section icon
  const getSectionIcon = (section: ItalianTestSection) => {
    switch (section) {
      case 'grammar': return <BookOpen className="h-4 w-4" />;
      case 'vocabulary': return <Languages className="h-4 w-4" />;
      case 'listening': return <Mic className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'writing': return <PenTool className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Italian Practice - {level}</CardTitle>
        <CardDescription>
          Practice different aspects of Italian language
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue={initialSection} 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ItalianTestSection)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 w-full">
            <TabsTrigger value="grammar" className="text-xs md:text-sm flex items-center gap-1">
              <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Grammar</span>
            </TabsTrigger>
            
            <TabsTrigger value="vocabulary" className="text-xs md:text-sm flex items-center gap-1">
              <Languages className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Vocabulary</span>
            </TabsTrigger>
            
            <TabsTrigger value="listening" className="text-xs md:text-sm flex items-center gap-1">
              <Mic className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Listening</span>
            </TabsTrigger>
            
            <TabsTrigger value="reading" className="text-xs md:text-sm flex items-center gap-1">
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Reading</span>
            </TabsTrigger>
            
            <TabsTrigger value="writing" className="text-xs md:text-sm flex items-center gap-1">
              <PenTool className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Writing</span>
            </TabsTrigger>
            
            <TabsTrigger value="speaking" className="text-xs md:text-sm flex items-center gap-1">
              <Mic className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Speaking</span>
            </TabsTrigger>
            
            <TabsTrigger value="culture" className="text-xs md:text-sm flex items-center gap-1">
              <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Culture</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
                <p>Loading {activeTab} practice questions...</p>
              </div>
            ) : (
              Object.keys(completedSections).map(section => (
                <TabsContent key={section} value={section} className="mt-0">
                  <QuestionAnsweringComponent 
                    questions={questions}
                    contentType={section as ItalianTestSection}
                    onComplete={handleSectionComplete}
                    difficultyLevel={level}
                    userId={userId}
                  />
                </TabsContent>
              ))
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => loadQuestionsForSection(activeTab)}>
          Refresh Questions
        </Button>
      </CardFooter>
    </Card>
  );
};

// Also export as default
export default ItalianPracticeComponent;
