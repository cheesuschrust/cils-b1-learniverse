
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Timer, Send, RefreshCw, Lightbulb } from 'lucide-react';

interface WritingPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  wordLimit: number;
  suggestedTime: number; // in minutes
  exampleResponse?: string;
  category: string;
  tips?: string[];
}

// Sample data - in a real app, this would come from Supabase
const samplePrompt: WritingPrompt = {
  id: "1",
  title: "La Mia Città Preferita",
  description: "Write about your favorite city in Italy or in your home country.",
  prompt: "Descrivi la tua città preferita. Perché ti piace? Cosa puoi fare lì? Quali sono i luoghi più interessanti da visitare?",
  difficulty: "intermediate",
  wordLimit: 150,
  suggestedTime: 15,
  category: "Travel",
  tips: [
    "Use different adjectives to describe the city",
    "Write about specific locations in the city",
    "Include some information about the history or culture",
    "Explain what makes this city special to you"
  ],
  exampleResponse: "La mia città preferita è Firenze. Mi piace molto perché è una città piena di storia e arte. A Firenze, puoi visitare molti musei famosi come gli Uffizi e la Galleria dell'Accademia, dove si trova il David di Michelangelo. Il centro storico è bellissimo, con la sua cattedrale Santa Maria del Fiore e il famoso Ponte Vecchio. Mi piace camminare lungo l'Arno, specialmente al tramonto quando la luce è magica. La cucina toscana è anche deliziosa – la bistecca alla fiorentina è il mio piatto preferito! Firenze è speciale per me perché ho studiato italiano lì per tre mesi e ho incontrato amici da tutto il mondo."
};

const WritingModule: React.FC = () => {
  const [prompt, setPrompt] = useState<WritingPrompt>(samplePrompt);
  const [response, setResponse] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(prompt.suggestedTime * 60); // convert to seconds
  const [timerActive, setTimerActive] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Update word count whenever response changes
    setWordCount(response.trim() ? response.trim().split(/\s+/).length : 0);
  }, [response]);
  
  useEffect(() => {
    // Timer logic
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      toast({
        title: "Time's Up!",
        description: "The suggested time has ended, but you can still complete your response.",
      });
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, toast]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const startTimer = () => {
    setTimerActive(true);
    // Focus on textarea when timer starts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const stopTimer = () => {
    setTimerActive(false);
  };
  
  const resetTimer = () => {
    setTimeLeft(prompt.suggestedTime * 60);
    setTimerActive(false);
  };
  
  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSubmitted) return;
    setResponse(e.target.value);
  };
  
  const handleSubmit = () => {
    if (response.trim().length === 0) {
      toast({
        title: "Empty Response",
        description: "Please write something before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitted(true);
    stopTimer();
    
    // Generate mock feedback (in a real app, this would call an API)
    generateFeedback();
    
    toast({
      title: "Response Submitted",
      description: "Your writing has been submitted for feedback.",
    });
  };
  
  const generateFeedback = () => {
    // In a real app, this would come from an API
    // For now, we'll generate some mock feedback
    setTimeout(() => {
      const mockFeedback = `
Your writing shows a good understanding of Italian vocabulary related to describing places. You've used some appropriate adjectives and connected your ideas well.

Grammar:
- Pay attention to gender agreement with adjectives
- Make sure to use the correct prepositions with locations

Vocabulary:
- You've used appropriate vocabulary for this topic
- Try to incorporate more varied descriptive terms

Structure:
- Good opening and explanation of why you like the place
- Consider adding more about personal experiences

Keep practicing and expanding your vocabulary!`;
      
      setFeedback(mockFeedback);
    }, 1500);
  };
  
  const handleStartNew = () => {
    setResponse("");
    setIsSubmitted(false);
    setFeedback(null);
    resetTimer();
    setShowExample(false);
    
    // In a real app, this would fetch a new prompt
    toast({
      title: "Coming Soon",
      description: "More writing prompts will be available soon!",
    });
  };
  
  const toggleShowExample = () => {
    setShowExample(!showExample);
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{prompt.title}</CardTitle>
              <CardDescription>
                {prompt.category} - {prompt.difficulty.charAt(0).toUpperCase() + prompt.difficulty.slice(1)} Level
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {prompt.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Writing Prompt:</h3>
            <p>{prompt.description}</p>
            <p className="mt-2 font-medium">{prompt.prompt}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Word Limit:</span>
                <Badge variant={wordCount > prompt.wordLimit ? "destructive" : "outline"}>
                  {wordCount} / {prompt.wordLimit}
                </Badge>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Time:</span>
                <Badge 
                  variant={timerActive ? "default" : "outline"}
                  className="flex items-center"
                >
                  <Timer className="h-3 w-3 mr-1" />
                  {formatTime(timeLeft)}
                </Badge>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!timerActive ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={startTimer}
                  disabled={isSubmitted}
                >
                  Start Timer
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={stopTimer}
                  disabled={isSubmitted}
                >
                  Pause Timer
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetTimer}
                disabled={isSubmitted}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          
          {prompt.tips && (
            <div className="bg-muted/50 p-4 rounded-md border border-dashed">
              <h3 className="font-medium flex items-center mb-2">
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                Writing Tips:
              </h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                {prompt.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              placeholder="Write your response in Italian..."
              className="min-h-[200px] resize-y"
              value={response}
              onChange={handleResponseChange}
              disabled={isSubmitted}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Write in Italian</span>
              <span className={wordCount > prompt.wordLimit ? "text-red-500" : ""}>
                {wordCount} / {prompt.wordLimit} words
              </span>
            </div>
          </div>
          
          {prompt.exampleResponse && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleShowExample}
                className="text-sm"
              >
                {showExample ? "Hide Example Response" : "Show Example Response"}
              </Button>
              
              {showExample && (
                <div className="mt-2 bg-muted/30 p-4 rounded-md border border-dashed">
                  <h3 className="font-medium mb-2">Example Response:</h3>
                  <p className="text-sm italic">{prompt.exampleResponse}</p>
                </div>
              )}
            </div>
          )}
          
          {feedback && (
            <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
              <h3 className="font-medium flex items-center mb-2">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Feedback on Your Writing:
              </h3>
              <div className="text-sm whitespace-pre-line">
                {feedback}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          {!isSubmitted ? (
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={response.trim().length === 0}
              className="ml-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleStartNew}
              className="ml-auto"
            >
              Start New Writing Exercise
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default WritingModule;
