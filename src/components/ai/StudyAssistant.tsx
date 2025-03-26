
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Bot, 
  Send, 
  MessageSquare, 
  Mic, 
  Volume2, 
  HelpCircle, 
  BookOpen, 
  FilePlus2, 
  Loader2,
  Brain,
  Sparkles,
  Volume
} from "lucide-react";
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useAuth } from '@/contexts/AuthContext';

const StudyAssistant = () => {
  const { settings, isProcessing } = useAIUtils();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>("");
  const [tab, setTab] = useState<string>("chat");
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    {
      role: "assistant",
      content: "Ciao! I'm your Italian language study assistant. How can I help you today? You can ask me questions about grammar, vocabulary, or request practice exercises."
    }
  ]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!query.trim()) return;
    
    const userMessage = {
      role: "user",
      content: query
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample responses based on query content
    let assistantResponse = "";
    
    if (query.toLowerCase().includes("grammar") || query.toLowerCase().includes("verb")) {
      assistantResponse = "Italian verbs are categorized into three conjugation patterns: -are, -ere, and -ire. Each follows specific rules for different tenses. Would you like me to explain a specific tense or conjugation pattern?";
    } else if (query.toLowerCase().includes("vocabulary") || query.toLowerCase().includes("word")) {
      assistantResponse = "Building vocabulary is essential for language learning. I recommend focusing on thematic word groups and using flashcards with spaced repetition. Would you like me to generate some vocabulary flashcards on a specific topic?";
    } else if (query.toLowerCase().includes("practice") || query.toLowerCase().includes("exercise")) {
      assistantResponse = "Practice is key to language mastery! I can create custom exercises for you. Would you prefer writing prompts, speaking scenarios, or comprehension questions?";
    } else if (query.toLowerCase().includes("pronunciation")) {
      assistantResponse = "Italian pronunciation is fairly consistent once you learn the rules. The most important aspects are vowel sounds, double consonants, and proper stress. Would you like me to explain specific pronunciation rules or provide examples?";
    } else {
      assistantResponse = "I understand you're interested in learning Italian. Could you provide more details about what specific aspect you'd like help with? I can assist with grammar explanations, vocabulary practice, pronunciation guidance, or creating customized exercises.";
    }
    
    const botMessage = {
      role: "assistant",
      content: assistantResponse
    };
    
    setMessages(prev => [...prev, botMessage]);
  };
  
  // Handle voice input
  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording - in a real app, we would use the Web Speech API
      toast({
        title: "Voice recording started",
        description: "Speak clearly into your microphone.",
      });
      
      // Simulate speech recognition with timeout
      setTimeout(() => {
        setIsRecording(false);
        setQuery("Can you explain Italian article usage?");
        
        toast({
          title: "Voice input received",
          description: "Text transcribed from your speech.",
        });
      }, 3000);
    } else {
      // Stop recording
      toast({
        title: "Voice recording stopped",
      });
    }
  };
  
  // Handle text-to-speech
  const handleTextToSpeech = (text: string) => {
    setIsSpeaking(true);
    
    // In a real app, we would use the Web Speech API
    toast({
      title: "Speaking text",
      description: "Text-to-speech activated.",
    });
    
    // Simulate speech synthesis with timeout
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);
  };
  
  // Generate practice materials
  const generatePractice = (type: string) => {
    toast({
      title: `Generating ${type}`,
      description: "Custom practice material will be ready shortly.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 mr-1" />
            Practice
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1">
            <FilePlus2 className="h-4 w-4 mr-1" />
            Resources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Bot className="h-5 w-5 text-primary mr-2" />
                Study Assistant Chat
              </CardTitle>
              <CardDescription>
                Ask questions about Italian grammar, vocabulary, or request help
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-[calc(500px-9rem)]">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">
                            {message.role === 'user' ? 'You' : 'Assistant'}
                          </span>
                          {message.role === 'assistant' && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6" 
                              onClick={() => handleTextToSpeech(message.content)}
                              disabled={isSpeaking}
                            >
                              {isSpeaking ? (
                                <Volume className="h-3 w-3 animate-pulse" />
                              ) : (
                                <Volume2 className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="pt-0">
              <div className="flex w-full gap-2">
                <Button
                  size="icon"
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={handleVoiceInput}
                  className="flex-shrink-0"
                >
                  <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
                </Button>
                <Input
                  placeholder="Ask a question about Italian..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage} disabled={!query.trim()} className="flex-shrink-0">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <HelpCircle className="h-4 w-4 text-primary mr-2" />
                Suggested Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setQuery("How do I use definite articles in Italian?")}
                >
                  How do I use definite articles?
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setQuery("Can you explain the difference between essere and stare?")}
                >
                  Difference between essere and stare?
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setQuery("Give me some basic travel phrases in Italian")}
                >
                  Basic travel phrases
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setQuery("How do I form the past tense in Italian?")}
                >
                  Past tense formation
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="practice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 text-primary mr-2" />
                Generate Practice Materials
              </CardTitle>
              <CardDescription>
                Create custom exercises based on your learning needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Exercise Type</Label>
                <div className="flex flex-wrap gap-2">
                  <Toggle
                    variant="outline"
                    className="flex gap-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    onClick={() => generatePractice("vocabulary")}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Vocabulary
                  </Toggle>
                  <Toggle
                    variant="outline"
                    className="flex gap-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    onClick={() => generatePractice("grammar")}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Grammar
                  </Toggle>
                  <Toggle
                    variant="outline"
                    className="flex gap-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    onClick={() => generatePractice("comprehension")}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comprehension
                  </Toggle>
                  <Toggle
                    variant="outline"
                    className="flex gap-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    onClick={() => generatePractice("conversation")}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Conversation
                  </Toggle>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Focus</Label>
                <Input
                  id="topic"
                  placeholder="Enter a specific topic, grammar point, or vocabulary theme..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select defaultValue="intermediate">
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Exercise Format</Label>
                  <Select defaultValue="multiple-choice">
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                      <SelectItem value="matching">Matching</SelectItem>
                      <SelectItem value="free-response">Free Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="include-hints" defaultChecked />
                <Label htmlFor="include-hints">Include hints and explanations</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Practice Exercise
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FilePlus2 className="h-5 w-5 text-primary mr-2" />
                Learning Resources
              </CardTitle>
              <CardDescription>
                Tailored resources based on your learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="text-base font-medium flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                      Italian Article Usage Guide
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A comprehensive guide to definite and indefinite articles in Italian, with clear examples and practice exercises.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Grammar</Badge>
                      <Badge variant="outline">Beginner</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="text-base font-medium flex items-center">
                      <Volume2 className="h-4 w-4 mr-2 text-green-500" />
                      Pronunciation Audio Series
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Master Italian pronunciation with this audio series focusing on difficult sounds and natural intonation patterns.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Speaking</Badge>
                      <Badge variant="outline">All Levels</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="text-base font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
                      Conversational Phrases Collection
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Essential phrases for everyday conversations in Italian, organized by situation and formality level.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Vocabulary</Badge>
                      <Badge variant="outline">Intermediate</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="text-base font-medium flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                      Verb Conjugation Practice Set
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Interactive exercises to master regular and irregular verb conjugations in all major tenses.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Grammar</Badge>
                      <Badge variant="outline">Advanced</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="text-base font-medium flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-red-500" />
                      Italian Culture Insights
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Articles and videos about Italian culture, traditions, and regional differences to enhance your cultural understanding.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Culture</Badge>
                      <Badge variant="outline">All Levels</Badge>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyAssistant;
