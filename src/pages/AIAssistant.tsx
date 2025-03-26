
import React, { useState, useRef, useEffect } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import AISettings from '@/components/ai/AISettings';
import { Bot, User, Send, Loader2, Volume, Mic, Image, Lightbulb, Settings, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const { toast } = useToast();
  const { 
    generateContent, 
    isProcessing, 
    settings,
    isAIEnabled,
    speakText,
    isSpeaking,
    processAudioStream,
    stopAudioProcessing,
    isTranscribing
  } = useAIUtils();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Ciao! I'm ${settings.assistantName}, your Italian language learning assistant. How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on tab change
  useEffect(() => {
    if (activeTab === 'chat') {
      inputRef.current?.focus();
    }
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    if (!isAIEnabled) {
      toast({
        title: "AI Features Disabled",
        description: "Please enable AI features in settings to use the assistant.",
        variant: "destructive"
      });
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      // Generate AI response
      const response = await generateContent(input, 'assistant');
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSpeakMessage = async (text: string) => {
    if (!isAIEnabled) {
      toast({
        title: "AI Features Disabled",
        description: "Please enable AI features in settings to use text-to-speech.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await speakText(text);
    } catch (error) {
      console.error('Error speaking text:', error);
      toast({
        title: "Speech Error",
        description: "Failed to speak the text. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStartRecording = async () => {
    if (!isAIEnabled) {
      toast({
        title: "AI Features Disabled",
        description: "Please enable AI features in settings to use speech recognition.",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) return;
    
    try {
      setIsRecording(true);
      
      const stopRecording = await processAudioStream((transcript, isFinal) => {
        if (isFinal) {
          setInput(transcript);
          setIsRecording(false);
          stopAudioProcessing();
        } else {
          setInput(transcript);
        }
      });
      
      // Auto stop after 10 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
          setIsRecording(false);
        }
      }, 10000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      toast({
        title: "Microphone Error",
        description: "Failed to start recording. Please check your microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopAudioProcessing();
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI Language Assistant</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="chat" className="flex items-center">
            <Bot className="mr-2 h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center">
                <Bot className="mr-2 h-5 w-5 text-primary" />
                {settings.assistantName}
              </CardTitle>
              <CardDescription>
                Ask questions about Italian grammar, vocabulary, or request learning activities
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start gap-3",
                        message.isUser ? "flex-row-reverse" : ""
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        {message.isUser ? (
                          <>
                            <AvatarImage src="/assets/user-avatar.png" />
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/assets/bot-avatar.png" />
                            <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      
                      <div className={cn(
                        "rounded-lg p-3 max-w-[80%]",
                        message.isUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {!message.isUser && (
                          <div className="flex items-center mt-2 space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleSpeakMessage(message.content)}
                              disabled={isSpeaking}
                            >
                              <Volume className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                navigator.clipboard.writeText(message.content);
                                toast({
                                  title: "Copied to clipboard",
                                  description: "The message has been copied to your clipboard.",
                                });
                              }}
                            >
                              <ClipboardCheck className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/assets/bot-avatar.png" />
                        <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-.25s]" />
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-.5s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            <CardFooter>
              <div className="flex w-full items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={!isAIEnabled}
                  className={cn(isRecording && "bg-red-100 text-red-500 animate-pulse")}
                >
                  {isRecording || isTranscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                
                <Input
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing || isRecording || !isAIEnabled}
                  className="flex-1"
                />
                
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!input.trim() || isProcessing || !isAIEnabled}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </div>
              
              {!isAIEnabled && (
                <p className="w-full text-center text-sm text-muted-foreground mt-2">
                  AI features are currently disabled. Enable them in the Settings tab.
                </p>
              )}
            </CardFooter>
          </Card>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              Suggested Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "How do I conjugate irregular verbs in Italian?",
                "What's the difference between 'essere' and 'stare'?",
                "Can you create flashcards for basic travel phrases?",
                "How do I form plurals in Italian?",
                "Explain the use of articles in Italian",
                "Generate a beginner reading exercise about food"
              ].map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="justify-start h-auto py-2"
                  onClick={() => {
                    setInput(question);
                    inputRef.current?.focus();
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <AISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistant;
