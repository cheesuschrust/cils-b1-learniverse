
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import ChatbotService from '@/services/ChatbotService';
import { ChatMessage, ChatSession } from '@/types/chatbot';
import { v4 as uuidv4 } from 'uuid';
import { 
  Send, 
  PaperclipIcon, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  Bot, 
  Lightbulb, 
  Clock, 
  Settings, 
  MessageSquare, 
  UserCircle, 
  ChevronDown, 
  Info, 
  X, 
  Loader, 
  XCircle, 
  Bot as BotIcon
} from 'lucide-react';

const EnhancedChatbot: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'What features are included in the premium plan?',
    'How do I reset my password?',
    'Where can I find speaking exercises?',
    'How many questions do I get per day?'
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat session
  useEffect(() => {
    if (!session) {
      const newSession = ChatbotService.createSession(user?.id);
      setSession(newSession);
    }
  }, [user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return;
    
    setIsLoading(true);
    
    try {
      await ChatbotService.sendMessage(session.id, inputValue);
      setInputValue('');
      setTypingIndicator(true);
      
      // Simulate bot typing delay
      setTimeout(() => {
        setTypingIndicator(false);
        
        // Refresh session
        const updatedSession = ChatbotService.getSession(session.id);
        if (updatedSession) {
          setSession(updatedSession);
        }
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFeedback = (messageId: string, helpful: boolean) => {
    if (!session) return;
    
    ChatbotService.provideFeedback(session.id, messageId, helpful);
    
    toast({
      title: helpful ? 'Thank you for your feedback!' : 'We appreciate your feedback',
      description: helpful 
        ? 'We\'re glad this response was helpful.' 
        : 'We\'ll use your feedback to improve our responses.',
    });
    
    // Update the session to show the feedback in the UI
    const updatedSession = ChatbotService.getSession(session.id);
    if (updatedSession) {
      setSession(updatedSession);
    }
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };
  
  const handleEscalateToHuman = () => {
    if (!session) return;
    
    ChatbotService.escalateToHuman(session.id);
    
    // Update the session
    const updatedSession = ChatbotService.getSession(session.id);
    if (updatedSession) {
      setSession(updatedSession);
      
      toast({
        title: 'Request Submitted',
        description: 'Your conversation has been escalated to our support team. We\'ll get back to you soon.',
      });
    }
  };
  
  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-[350px] sm:w-[400px] h-[550px] shadow-xl flex flex-col z-50">
          <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/assets/bot-avatar.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">LinguaBot</CardTitle>
                <p className="text-xs text-muted-foreground">Italian Learning Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-4">
              {session?.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  {!message.isUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <AvatarImage src="/assets/bot-avatar.png" />
                      <AvatarFallback><BotIcon className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg p-3",
                        message.isUser
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    
                    {!message.isUser && !message.feedback && (
                      <div className="flex items-center mt-1 ml-2 space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              onClick={() => handleFeedback(message.id, true)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Helpful</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              onClick={() => handleFeedback(message.id, false)}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Not helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                    
                    {!message.isUser && message.feedback && (
                      <div className="flex items-center mt-1 ml-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Feedback received
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {message.isUser && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                      <AvatarImage src={user?.avatar || ''} />
                      <AvatarFallback><UserCircle className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {typingIndicator && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                    <AvatarImage src="/assets/bot-avatar.png" />
                    <AvatarFallback><BotIcon className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                    <div className="flex space-x-1 items-center">
                      <div className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 rounded-full bg-foreground/60 animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {session?.escalatedToHuman && (
                <div className="bg-yellow-100 dark:bg-yellow-950 p-3 rounded-lg text-sm my-4 border border-yellow-300 dark:border-yellow-800">
                  <p className="flex items-center font-medium">
                    <Clock className="h-4 w-4 mr-1" />
                    Support Request Submitted
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Your request has been escalated to our support team. Someone will respond to you shortly.
                  </p>
                </div>
              )}
              
              {suggestedQuestions.length > 0 && !session?.escalatedToHuman && session?.messages.length === 1 && (
                <div className="my-4">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Suggested questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs py-1 h-auto text-left justify-start"
                        onClick={() => handleSuggestedQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <CardFooter className="p-2 border-t flex flex-col gap-2">
            {!session?.escalatedToHuman ? (
              <>
                <div className="flex-1 flex items-center w-full space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    disabled={isLoading}
                  >
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading || session?.escalatedToHuman}
                      className="w-full"
                    />
                  </div>
                  <Button
                    size="icon"
                    className="flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                  >
                    {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </div>
                
                {session?.messages.length > 3 && (
                  <div className="w-full text-center">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs"
                      onClick={handleEscalateToHuman}
                    >
                      <UserCircle className="h-3 w-3 mr-1" />
                      Speak with a human agent
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground p-2">
                <p>Our support team has been notified.</p>
                <p>We'll respond as soon as possible.</p>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default EnhancedChatbot;
