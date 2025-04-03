import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, Volume2, RotateCcw, Languages, Mic } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase-client';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  translation?: string;
  audioUrl?: string;
}

interface AIAssistantProps {
  initialContext?: string;
  assistantName?: string;
  showTranslation?: boolean;
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  initialContext = 'Italian language learning',
  assistantName = 'AI Assistant',
  showTranslation = false,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [displayTranslation, setDisplayTranslation] = useState(showTranslation);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateText, isProcessing, generateSpeech, analyzeSpeech, translateText } = useAI();
  const { user } = useAuth();
  const { hasReachedLimit, incrementUsage } = useFeatureLimits();
  const { toast } = useToast();
  
  useEffect(() => {
    const welcomeMessage: Message = {
      id: uuidv4(),
      content: `Ciao! I'm your Italian language assistant. How can I help you with your ${initialContext} today?`,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    if (displayTranslation) {
      handleTranslation(welcomeMessage);
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    if (hasReachedLimit('aiSuggestions')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your daily AI chat limit. Upgrade to premium for unlimited access.",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      const conversationContext = messages
        .slice(-4)
        .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      const prompt = `
        You are an Italian language tutor named ${assistantName}.
        Topic: ${initialContext}
        
        Recent conversation:
        ${conversationContext}
        
        User: ${input}
        
        Respond in Italian, keep your response helpful, concise, and focused on helping the user learn Italian.
        If they ask a question in English, still respond in Italian but with simpler language.
        Only use English if specifically asked for a translation or explanation of a concept.
      `;
      
      const response = await generateText(prompt);
      
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (user) {
        await supabase.from('user_activity_logs').insert({
          user_id: user.id,
          activity_type: 'ai_chat',
          details: {
            user_message: input,
            ai_response: response,
            context: initialContext
          }
        });
      }
      
      if (displayTranslation) {
        handleTranslation(assistantMessage);
      }
      
      await incrementUsage('aiSuggestions');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate response. Please try again.",
        variant: "destructive"
      });
      
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          content: "Mi dispiace, ho avuto un problema. Puoi riprovare? (Sorry, I had a problem. Can you try again?)",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handlePlayAudio = async (message: Message) => {
    if (isPlayingAudio) return;
    
    try {
      setIsPlayingAudio(true);
      
      if (message.audioUrl) {
        const audio = new Audio(message.audioUrl);
        await audio.play();
        return;
      }
      
      const audioContent = await generateSpeech(message.content);
      
      const binaryData = atob(audioContent);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, audioUrl } : msg
        )
      );
      
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error: any) {
      toast({
        title: "Audio Error",
        description: error.message || "Failed to generate or play audio.",
        variant: "destructive"
      });
    } finally {
      setIsPlayingAudio(false);
    }
  };
  
  const handleTranslation = async (message: Message) => {
    if (message.isUser || message.translation) return;
    
    try {
      const translatedText = await translateText(message.content, 'it', 'en');
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, translation: translatedText } : msg
        )
      );
    } catch (error) {
      console.error('Translation error:', error);
    }
  };
  
  const handleStartRecording = async () => {
    if (isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setAudioChunks([]);
      setIsRecording(true);
      setAudioRecorder(recorder);
      
      recorder.ondataavailable = (e) => {
        setAudioChunks(prev => [...prev, e.data]);
      };
      
      recorder.onstop = handleRecordingStopped;
      
      recorder.start();
      
      toast({
        title: "Recording Started",
        description: "Speak now... Click the microphone again to stop recording."
      });
    } catch (error: any) {
      toast({
        title: "Recording Error",
        description: error.message || "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const handleStopRecording = () => {
    if (audioRecorder && isRecording) {
      audioRecorder.stop();
      audioRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleRecordingStopped = async () => {
    setIsRecording(false);
    
    if (audioChunks.length === 0) return;
    
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      
      const { transcribedText } = await analyzeSpeech(audioBlob, "");
      
      setInput(transcribedText);
      
      toast({
        title: "Speech Recognized",
        description: "Your speech has been transcribed. You can edit it before sending."
      });
    } catch (error: any) {
      toast({
        title: "Speech Recognition Error",
        description: error.message || "Failed to recognize speech. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleClearConversation = () => {
    const welcomeMessage = messages[0];
    setMessages([welcomeMessage]);
    setInput('');
    toast({
      title: "Conversation Cleared",
      description: "The conversation history has been cleared."
    });
  };
  
  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      <CardHeader className="px-4 py-2 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/assets/ai-assistant.png" alt={assistantName} />
              <AvatarFallback>{assistantName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{assistantName}</h3>
              <p className="text-xs text-muted-foreground">Italian Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-translation"
                checked={displayTranslation}
                onCheckedChange={setDisplayTranslation}
                className="data-[state=checked]:bg-green-500"
              />
              <Label htmlFor="show-translation" className="text-xs">
                <Languages className="h-3 w-3 inline mr-1" />
                Translations
              </Label>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClearConversation}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {!message.isUser && message.translation && displayTranslation && (
                <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-muted-foreground italic">{message.translation}</p>
                </div>
              )}
              
              {!message.isUser && (
                <div className="flex items-center justify-end mt-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePlayAudio(message)}
                    disabled={isPlayingAudio}
                  >
                    {isPlayingAudio ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-muted rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t">
        <div className="w-full space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message in English or Italian..."
            className="resize-none"
            rows={2}
            disabled={isProcessing || isTyping}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={isRecording ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
              >
                <Mic className="h-4 w-4 mr-1" />
                {isRecording ? 'Stop' : 'Speak'}
              </Button>
              
              {user?.isPremium ? (
                <Badge variant="secondary" className="h-7">Premium</Badge>
              ) : (
                <Badge variant="outline" className="h-7">
                  {5 - (hasReachedLimit('aiSuggestions') ? 5 : 0)} chats left
                </Badge>
              )}
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isProcessing || isTyping}
              size="sm"
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
