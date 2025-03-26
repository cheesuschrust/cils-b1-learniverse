
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useToast } from "@/hooks/use-toast";
import { useAI } from '@/hooks/useAI';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const StudyAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI study assistant. Ask me about concepts you're learning, request practice questions, or get hints for problems you're stuck on.",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateText, generateQuestions, abort } = useAI();
  const { speakText, stopSpeaking, settings } = useAIUtils();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      let response: string;
      
      if (activeTab === 'practice') {
        response = await generateText(`Generate a practice question based on this topic: ${input.trim()}. Include the question and the answer separately.`);
      } else if (activeTab === 'hint') {
        response = await generateText(`Provide a helpful hint for this problem without giving away the full answer: ${input.trim()}`);
      } else {
        response = await generateText(input.trim());
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (settings.voiceEnabled) {
        await speakText(response, settings.defaultLanguage || 'english');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGeneratePracticeQuestion = async () => {
    setIsGeneratingQuestion(true);
    
    try {
      const questions = await generateQuestions("Generate a practice question related to Italian language learning that tests comprehension and grammar", 1, "text-input");
      if (questions && questions.length > 0) {
        setGeneratedQuestion(questions[0].question);
      } else {
        throw new Error("Failed to generate question");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate a practice question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingQuestion(false);
    }
  };
  
  const toggleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = async () => {
    try {
      // This is a placeholder for actual speech recognition implementation
      // In a real implementation, you would use the Web Speech API or a similar service
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone."
      });
      
      // Simulate recording for demo purposes
      setTimeout(() => {
        stopRecording();
        setInput(input + " [Voice input would be transcribed here]");
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
    });
  };
  
  const toggleAudioPlayback = async (text: string) => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      await speakText(text, settings.defaultLanguage || 'english');
      setIsPlayingAudio(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Study Assistant</CardTitle>
        <CardDescription>
          Ask questions, get practice problems, or request hints for difficult concepts.
        </CardDescription>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="practice">Practice Questions</TabsTrigger>
            <TabsTrigger value="hint">Get Hints</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-4 h-[350px] overflow-y-auto p-4 border rounded-md">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex flex-col max-w-[80%] rounded-lg p-3",
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground self-end" 
                    : "bg-muted self-start"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  {message.role === 'assistant' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleAudioPlayback(message.content)}
                      className="ml-2 h-6 w-6 rounded-full"
                    >
                      {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>
                  )}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {isProcessing && (
              <div className="flex items-center space-x-2 self-start bg-muted p-3 rounded-lg">
                <Skeleton className="h-4 w-4 rounded-full animate-pulse" />
                <Skeleton className="h-4 w-4 rounded-full animate-pulse" />
                <Skeleton className="h-4 w-4 rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          {activeTab === 'practice' && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Generated Practice Question</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGeneratePracticeQuestion}
                  disabled={isGeneratingQuestion}
                >
                  {isGeneratingQuestion ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Generate New Question"}
                </Button>
              </div>
              
              {generatedQuestion ? (
                <div className="p-3 bg-card border rounded-md">
                  {generatedQuestion}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  {isGeneratingQuestion ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating a practice question...</span>
                    </div>
                  ) : (
                    "Click the button to generate a practice question"
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Textarea
            placeholder={
              activeTab === 'chat' 
                ? "Ask a question..." 
                : activeTab === 'practice' 
                  ? "Describe the topic for practice questions..." 
                  : "Describe the problem you need help with..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            rows={2}
            disabled={isProcessing}
          />
          <div className="flex flex-col space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleVoiceInput} 
                    disabled={isProcessing}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? "Stop recording" : "Start voice input"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isProcessing}
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StudyAssistant;
