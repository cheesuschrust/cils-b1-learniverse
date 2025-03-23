
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import SpeakableWord from '@/components/learning/SpeakableWord';

const SpeakingPractice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  
  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
      
      // Simulate feedback
      setTimeout(() => {
        setFeedbackScore(Math.floor(Math.random() * 30) + 70); // Score between 70-99
      }, 1000);
      
    } else {
      setIsRecording(true);
      setHasRecorded(false);
      setFeedbackScore(null);
      setRecordingTime(0);
      
      // Simulate recording time counter
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            clearInterval(interval);
            setIsRecording(false);
            setHasRecorded(true);
            // Simulate feedback after max time
            setTimeout(() => {
              setFeedbackScore(Math.floor(Math.random() * 30) + 70);
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };
  
  const getCurrentPhrase = () => {
    return {
      italian: "Mi piacerebbe visitare Roma l'anno prossimo.",
      english: "I would like to visit Rome next year.",
      difficulty: "Intermediate"
    };
  };
  
  const resetPractice = () => {
    setIsRecording(false);
    setHasRecorded(false);
    setFeedbackScore(null);
    setRecordingTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const currentPhrase = getCurrentPhrase();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Speaking Practice</h1>
        <p className="text-muted-foreground">Improve your Italian pronunciation and speaking skills</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pronunciation Practice</CardTitle>
                <CardDescription>Try to pronounce these phrases as clearly as possible</CardDescription>
              </div>
              <Badge>{currentPhrase.difficulty}</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Listen and Repeat</h3>
              <p className="text-sm text-muted-foreground">
                First, listen to the native pronunciation. Then record yourself saying the same phrase.
              </p>
              
              <div className="border rounded-lg p-6 bg-muted/30">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <p className="text-xl font-medium mb-1">
                      <SpeakableWord
                        word={currentPhrase.italian}
                        language="it"
                        className="inline-flex"
                      />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentPhrase.english}
                    </p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center space-y-4">
                    <Button 
                      size="lg" 
                      className={`rounded-full h-16 w-16 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                      onClick={handleRecord}
                    >
                      <Mic className={`h-6 w-6 ${isRecording ? 'animate-pulse' : ''}`} />
                    </Button>
                    
                    <div>
                      {isRecording ? (
                        <p className="text-sm font-medium text-red-500">Recording... {formatTime(recordingTime)}</p>
                      ) : hasRecorded ? (
                        <p className="text-sm font-medium text-green-500">Recording complete</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Click to start recording</p>
                      )}
                    </div>
                  </div>
                  
                  {hasRecorded && feedbackScore !== null && (
                    <div className="w-full space-y-3 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Pronunciation Score</span>
                        <span className="text-sm font-bold">{feedbackScore}%</span>
                      </div>
                      <Progress value={feedbackScore} className="h-2" />
                      
                      <div className="flex items-start space-x-2 mt-4 p-3 rounded-lg bg-muted">
                        {feedbackScore > 90 ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {feedbackScore > 90 
                              ? "Excellent pronunciation!" 
                              : feedbackScore > 80 
                              ? "Good pronunciation with minor issues"
                              : "Some pronunciation errors detected"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {feedbackScore > 90 
                              ? "Your accent and intonation are very good." 
                              : feedbackScore > 80 
                              ? "Pay attention to the 'r' sound and stress pattern."
                              : "Focus on improving the vowel sounds and rhythm."}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={resetPractice}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Playback
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline">Previous</Button>
            <Button>Next Phrase</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SpeakingPractice;
