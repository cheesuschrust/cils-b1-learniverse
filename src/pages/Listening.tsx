
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, PauseCircle, SkipForward, Volume2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ListeningExercise = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("2:34");
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // Simulate playback progress
    if (!isPlaying) {
      let currentProgress = progress;
      const interval = setInterval(() => {
        currentProgress += 1;
        if (currentProgress > 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return;
        }
        setProgress(currentProgress);
        
        // Update current time
        const seconds = Math.floor((currentProgress / 100) * 154);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setCurrentTime(`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);
      }, 1000);
    }
  };
  
  const resetPlayback = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Listening Comprehension</h1>
        <p className="text-muted-foreground">Improve your Italian listening skills</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="beginner" className="space-y-8">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="beginner">
            <Card>
              <CardHeader>
                <CardTitle>Basic Conversations</CardTitle>
                <CardDescription>Simple dialogues for beginners</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Exercise 1: Al Caffè</h3>
                  <p className="text-sm text-muted-foreground">
                    Listen to the following conversation at an Italian café. Then answer the questions below.
                  </p>
                  
                  <div className="border rounded-lg p-4 bg-muted/40">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-full" 
                          onClick={handlePlayPause}
                        >
                          {isPlaying ? (
                            <PauseCircle className="h-10 w-10" />
                          ) : (
                            <PlayCircle className="h-10 w-10" />
                          )}
                        </Button>
                        <div>
                          <p className="text-sm font-medium">Dialogue: Al Caffè</p>
                          <p className="text-xs text-muted-foreground">{currentTime} / {totalTime}</p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="ghost" size="icon" onClick={resetPlayback}>
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Marco:</span> Buongiorno! Un caffè, per favore.
                      </div>
                      <div>00:05</div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Barista:</span> Certo. Desidera altro?
                      </div>
                      <div>00:08</div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Marco:</span> Anche un cornetto, grazie.
                      </div>
                      <div>00:12</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium">Questions:</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2">1. What did Marco order first?</p>
                        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tea" id="q1-a" />
                            <Label htmlFor="q1-a">Tea</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="coffee" id="q1-b" />
                            <Label htmlFor="q1-b">Coffee</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="water" id="q1-c" />
                            <Label htmlFor="q1-c">Water</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <p className="mb-2">2. What else did Marco order?</p>
                        <RadioGroup className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sandwich" id="q2-a" />
                            <Label htmlFor="q2-a">A sandwich</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pastry" id="q2-b" />
                            <Label htmlFor="q2-b">A pastry (cornetto)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nothing" id="q2-c" />
                            <Label htmlFor="q2-c">Nothing else</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full">Check Answers</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="intermediate">
            <Card>
              <CardHeader>
                <CardTitle>Intermediate Dialogues</CardTitle>
                <CardDescription>More complex conversations for intermediate learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  Complete the beginner level first to unlock intermediate exercises.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Content</CardTitle>
                <CardDescription>Native-speed recordings for advanced learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  Complete the intermediate level first to unlock advanced exercises.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ListeningExercise;
