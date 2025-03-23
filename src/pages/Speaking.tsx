
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mic, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import SpeakableWord from '@/components/learning/SpeakableWord';
import BilingualFeedback from '@/components/ui/BilingualFeedback';

const SpeakingPractice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  
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
        <h1 className="text-3xl font-bold text-gray-800">Speaking Practice</h1>
        <p className="text-gray-700 font-medium">Improve your Italian pronunciation and speaking skills</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-[#009246]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#009246]/10 to-[#ce2b37]/10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-800">Pronunciation Practice</CardTitle>
                <CardDescription className="text-gray-700">Try to pronounce these phrases as clearly as possible</CardDescription>
              </div>
              <Badge className="bg-[#33A5EF] hover:bg-[#33A5EF]/80">{currentPhrase.difficulty}</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Listen and Repeat</h3>
              <p className="text-sm text-gray-700">
                First, listen to the native pronunciation. Then record yourself saying the same phrase.
              </p>
              
              <div className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <p className="text-xl font-medium mb-3 text-gray-800">
                      <SpeakableWord
                        word={currentPhrase.italian}
                        language="it"
                        className="inline-flex"
                      />
                    </p>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center space-x-1 border-[#33A5EF] text-[#33A5EF] mt-2"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      <span>{showTranslation ? "Hide Translation" : "Show Translation"}</span>
                    </Button>
                    
                    {showTranslation && (
                      <p className="text-md text-gray-700 mt-2 italic">
                        {currentPhrase.english}
                      </p>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center space-y-4">
                    <Button 
                      size="lg" 
                      className={`rounded-full h-16 w-16 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#009246] hover:bg-[#017f3c]'}`}
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
                        <p className="text-sm text-gray-700">Click to start recording</p>
                      )}
                    </div>
                  </div>
                  
                  {hasRecorded && feedbackScore !== null && (
                    <div className="w-full space-y-3 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">Pronunciation Score</span>
                        <span className="text-sm font-bold text-gray-800">{feedbackScore}%</span>
                      </div>
                      <Progress value={feedbackScore} className="h-2" />
                      
                      <div className="flex items-start space-x-2 mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        {feedbackScore > 90 ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        )}
                        <div>
                          <BilingualFeedback
                            english={feedbackScore > 90 
                              ? "Excellent pronunciation!" 
                              : feedbackScore > 80 
                              ? "Good pronunciation with minor issues"
                              : "Some pronunciation errors detected"}
                            italian={feedbackScore > 90 
                              ? "Pronuncia eccellente!" 
                              : feedbackScore > 80 
                              ? "Buona pronuncia con piccoli problemi"
                              : "Rilevati alcuni errori di pronuncia"}
                          />
                          <p className="text-xs text-gray-700 mt-1">
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
                          className="flex items-center border-[#ce2b37] text-[#ce2b37]"
                          onClick={resetPractice}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="border-gray-400 text-gray-700">Previous</Button>
            <Button className="bg-[#ce2b37] hover:bg-[#b32530] text-white">Next Phrase</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SpeakingPractice;
