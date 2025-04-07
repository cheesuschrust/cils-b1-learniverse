
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { supabase } from '@/lib/supabase-client';

interface WritingPrompt {
  id: string;
  title: string;
  instructions: string;
  wordLimit: number;
  minWords: number;
  example?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  timeEstimate: number;
  points: number;
  topics: string[];
}

const WritingModule: React.FC = () => {
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('prompts');
  const [writingProgress, setWritingProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        
        // Using Supabase client to fetch writing prompts
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'writing')
          .order('difficulty', { ascending: true });
          
        if (error) throw error;
        
        // Transform data if necessary
        const transformedData: WritingPrompt[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          instructions: item.content.instructions,
          wordLimit: item.content.wordLimit || 200,
          minWords: item.content.minWords || 50,
          example: item.content.example,
          difficulty: item.difficulty || 'intermediate',
          level: item.content.level || 'B1',
          timeEstimate: item.content.timeEstimate || 20,
          points: item.content.points || 10,
          topics: item.content.topics || [],
        }));
        
        setPrompts(transformedData);
        
        // Fetch user progress for the writing module
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('progress_percentage')
            .eq('user_id', user.id)
            .eq('content_type', 'writing')
            .single();
            
          if (!progressError && progressData) {
            setWritingProgress(progressData.progress_percentage);
          }
        }
      } catch (error) {
        console.error('Error fetching writing prompts:', error);
        toast({
          title: "Error loading prompts",
          description: "Failed to load writing prompts. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [user, toast]);

  useEffect(() => {
    // Count words in user response
    if (userResponse) {
      const words = userResponse.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [userResponse]);

  const handleSelectPrompt = (prompt: WritingPrompt) => {
    if (hasReachedLimit('writingExercises')) {
      toast({
        title: "Daily limit reached",
        description: `You've reached your daily limit of ${getLimit('writingExercises')} writing exercises. Upgrade to premium for unlimited access.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedPrompt(prompt);
    setUserResponse('');
    setWordCount(0);
    setSubmitted(false);
    setFeedback(null);
    setActiveTab('exercise');
    incrementUsage('writingExercises');
  };

  const handleSubmit = async () => {
    if (!selectedPrompt || !user) return;
    
    if (wordCount < selectedPrompt.minWords) {
      toast({
        title: "Not enough words",
        description: `Please write at least ${selectedPrompt.minWords} words.`,
        variant: "warning",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a complete implementation, this would call an AI service for feedback
      // For now, we'll simulate a response

      // Simulated AI feedback - in a real app, you'd call an API or edge function
      setTimeout(() => {
        const simulatedFeedback = `
          <h3>Feedback on your writing</h3>
          <p>Your writing demonstrates a good understanding of the topic. Here are some specific points:</p>
          <ul>
            <li><strong>Strengths:</strong> Good vocabulary use, clear structure, relevant content.</li>
            <li><strong>Areas for improvement:</strong> Work on verb conjugations, article agreement, and sentence variety.</li>
          </ul>
          <p>Overall Score: 75/100</p>
          <p>This is at the B1 level. Continue practicing!</p>
        `;
        
        setFeedback(simulatedFeedback);
        setSubmitted(true);
        
        // Update user progress
        updateProgress(75);
      }, 2000);
    } catch (error) {
      console.error('Error submitting writing:', error);
      toast({
        title: "Error submitting writing",
        description: "Failed to submit your writing. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProgress = async (score: number) => {
    if (!user || !selectedPrompt) return;
    
    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_id', selectedPrompt.id)
        .single();
        
      const progressData = {
        user_id: user.id,
        content_id: selectedPrompt.id,
        content_type: 'writing',
        score: score,
        completed: true,
        answers: { text: userResponse },
        progress_percentage: score
      };
      
      if (fetchError || !existingProgress) {
        // Create new progress entry
        await supabase
          .from('user_progress')
          .insert([progressData]);
      } else {
        // Update existing progress if the new score is better
        if (score > existingProgress.score) {
          await supabase
            .from('user_progress')
            .update(progressData)
            .eq('id', existingProgress.id);
        }
      }
      
      // Update overall writing progress
      const { data: allProgress, error: allProgressError } = await supabase
        .from('user_progress')
        .select('score')
        .eq('user_id', user.id)
        .eq('content_type', 'writing');
        
      if (!allProgressError && allProgress && allProgress.length > 0) {
        const averageScore = allProgress.reduce((sum, item) => sum + item.score, 0) / allProgress.length;
        setWritingProgress(averageScore);
        
        await supabase
          .from('user_stats')
          .update({ writing_score: averageScore })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Writing Practice</h1>
          <p className="text-muted-foreground">Improve your Italian writing skills</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Overall progress:</span>
            <span className="text-sm font-bold">{Math.round(writingProgress)}%</span>
          </div>
          <Progress value={writingProgress} className="w-40 h-2" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="exercise" disabled={!selectedPrompt}>Current Exercise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.length > 0 ? (
              prompts.map((prompt) => (
                <Card key={prompt.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Level: {prompt.level}</span>
                      <span>{prompt.timeEstimate} min</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm mb-4">{prompt.instructions.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <span>Words: {prompt.minWords}-{prompt.wordLimit}</span>
                      <span>{prompt.points} points</span>
                    </div>
                    <Button onClick={() => handleSelectPrompt(prompt)}>Start Exercise</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No writing prompts available.</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-border pt-4 mt-8">
            <h2 className="text-xl font-bold mb-4">Writing Progress</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>Overall Writing Skill</span>
                <div className="flex items-center gap-2">
                  <Progress value={writingProgress} className="w-40 h-2" />
                  <span className="min-w-[40px] text-right">{Math.round(writingProgress)}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Complete more exercises to improve your writing skills and track your progress toward CILS B1 proficiency.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="exercise">
          {selectedPrompt && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPrompt.title}</CardTitle>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Level: {selectedPrompt.level}</span>
                    <span>•</span>
                    <span>{selectedPrompt.timeEstimate} minutes</span>
                    <span>•</span>
                    <span>Words: {selectedPrompt.minWords}-{selectedPrompt.wordLimit}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-medium mb-2">Instructions:</p>
                    <p className="whitespace-pre-line">{selectedPrompt.instructions}</p>
                  </div>
                  
                  {selectedPrompt.example && (
                    <div className="p-4 border border-border rounded-md">
                      <p className="font-medium mb-2">Example:</p>
                      <p className="whitespace-pre-line text-sm">{selectedPrompt.example}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="writing-response" className="font-medium">Your Response:</label>
                      <span className={`text-sm ${wordCount < selectedPrompt.minWords ? 'text-red-500' : wordCount > selectedPrompt.wordLimit ? 'text-amber-500' : 'text-green-500'}`}>
                        {wordCount} / {selectedPrompt.wordLimit} words
                      </span>
                    </div>
                    
                    <Textarea
                      id="writing-response"
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Write your response here..."
                      className="min-h-[200px]"
                      disabled={submitted}
                    />
                  </div>
                  
                  {!submitted ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={wordCount < selectedPrompt.minWords || isSubmitting}
                      className="mt-4"
                    >
                      {isSubmitting ? <><Spinner size="sm" className="mr-2" /> Submitting...</> : 'Submit Response'}
                    </Button>
                  ) : feedback ? (
                    <div className="p-4 bg-accent rounded-md">
                      <div dangerouslySetInnerHTML={{ __html: feedback }} />
                      <Button 
                        onClick={() => {
                          setActiveTab('prompts');
                          setSelectedPrompt(null);
                        }}
                        className="mt-4"
                      >
                        Back to Prompts
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center p-4">
                      <Spinner size="lg" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WritingModule;
