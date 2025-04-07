
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase-client';
import { Textarea } from '@/components/ui/textarea';

interface WritingExercise {
  id: string;
  title: string;
  prompt: string;
  examples?: string[];
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number; // in minutes
  points: number;
  wordLimit?: number;
  criteria?: string[];
}

const WritingModule: React.FC = () => {
  const [exercises, setExercises] = useState<WritingExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<WritingExercise | null>(null);
  const [userResponse, setUserResponse] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exercises');
  const [writingProgress, setWritingProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasReachedLimit, getLimit, incrementUsage } = useFeatureLimits();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        
        // Using Supabase client to fetch writing exercises
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'writing')
          .order('difficulty', { ascending: true });
          
        if (error) throw error;
        
        // Transform data to match our WritingExercise interface
        const transformedData: WritingExercise[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          prompt: item.content.prompt,
          examples: item.content.examples || [],
          level: item.content.level || 'B1',
          difficulty: item.difficulty || 'intermediate',
          timeEstimate: item.content.timeEstimate || 20,
          points: item.content.points || 10,
          wordLimit: item.content.wordLimit || 150,
          criteria: item.content.criteria || []
        }));
        
        setExercises(transformedData);
        
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
        console.error('Error fetching writing exercises:', error);
        toast({
          title: "Error loading exercises",
          description: "Failed to load writing exercises. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [user, toast]);

  const handleSelectExercise = (exercise: WritingExercise) => {
    if (hasReachedLimit('writingExercises')) {
      toast({
        title: "Daily limit reached",
        description: `You've reached your daily limit of ${getLimit('writingExercises')} writing exercises. Upgrade to premium for unlimited access.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedExercise(exercise);
    setUserResponse('');
    setSubmitted(false);
    setFeedback(null);
    setActiveTab('exercise');
    incrementUsage('writingExercises');
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setUserResponse(text);
    
    // Count words
    const words = text.trim().split(/\s+/);
    setWordCount(text.trim().length > 0 ? words.length : 0);
  };

  const handleSubmit = async () => {
    if (!selectedExercise) return;
    
    setSubmitted(true);
    
    try {
      // In a real implementation, this would send the response to an AI service
      // for evaluation and feedback
      
      // Simulate AI feedback with a timeout
      setTimeout(() => {
        const simulatedFeedback = `
          Your response shows good understanding of the topic. 
          
          Strengths:
          - Clear structure
          - Good vocabulary usage
          - Relevant points
          
          Areas to improve:
          - Watch out for agreement errors
          - Consider using more connectors
          - Add more specific examples
          
          Overall score: B1 level achieved
        `;
        
        setFeedback(simulatedFeedback);
      }, 1500);
      
      // Update user progress
      if (user) {
        try {
          const { data: existingProgress, error: fetchError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('content_id', selectedExercise.id)
            .single();
            
          const progressData = {
            user_id: user.id,
            content_id: selectedExercise.id,
            content_type: 'writing',
            score: 75, // Simulated score, in a real implementation would come from AI evaluation
            completed: true,
            answers: [userResponse],
            progress_percentage: 75
          };
          
          if (fetchError || !existingProgress) {
            // Create new progress entry
            await supabase
              .from('user_progress')
              .insert([progressData]);
          } else {
            // Update existing progress if the new score is better
            if (75 > existingProgress.score) {
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
      }
    } catch (error) {
      console.error('Error submitting writing response:', error);
      toast({
        title: "Error",
        description: "Failed to submit your writing response. Please try again.",
        variant: "destructive",
      });
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
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="exercise" disabled={!selectedExercise}>Current Exercise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <Card key={exercise.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Level: {exercise.level}</span>
                      <span>{exercise.timeEstimate} min</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm mb-4">{exercise.prompt.substring(0, 100)}...</p>
                    <Button onClick={() => handleSelectExercise(exercise)}>Start Exercise</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No writing exercises available.</p>
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
          {selectedExercise && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedExercise.title}</CardTitle>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Level: {selectedExercise.level}</span>
                    <span>•</span>
                    <span>{selectedExercise.timeEstimate} minutes</span>
                    <span>•</span>
                    <span>Word limit: {selectedExercise.wordLimit}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="whitespace-pre-line">{selectedExercise.prompt}</p>
                  </div>
                  
                  {selectedExercise.examples && selectedExercise.examples.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">Examples:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedExercise.examples.map((example, index) => (
                          <li key={index} className="text-sm text-muted-foreground">{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedExercise.criteria && selectedExercise.criteria.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">Evaluation Criteria:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedExercise.criteria.map((criterion, index) => (
                          <li key={index} className="text-sm text-muted-foreground">{criterion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-medium">Your Response:</h3>
                      <span className={`text-sm ${wordCount > (selectedExercise.wordLimit || 0) ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {wordCount} / {selectedExercise.wordLimit} words
                      </span>
                    </div>
                    <Textarea 
                      value={userResponse}
                      onChange={handleResponseChange}
                      placeholder="Write your response here in Italian..."
                      className="min-h-[200px]"
                      disabled={submitted}
                    />
                  </div>
                  
                  {!submitted ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={userResponse.trim().length < 10}
                      className="mt-4"
                    >
                      Submit Response
                    </Button>
                  ) : feedback ? (
                    <div className="p-4 bg-accent rounded-md">
                      <h3 className="text-lg font-medium mb-2">Feedback</h3>
                      <div className="whitespace-pre-line text-sm mb-4">{feedback}</div>
                      <Button 
                        onClick={() => {
                          setActiveTab('exercises');
                          setSelectedExercise(null);
                        }}
                      >
                        Back to Exercises
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center p-4">
                      <Spinner />
                      <span className="ml-2">Analyzing your response...</span>
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
