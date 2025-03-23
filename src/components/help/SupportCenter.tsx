
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { HelpCircle, Send, Mail, CheckCircle, Search, MessagesSquare, BookOpen } from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'open' | 'replied' | 'closed';
  replies?: {
    id: string;
    message: string;
    createdAt: string;
    fromSupport: boolean;
  }[];
}

const SupportCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      subject: 'Problem with audio playback',
      message: 'I\'m having trouble getting the audio to play on the exercises.',
      createdAt: '2023-09-15T10:30:00Z',
      status: 'replied',
      replies: [
        {
          id: '1-1',
          message: 'Have you allowed microphone permissions in your browser?',
          createdAt: '2023-09-15T11:45:00Z',
          fromSupport: true
        },
        {
          id: '1-2',
          message: 'Yes, I checked that. It seems like the problem happens only on certain lessons.',
          createdAt: '2023-09-15T12:10:00Z',
          fromSupport: false
        }
      ]
    },
    {
      id: '2',
      subject: 'Subscription question',
      message: 'Can I use the same subscription on multiple devices?',
      createdAt: '2023-09-10T14:22:00Z',
      status: 'closed',
      replies: [
        {
          id: '2-1',
          message: 'Yes, your subscription allows usage on up to 3 devices simultaneously.',
          createdAt: '2023-09-10T15:30:00Z',
          fromSupport: true
        },
        {
          id: '2-2',
          message: 'Thank you for the information!',
          createdAt: '2023-09-10T16:05:00Z',
          fromSupport: false
        },
        {
          id: '2-3',
          message: 'You\'re welcome! Let us know if you have any other questions.',
          createdAt: '2023-09-10T16:45:00Z',
          fromSupport: true
        }
      ]
    }
  ]);
  
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both the subject and message fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTicket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        subject: ticketSubject,
        message: ticketMessage,
        createdAt: new Date().toISOString(),
        status: 'open'
      };
      
      setTickets(prev => [newTicket, ...prev]);
      
      toast({
        title: "Ticket Submitted",
        description: "Your support ticket has been successfully submitted.",
      });
      
      setTicketSubject('');
      setTicketMessage('');
      setActiveTab('tickets');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: "Error",
        description: "Failed to submit your ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredTickets = tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="mx-auto max-w-4xl p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact" className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Support
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center justify-center gap-2">
            <MessagesSquare className="h-4 w-4" />
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center justify-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Submit a support ticket and our team will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitTicket}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide details about your question or issue..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="min-h-[150px]"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Response time: typically within 24 hours
                </p>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>
                View and manage your existing support tickets
              </CardDescription>
              <div className="mt-2 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <div key={ticket.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(ticket.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              ticket.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                              ticket.status === 'replied' ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.status === 'open' ? 'Open' : 
                               ticket.status === 'replied' ? 'Replied' : 'Closed'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border-t">
                        <p className="text-sm">{ticket.message}</p>
                      </div>
                      
                      {ticket.replies && ticket.replies.length > 0 && (
                        <div className="border-t">
                          {ticket.replies.map(reply => (
                            <div key={reply.id} className={`p-4 ${reply.fromSupport ? 'bg-muted/20' : 'bg-white'} border-b last:border-b-0`}>
                              <div className="flex justify-between">
                                <span className="text-xs font-medium">
                                  {reply.fromSupport ? 'Support Team' : 'You'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(reply.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-2 text-sm">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {ticket.status !== 'closed' && (
                        <div className="p-4 border-t">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Add a reply..."
                              className="flex-1"
                            />
                            <Button variant="secondary">Reply</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <MessagesSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No tickets found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery ? 'No tickets match your search query.' : 'You haven\'t submitted any support tickets yet.'}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('contact')}
                    >
                      Create a New Ticket
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">How do I reset my password?</h3>
                  <p className="text-muted-foreground">
                    Click on the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your inbox.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Can I use the app on multiple devices?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can use your account on multiple devices. Your progress and settings will synchronize across all of them.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">How do I change my default voice settings?</h3>
                  <p className="text-muted-foreground">
                    Go to your Profile settings, then navigate to the "Voice Preferences" tab. There you can select your preferred voices for both Italian and English.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">What's the difference between free and premium accounts?</h3>
                  <p className="text-muted-foreground">
                    Premium accounts have access to all learning materials, unlimited practice exercises, and no ads. Free accounts have limited access to content and features.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">How often is new content added?</h3>
                  <p className="text-muted-foreground">
                    We add new content weekly, including vocabulary lists, practice exercises, and test questions.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Is there an offline mode?</h3>
                  <p className="text-muted-foreground">
                    Currently, an internet connection is required to use the app. We're working on an offline mode for premium users that will be available in a future update.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">How do I cancel my subscription?</h3>
                  <p className="text-muted-foreground">
                    You can cancel your subscription from your account settings under the "Subscription" tab. Cancellations take effect at the end of your current billing cycle.
                  </p>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <p className="text-center">
                    Didn't find what you're looking for?{" "}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab('contact')}>
                      Contact our support team
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportCenter;
