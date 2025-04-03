
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Loader2, Send, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase-client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  translated?: string;
}

interface AIAssistantProps {
  initialContext?: string;
  assistantName?: string;
  showTranslation?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  initialContext = "I'm learning Italian for citizenship",
  assistantName = "Lucia",
  showTranslation = true
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: `Ciao! Sono ${assistantName}, il tuo assistente per l'italiano. Come posso aiutarti oggi?`,
      role: 'assistant',
      timestamp: new Date(),
      translated: 'Hi! I am Lucia, your Italian assistant. How can I help you today?'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEnglish, setShowEnglish] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Call OpenAI for assistant response
      const { data: responseData, error: responseError } = await supabase.functions.invoke('italian-assistant', {
        body: {
          message: input,
          history: messages.slice(-10), // Send last 10 messages for context
          context: initialContext,
          level: "intermediate"  // Could be dynamic based on user's profile
        }
      });
      
      if (responseError) throw new Error(responseError.message);
      
      if (!responseData) {
        throw new Error('No response from assistant');
      }

      // Translate the assistant's Italian response to English if needed
      let translatedText = undefined;
      if (showTranslation) {
        try {
          const { data: translationData } = await supabase.functions.invoke('translate-text', {
            body: {
              text: responseData.response,
              sourceLanguage: 'it',
              targetLanguage: 'en'
            }
          });
          
          if (translationData) {
            translatedText = translationData.translatedText;
          }
        } catch (translationError) {
          console.error('Translation failed:', translationError);
        }
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        content: responseData.response,
        role: 'assistant',
        timestamp: new Date(),
        translated: translatedText
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling assistant:', error);
      toast({
        title: "Communication Error",
        description: "There was a problem contacting the AI assistant.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const playText = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: "pNInz6obpgDQGcFmaJgB", // Italian female voice
          model: "eleven_multilingual_v2"
        }
      });
      
      if (error) throw error;
      
      if (data && data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Audio Error",
        description: "Could not play audio for this message.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      <CardHeader className="pb-3">
        <CardTitle>Chat with {assistantName}</CardTitle>
        <CardDescription>
          Your Italian language assistant
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                  <span className="text-xs font-semibold">{assistantName[0]}</span>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] rounded-lg p-3 
                ${message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'}`}
              >
                <div className="flex justify-between gap-2">
                  <p>{message.content}</p>
                  {message.role === 'assistant' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5 rounded-full"
                      onClick={() => playText(message.content)}
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                {showTranslation && message.translated && (
                  <div className={`mt-1 pt-1 text-xs ${message.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {showEnglish && message.translated}
                  </div>
                )}
              </div>
              
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 bg-secondary">
                  <span className="text-xs">{user?.email?.charAt(0) || 'U'}</span>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 pb-6">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isProcessing}
            className="flex-grow"
          />
          <Button type="submit" disabled={!input.trim() || isProcessing}>
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
      
      {showTranslation && (
        <div className="px-4 pb-2 flex justify-end">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Show English</span>
            <input
              type="checkbox"
              checked={showEnglish}
              onChange={() => setShowEnglish(!showEnglish)}
              className="rounded"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default AIAssistant;
