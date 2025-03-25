
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip } from '@/components/ui/tooltip';
import { 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Paperclip, 
  HelpCircle, 
  User, 
  ChevronRight, 
  Loader2
} from 'lucide-react';
import ChatbotService from '@/services/ChatbotService';
import { ChatMessage, ChatSession } from '@/types/chatbot';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedChatbotProps {
  className?: string;
  showHeader?: boolean;
  maxHeight?: string;
}

const EnhancedChatbot: React.FC<EnhancedChatbotProps> = ({ 
  className = '', 
  showHeader = true,
  maxHeight = '500px'
}) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'What does the premium plan include?',
    'How can I practice speaking Italian?',
    'How do flashcards work?',
    'How many questions do I get per day?'
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initialize chat session
  useEffect(() => {
    const newSession = ChatbotService.createSession(user?.id);
    setSession(newSession);
  }, [user?.id]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return;
    
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Simulate typing indicator
      setIsTyping(true);
      
      // Send message to chatbot service
      await ChatbotService.sendMessage(session.id, inputValue);
      
      // Get updated session
      const updatedSession = ChatbotService.getSession(session.id);
      if (updatedSession) {
        setSession(updatedSession);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Delay to simulate typing
      setTimeout(() => {
        setIsTyping(false);
        setIsLoading(false);
      }, 800);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real implementation, we would upload the file to a server
    toast({
      title: "File Attached",
      description: `${files[0].name} has been attached to your message.`,
    });
  };
  
  const handleFeedback = (messageId: string, helpful: boolean) => {
    if (!session) return;
    
    const success = ChatbotService.provideFeedback(session.id, messageId, helpful);
    if (success) {
      toast({
        title: "Thank You",
        description: "Your feedback helps us improve our responses.",
      });
      
      // Update the session to reflect the feedback
      const updatedSession = ChatbotService.getSession(session.id);
      if (updatedSession) {
        setSession(updatedSession);
      }
    }
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    // Optional: immediately send the suggested question
    // handleSendMessage();
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderChatMessages = () => {
    if (!session || session.messages.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No messages yet. Start by asking a question.
        </div>
      );
    }
    
    return session.messages.map((message, index) => (
      <div 
        key={message.id}
        className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!message.isUser && (
          <Avatar className="h-8 w-8 mr-2 mt-1">
            <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-xs rounded-full">
              AI
            </div>
          </Avatar>
        )}
        
        <div className="space-y-1 max-w-[80%]">
          <div 
            className={`px-4 py-2 rounded-lg ${
              message.isUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{message.text}</div>
          </div>
          
          <div className="flex justify-between items-center text-xs opacity-70 px-1">
            <span>{formatTime(message.timestamp)}</span>
            
            {!message.isUser && !message.feedback && (
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleFeedback(message.id, true)}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Helpful"
                >
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button 
                  onClick={() => handleFeedback(message.id, false)}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Not helpful"
                >
                  <ThumbsDown className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {!message.isUser && message.feedback && (
              <div className="text-xs opacity-70">
                {message.feedback.helpful ? 'Marked as helpful' : 'Marked as not helpful'}
              </div>
            )}
          </div>
        </div>
        
        {message.isUser && (
          <Avatar className="h-8 w-8 ml-2 mt-1">
            <div className="bg-muted-foreground text-white w-full h-full flex items-center justify-center text-xs rounded-full">
              {user?.firstName?.[0] || <User className="h-4 w-4" />}
            </div>
          </Avatar>
        )}
      </div>
    ));
  };
  
  return (
    <Card className={`w-full ${className}`}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-xs rounded-full">
                AI
              </div>
            </Avatar>
            LinguaBot
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        <ScrollArea className={`h-[${maxHeight}] pr-4 mb-4`} type="always">
          <div className="space-y-4 pb-4">
            {renderChatMessages()}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <Avatar className="h-8 w-8 mr-2">
                  <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-xs rounded-full">
                    AI
                  </div>
                </Avatar>
                <div className="px-4 py-2 rounded-lg bg-muted">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {suggestedQuestions.length > 0 && !isLoading && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Suggested questions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Tooltip content="Attach a file">
            <Button
              variant="outline"
              size="icon"
              onClick={handleFileUpload}
              disabled={isLoading}
              className="flex-shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </Tooltip>
          
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
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
        
        <div className="text-xs text-center text-muted-foreground">
          <div className="flex items-center justify-center">
            <HelpCircle className="h-3 w-3 mr-1" />
            <span>Need help from a real person? <a href="/support" className="underline">Contact support</a></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedChatbot;
