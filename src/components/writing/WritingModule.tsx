
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useAI } from '@/hooks/useAI';
import { Loader2 } from 'lucide-react';

type FeedbackType = {
  score: number;
  feedback: string;
  corrections?: { original: string; suggested: string; explanation: string }[];
};

const WritingModule: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { evaluateContent, isProcessing } = useAI();
  
  const [prompt, setPrompt] = useState<string>("Descrivi la tua città preferita in Italia. Perché ti piace? Cosa si può fare lì?");
  const [userResponse, setUserResponse] = useState<string>("");
  const [level, setLevel] = useState<string>("intermediate");
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  
  const writingPrompts = [
    {
      level: "beginner",
      prompts: [
        "Presentati in italiano. Come ti chiami? Di dove sei? Cosa ti piace fare?",
        "Descrivi la tua famiglia. Quante persone ci sono nella tua famiglia?",
        "Scrivi del tuo cibo italiano preferito. Perché ti piace?"
      ]
    },
    {
      level: "intermediate",
      prompts: [
        "Descrivi la tua città preferita in Italia. Perché ti piace? Cosa si può fare lì?",
        "Racconta una giornata tipica della tua vita. Cosa fai durante il giorno?",
        "Parla della cultura italiana. Cosa ti affascina della cultura italiana?"
      ]
    },
    {
      level: "advanced",
      prompts: [
        "Discuti l'importanza della cittadinanza italiana nel contesto europeo.",
        "Confronta il sistema educativo italiano con quello del tuo paese.",
        "Analizza un aspetto della storia italiana che trovi significativo."
      ]
    }
  ];
  
  const handleLevelChange = (value: string) => {
    setLevel(value);
    // Select a random prompt from the chosen level
    const levelPrompts = writingPrompts.find(p => p.level === value)?.prompts || [];
    if (levelPrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * levelPrompts.length);
      setPrompt(levelPrompts[randomIndex]);
    }
  };
  
  const handleSubmitForFeedback = async () => {
    if (!userResponse.trim()) return;
    
    try {
      const result = await evaluateContent(userResponse, prompt, level as any);
      setFeedback({
        score: result.score,
        feedback: result.feedback
      });
    } catch (error) {
      console.error("Error evaluating writing:", error);
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Italian Writing Practice</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Writing Exercise</CardTitle>
            <CardDescription>Practice your Italian writing skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Select value={level} onValueChange={handleLevelChange}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium">Writing Prompt:</h3>
                  <p className="mt-2 italic">{prompt}</p>
                </CardContent>
              </Card>
              
              <div>
                <Textarea 
                  placeholder="Write your response in Italian..." 
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
              </div>
              
              <Button 
                onClick={handleSubmitForFeedback}
                disabled={isProcessing || !userResponse.trim()}
                className="w-full md:w-auto"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : "Get Feedback"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>
              AI-powered feedback on your writing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Score</h3>
                  <div className="mt-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${feedback.score * 100}%` }} 
                    />
                  </div>
                  <p className="mt-1 text-sm text-right">
                    {(feedback.score * 10).toFixed(1)}/10
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Analysis</h3>
                  <p className="mt-1 text-sm">{feedback.feedback}</p>
                </div>
                
                {feedback.corrections && feedback.corrections.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium">Corrections</h3>
                    <ul className="mt-1 space-y-2">
                      {feedback.corrections.map((correction, index) => (
                        <li key={index} className="text-sm border-l-2 border-primary pl-3">
                          <p className="line-through">{correction.original}</p>
                          <p className="font-medium">{correction.suggested}</p>
                          <p className="text-xs text-muted-foreground">{correction.explanation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Submit your writing to receive feedback</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WritingModule;
