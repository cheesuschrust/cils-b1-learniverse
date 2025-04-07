
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

interface ReadingExercise {
  id: string;
  title: string;
  content: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number; // in minutes
  points: number;
}

const ReadingModule: React.FC = () => {
  const [exercises, setExercises] = useState<ReadingExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ReadingExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exercises');
  const [readingProgress, setReadingProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        
        // Using Supabase client to fetch reading exercises
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'reading')
          .order('difficulty', { ascending: true });
          
        if (error) throw error;
        
        // Simulate transformation if your data structure is different
        const transformedData: ReadingExercise[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content.text,
          questions: item.content.questions,
          level: item.content.level || 'B1',
          difficulty: item.difficulty || 'intermediate',
          timeEstimate: item.content.timeEstimate || 15,
          points: item.content.points || 10
        }));
        
        setExercises(transformedData);
        
        // Fetch user progress for the reading module
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('progress_percentage')
            .eq('user_id', user.id)
            .eq('content_type', 'reading')
            .single();
            
          if (!progressError && progressData) {
            setReadingProgress(progressData.progress_percentage);
          }
        }
      } catch (error) {
        console.error('Error fetching reading exercises:', error);
        toast({
          title: "Error loading exercises",
          description: "Failed to load reading exercises. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [user, toast]);

  const handleSelectExercise = (exercise: ReadingExercise) => {
    if (hasReachedLimit('readingExercises')) {
      toast({
        title: "Daily limit reached",
        description: `You've reached your daily limit of ${getLimit('readingExercises')} reading exercises. Upgrade to premium for unlimited access.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedExercise(exercise);
    setUserAnswers(new Array(exercise.questions.length).fill(-1));
    setSubmitted(false);
    setScore(0);
    setActiveTab('exercise');
    incrementUsage('readingExercises');
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!selectedExercise) return;
    
    // Calculate score
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      if (selectedExercise.questions[index] && answer === selectedExercise.questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / selectedExercise.questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    
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
          content_type: 'reading',
          score: calculatedScore,
          completed: true,
          answers: userAnswers,
          progress_percentage: calculatedScore
        };
        
        if (fetchError || !existingProgress) {
          // Create new progress entry
          await supabase
            .from('user_progress')
            .insert([progressData]);
        } else {
          // Update existing progress if the new score is better
          if (calculatedScore > existingProgress.score) {
            await supabase
              .from('user_progress')
              .update(progressData)
              .eq('id', existingProgress.id);
          }
        }
        
        // Update overall reading progress
        const { data: allProgress, error: allProgressError } = await supabase
          .from('user_progress')
          .select('score')
          .eq('user_id', user.id)
          .eq('content_type', 'reading');
          
        if (!allProgressError && allProgress && allProgress.length > 0) {
          const averageScore = allProgress.reduce((sum, item) => sum + item.score, 0) / allProgress.length;
          setReadingProgress(averageScore);
          
          await supabase
            .from('user_stats')
            .update({ reading_score: averageScore })
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
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
          <h1 className="text-3xl font-bold">Reading Practice</h1>
          <p className="text-muted-foreground">Improve your Italian reading comprehension skills</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Overall progress:</span>
            <span className="text-sm font-bold">{Math.round(readingProgress)}%</span>
          </div>
          <Progress value={readingProgress} className="w-40 h-2" />
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
                    <p className="line-clamp-2 text-sm mb-4">{exercise.content.substring(0, 100)}...</p>
                    <Button onClick={() => handleSelectExercise(exercise)}>Start Exercise</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No reading exercises available.</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-border pt-4 mt-8">
            <h2 className="text-xl font-bold mb-4">Reading Progress</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>Overall Reading Skill</span>
                <div className="flex items-center gap-2">
                  <Progress value={readingProgress} className="w-40 h-2" />
                  <span className="min-w-[40px] text-right">{Math.round(readingProgress)}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Complete more exercises to improve your reading skills and track your progress toward CILS B1 proficiency.
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="whitespace-pre-line">{selectedExercise.content}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Answer the following questions:</h3>
                    
                    {selectedExercise.questions.map((question, qIndex) => (
                      <div key={question.id} className="space-y-3">
                        <h4 className="font-medium">{qIndex + 1}. {question.text}</h4>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div 
                              key={oIndex}
                              className={`p-3 border rounded-md cursor-pointer ${
                                userAnswers[qIndex] === oIndex 
                                  ? 'border-primary bg-primary/10' 
                                  : 'border-border hover:border-primary/50'
                              } ${
                                submitted && oIndex === question.correctAnswer
                                  ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                                  : submitted && userAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer
                                    ? 'bg-red-100 dark:bg-red-900/30 border-red-500'
                                    : ''
                              }`}
                              onClick={() => handleAnswerSelect(qIndex, oIndex)}
                            >
                              {option}
                              {submitted && oIndex === question.correctAnswer && (
                                <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!submitted ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={userAnswers.some(a => a === -1)}
                      className="mt-4"
                    >
                      Submit Answers
                    </Button>
                  ) : (
                    <div className="p-4 bg-accent rounded-md">
                      <h3 className="text-lg font-medium mb-2">Results</h3>
                      <p className="text-xl font-bold mb-2">Your score: {score}%</p>
                      <Progress value={score} className="mb-4 h-2" />
                      <Button 
                        onClick={() => {
                          setActiveTab('exercises');
                          setSelectedExercise(null);
                        }}
                      >
                        Back to Exercises
                      </Button>
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

export default ReadingModule;
