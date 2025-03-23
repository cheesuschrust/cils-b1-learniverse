
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, SquarePen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WritingPractice = () => {
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  
  const handleSubmit = () => {
    if (!text.trim()) return;
    
    setIsSubmitted(true);
    
    // Simulate feedback
    setTimeout(() => {
      setFeedback({
        score: Math.floor(Math.random() * 20) + 75,
        grammaticalErrors: Math.floor(Math.random() * 3),
        spellingErrors: Math.floor(Math.random() * 2),
        suggestions: [
          "Use more varied vocabulary",
          "Pay attention to verb conjugations",
          "Good use of prepositions"
        ],
        correctedText: text.replace(/mi piace/i, "Mi piace").replace(/italia/i, "Italia")
      });
    }, 1000);
  };
  
  const resetExercise = () => {
    setText("");
    setIsSubmitted(false);
    setFeedback(null);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Writing Practice</h1>
        <p className="text-muted-foreground">Practice writing in Italian</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="short" className="space-y-8">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="short">Short Responses</TabsTrigger>
            <TabsTrigger value="essay">Essays</TabsTrigger>
            <TabsTrigger value="creative">Creative Writing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="short">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Short Response Exercise</CardTitle>
                    <CardDescription>Write a brief response to the prompt below</CardDescription>
                  </div>
                  <Badge>Beginner</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Prompt: Introduce Yourself</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>Write a short paragraph (30-50 words) introducing yourself in Italian. Include:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      <li>Your name</li>
                      <li>Where you're from</li>
                      <li>One hobby you enjoy</li>
                      <li>Why you're learning Italian</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your response:</span>
                      <span className={`${text.length > 50 ? 'text-amber-500' : text.length > 30 ? 'text-green-500' : ''}`}>
                        {text.length}/50 words recommended
                      </span>
                    </div>
                    <Textarea 
                      placeholder="Start typing your response in Italian..." 
                      className="min-h-[150px]"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      disabled={isSubmitted}
                    />
                  </div>
                  
                  {isSubmitted && feedback && (
                    <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Feedback</h4>
                        <Badge variant={feedback.score > 90 ? "default" : "secondary"}>
                          Score: {feedback.score}/100
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          {feedback.grammaticalErrors === 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">Grammar</p>
                            <p className="text-xs text-muted-foreground">
                              {feedback.grammaticalErrors === 0 
                                ? "No grammatical errors found." 
                                : `${feedback.grammaticalErrors} grammatical error(s) found.`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          {feedback.spellingErrors === 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">Spelling & Capitalization</p>
                            <p className="text-xs text-muted-foreground">
                              {feedback.spellingErrors === 0 
                                ? "No spelling errors found." 
                                : `${feedback.spellingErrors} spelling error(s) found.`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Suggestions:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {feedback.suggestions.map((suggestion: string, index: number) => (
                              <li key={index} className="flex items-start space-x-1">
                                <span>•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Corrected Text:</p>
                          <p className="text-xs p-2 bg-muted rounded">
                            {feedback.correctedText}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                {!isSubmitted ? (
                  <Button 
                    className="w-full" 
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                  >
                    <SquarePen className="mr-2 h-4 w-4" />
                    Submit for Feedback
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={resetExercise}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Another Exercise
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="essay">
            <Card>
              <CardHeader>
                <CardTitle>Essay Writing</CardTitle>
                <CardDescription>Practice writing longer essays in Italian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  Complete the short response exercises first to unlock essay exercises.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="creative">
            <Card>
              <CardHeader>
                <CardTitle>Creative Writing</CardTitle>
                <CardDescription>Express yourself creatively in Italian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  Complete the essay exercises first to unlock creative writing exercises.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WritingPractice;
