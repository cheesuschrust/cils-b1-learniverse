
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useToast } from '@/hooks/use-toast';
import { Bot, Send, Mic, Volume2, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  initialMessage?: string;
  context?: string;
  placeholderText?: string;
  title?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  initialMessage = "Ciao! Come posso aiutarti con il tuo italiano oggi?",
  context = "learning Italian",
  placeholderText = "Scrivi il tuo messaggio qui...",
  title = "Italian AI Assistant"
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialMessage, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { 
    generateText, 
    speak, 
    isAIEnabled,
    processContent,
    translateText,
    remainingCredits
  } = useAIUtils();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Process with AI
      let response;
      
      if (isAIEnabled && generateText) {
        // Use the proper AI generation
        response = await generateText(input, {
          context: context,
          previousMessages: messages.slice(-6) // Last 6 messages for context
        });
      } else {
        // Fallback to simple responses
        response = `I understand you're saying: "${input}". As an Italian assistant, I would normally respond in Italian, but AI functionality is currently limited.`;
      }

      // Add assistant message
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: response, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      await speak(text, 'italian');
    } catch (error) {
      console.error('Error speaking text:', error);
      toast({
        title: 'Error',
        description: 'Failed to speak the text. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const translateMessage = async (text: string) => {
    try {
      const translation = await translateText(text, 'english');
      toast({
        title: 'Translation',
        description: translation,
      });
    } catch (error) {
      console.error('Error translating text:', error);
      toast({
        title: 'Error',
        description: 'Failed to translate the text.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          {title}
          <div className="text-xs ml-auto text-muted-foreground">
            {isAIEnabled ? 
              `${remainingCredits} credits remaining` : 
              'Limited functionality'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'flex-row-reverse' 
                      : 'flex-row'
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === 'user' ? 
                      <User className="h-4 w-4" /> : 
                      <Bot className="h-4 w-4" />}
                  </Avatar>
                  <div 
                    className={`rounded-lg px-3 py-2 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex justify-end gap-2 mt-1">
                      {message.role === 'assistant' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleSpeak(message.content)}
                            disabled={isSpeaking}
                          >
                            {isSpeaking ? 
                              <Loader2 className="h-3 w-3 animate-spin" /> : 
                              <Volume2 className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => translateMessage(message.content)}
                          >
                            <span className="text-xs font-bold">EN</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-3">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderText}
            className="min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isProcessing || !input.trim()}
          >
            {isProcessing ? 
              <Loader2 className="h-4 w-4 animate-spin" /> : 
              <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
