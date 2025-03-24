
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import * as AIService from '@/services/AIService';
import { useAuth } from '@/contexts/AuthContext';
import { useSystemLog } from '@/hooks/use-system-log';

const SupportChat: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([
    { text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { logUserAction } = useSystemLog();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { text: inputValue, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Log the user's support chat action
      logUserAction(`Sent message to AI support: ${inputValue.substring(0, 50)}${inputValue.length > 50 ? '...' : ''}`);

      // Get AI response
      const response = await AIService.generateText(
        `CONTEXT: This is a support chat for a language learning platform.
         USER: ${inputValue}
         Please provide a helpful, concise response as a support assistant for a language learning platform. 
         Limit your response to 3 paragraphs maximum.`
      );

      // Add AI response
      setMessages(prev => [
        ...prev, 
        { 
          text: response, 
          isUser: false, 
          timestamp: new Date() 
        }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          text: "I'm sorry, I'm having trouble responding right now. Please try again later.", 
          isUser: false, 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with AI Support</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4 mb-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <Avatar className="h-8 w-8 mr-2">
                  <div className="bg-primary text-white w-full h-full flex items-center justify-center rounded-full">
                    AI
                  </div>
                </Avatar>
              )}
              
              <div 
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  message.isUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm mb-1">{message.text}</div>
                <div className="text-xs opacity-70 text-right">
                  {formatTime(message.timestamp)}
                </div>
              </div>
              
              {message.isUser && (
                <Avatar className="h-8 w-8 ml-2">
                  <div className="bg-muted-foreground text-white w-full h-full flex items-center justify-center rounded-full">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportChat;
