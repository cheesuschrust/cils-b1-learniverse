
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  MessageCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  Plus, 
  User, 
  Calendar, 
  Tag, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  ArrowRightLeft,
  Users,
  Send
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import TicketList, { SupportTicketProps } from '@/components/tickets/TicketList';
import SupportTicketItem from '@/components/tickets/SupportTicketItem';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const SupportTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for tickets
  const [tickets, setTickets] = useState<SupportTicketProps[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicketProps[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for ticket reply
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // State for new ticket
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general',
    email: '',
    name: ''
  });
  
  // State for ticket assignment
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  
  // Fetch tickets (mock data for now)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTickets: SupportTicketProps[] = [
        {
          id: "ticket-1",
          subject: "Problem with flashcard review system",
          message: "I've been using the flashcard review system for a week now, but I noticed that cards I mark as 'difficult' still appear with the same frequency as other cards. Shouldn't they appear more often?",
          status: "pending",
          priority: "medium",
          category: "feature",
          createdAt: new Date('2023-08-20T14:32:00'),
          updatedAt: new Date('2023-08-20T14:32:00'),
          userId: "user-1",
          userEmail: "maria@example.com",
          userName: "Maria Garcia",
          user: {
            id: "user-1",
            name: "Maria Garcia",
            email: "maria@example.com",
            avatar: ""
          },
          messages: [
            {
              id: "msg-1",
              content: "I've been using the flashcard review system for a week now, but I noticed that cards I mark as 'difficult' still appear with the same frequency as other cards. Shouldn't they appear more often?",
              timestamp: '2023-08-20T14:32:00',
              isAdmin: false
            }
          ]
        },
        {
          id: "ticket-2",
          subject: "Cannot access premium content",
          message: "I subscribed to the premium plan yesterday, but I still can't access any of the premium lessons. My account page shows that I have an active subscription. Please help!",
          status: "in-progress",
          priority: "high",
          category: "billing",
          createdAt: new Date('2023-08-19T09:15:00'),
          updatedAt: new Date('2023-08-19T15:42:00'),
          userId: "user-2",
          userEmail: "john@example.com",
          userName: "John Smith",
          user: {
            id: "user-2",
            name: "John Smith",
            email: "john@example.com",
            avatar: ""
          },
          messages: [
            {
              id: "msg-2-1",
              content: "I subscribed to the premium plan yesterday, but I still can't access any of the premium lessons. My account page shows that I have an active subscription. Please help!",
              timestamp: '2023-08-19T09:15:00',
              isAdmin: false
            },
            {
              id: "msg-2-2",
              content: "Hi John, thanks for reaching out. I'm sorry you're having trouble accessing premium content. Let me check your subscription status and get back to you shortly.",
              timestamp: '2023-08-19T10:23:00',
              isAdmin: true
            },
            {
              id: "msg-2-3",
              content: "Thank you for looking into this. I've tried logging out and back in, but it didn't help.",
              timestamp: '2023-08-19T11:05:00',
              isAdmin: false
            }
          ],
          assignedTo: "Admin User"
        },
        {
          id: "ticket-3",
          subject: "Audio pronounciation not working",
          message: "The audio pronunciation feature isn't working on any of the vocabulary words. I've tried on both Chrome and Firefox browsers. There's no error message, the button just doesn't do anything when clicked.",
          status: "resolved",
          priority: "medium",
          category: "technical",
          createdAt: new Date('2023-08-18T16:20:00'),
          updatedAt: new Date('2023-08-19T11:45:00'),
          userId: "user-3",
          userEmail: "sophia@example.com",
          userName: "Sophia Lee",
          user: {
            id: "user-3",
            name: "Sophia Lee",
            email: "sophia@example.com",
            avatar: ""
          },
          messages: [
            {
              id: "msg-3-1",
              content: "The audio pronunciation feature isn't working on any of the vocabulary words. I've tried on both Chrome and Firefox browsers. There's no error message, the button just doesn't do anything when clicked.",
              timestamp: '2023-08-18T16:20:00',
              isAdmin: false
            },
            {
              id: "msg-3-2",
              content: "Hi Sophia, thank you for reporting this issue. Could you please tell me which operating system you're using and if you have any audio blockers or privacy extensions installed?",
              timestamp: '2023-08-18T17:15:00',
              isAdmin: true
            },
            {
              id: "msg-3-3",
              content: "I'm using Windows 10, and I do have uBlock Origin installed. Should I try disabling it?",
              timestamp: '2023-08-18T18:02:00',
              isAdmin: false
            },
            {
              id: "msg-3-4",
              content: "Yes, please try disabling uBlock Origin for our site and see if that resolves the issue. Some audio features can be blocked by privacy extensions.",
              timestamp: '2023-08-19T09:30:00',
              isAdmin: true
            },
            {
              id: "msg-3-5",
              content: "That fixed it! Thank you so much for your help. I'll add your site to the whitelist in uBlock.",
              timestamp: '2023-08-19T10:15:00',
              isAdmin: false
            },
            {
              id: "msg-3-6",
              content: "Great! I'm glad that resolved the issue. Please don't hesitate to reach out if you encounter any other problems.",
              timestamp: '2023-08-19T11:45:00',
              isAdmin: true
            }
          ]
        },
        {
          id: "ticket-4",
          subject: "Request for business Italian content",
          message: "I'm learning Italian for business purposes. Could you add more content related to business vocabulary, meetings, and professional communication? It would be very helpful for those of us using Italian in a professional context.",
          status: "pending",
          priority: "low",
          category: "feature_request",
          createdAt: new Date('2023-08-17T13:10:00'),
          updatedAt: new Date('2023-08-17T13:10:00'),
          userId: "user-4",
          userEmail: "robert@example.com",
          userName: "Robert Johnson",
          user: {
            id: "user-4",
            name: "Robert Johnson",
            email: "robert@example.com",
            avatar: ""
          },
          messages: [
            {
              id: "msg-4",
              content: "I'm learning Italian for business purposes. Could you add more content related to business vocabulary, meetings, and professional communication? It would be very helpful for those of us using Italian in a professional context.",
              timestamp: '2023-08-17T13:10:00',
              isAdmin: false
            }
          ]
        },
        {
          id: "ticket-5",
          subject: "App crashes during listening exercise",
          message: "The app keeps crashing when I'm doing the advanced listening exercises. It happens about 30 seconds into the exercise, every time I try. I'm using an iPhone 12 with the latest iOS.",
          status: "in-progress",
          priority: "high",
          category: "bug",
          createdAt: new Date('2023-08-16T10:05:00'),
          updatedAt: new Date('2023-08-17T09:30:00'),
          userId: "user-5",
          userEmail: "elena@example.com",
          userName: "Elena Costa",
          user: {
            id: "user-5",
            name: "Elena Costa",
            email: "elena@example.com",
            avatar: ""
          },
          messages: [
            {
              id: "msg-5-1",
              content: "The app keeps crashing when I'm doing the advanced listening exercises. It happens about 30 seconds into the exercise, every time I try. I'm using an iPhone 12 with the latest iOS.",
              timestamp: '2023-08-16T10:05:00',
              isAdmin: false
            },
            {
              id: "msg-5-2",
              content: "Hello Elena, I'm sorry to hear you're experiencing crashes. We'll look into this right away. Could you please tell me which specific listening exercise is causing the problem?",
              timestamp: '2023-08-16T11:23:00',
              isAdmin: true
            },
            {
              id: "msg-5-3",
              content: "It's the 'Italian News Report' exercise in the Advanced Listening section. The one about climate change.",
              timestamp: '2023-08-16T12:45:00',
              isAdmin: false
            }
          ],
          assignedTo: "Support Team"
        }
      ];
      
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setIsLoading(false);
      
      // Select the first ticket by default if any exist
      if (mockTickets.length > 0) {
        setSelectedTicketId(mockTickets[0].id);
      }
    }, 1000);
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    let result = [...tickets];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.subject.toLowerCase().includes(query) || 
        ticket.message.toLowerCase().includes(query) ||
        ticket.userName.toLowerCase().includes(query) ||
        ticket.userEmail.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }
    
    setFilteredTickets(result);
  }, [searchQuery, statusFilter, priorityFilter, tickets]);
  
  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };
  
  const handleReplySubmit = () => {
    if (!replyText.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a message before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    // Find the selected ticket
    const ticketIndex = tickets.findIndex(t => t.id === selectedTicketId);
    if (ticketIndex === -1) return;
    
    // Create a new message
    const newMessage = {
      id: uuidv4(),
      content: replyText,
      timestamp: new Date().toISOString(),
      isAdmin: true
    };
    
    // Update the ticket with the new message
    const updatedTicket = {
      ...tickets[ticketIndex],
      messages: [
        ...(tickets[ticketIndex].messages || []),
        newMessage
      ],
      updatedAt: new Date(),
      status: tickets[ticketIndex].status === 'pending' ? 'in-progress' : tickets[ticketIndex].status
    };
    
    // Update the tickets array
    const newTickets = [...tickets];
    newTickets[ticketIndex] = updatedTicket;
    setTickets(newTickets);
    
    // Reset the reply text and close the dialog
    setReplyText('');
    setReplyDialogOpen(false);
    
    toast({
      title: "Reply sent",
      description: "Your response has been added to the ticket.",
    });
  };
  
  const handleNewTicketSubmit = () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim() || !newTicket.email.trim() || !newTicket.name.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new ticket
    const ticket: SupportTicketProps = {
      id: uuidv4(),
      subject: newTicket.subject,
      message: newTicket.message,
      status: 'pending',
      priority: newTicket.priority as SupportTicketProps['priority'],
      category: newTicket.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: uuidv4(), // In a real app, this would be a real user ID
      userEmail: newTicket.email,
      userName: newTicket.name,
      user: {
        id: uuidv4(),
        name: newTicket.name,
        email: newTicket.email,
        avatar: ""
      },
      messages: [
        {
          id: uuidv4(),
          content: newTicket.message,
          timestamp: new Date().toISOString(),
          isAdmin: false
        }
      ]
    };
    
    // Add the ticket to the tickets array
    setTickets(prev => [ticket, ...prev]);
    
    // Reset the new ticket form and close the dialog
    setNewTicket({
      subject: '',
      message: '',
      priority: 'medium',
      category: 'general',
      email: '',
      name: ''
    });
    setNewTicketDialogOpen(false);
    
    toast({
      title: "Ticket created",
      description: "The support ticket has been created successfully.",
    });
    
    // Select the new ticket
    setSelectedTicketId(ticket.id);
  };
  
  const handleStatusChange = (ticketId: string, newStatus: SupportTicketProps['status']) => {
    // Find the ticket
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) return;
    
    // Update the ticket status
    const updatedTicket = {
      ...tickets[ticketIndex],
      status: newStatus,
      updatedAt: new Date()
    };
    
    // Update the tickets array
    const newTickets = [...tickets];
    newTickets[ticketIndex] = updatedTicket;
    setTickets(newTickets);
    
    toast({
      title: "Status updated",
      description: `Ticket status changed to ${newStatus}.`,
    });
  };
  
  const handlePriorityChange = (ticketId: string, newPriority: SupportTicketProps['priority']) => {
    // Find the ticket
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) return;
    
    // Update the ticket priority
    const updatedTicket = {
      ...tickets[ticketIndex],
      priority: newPriority,
      updatedAt: new Date()
    };
    
    // Update the tickets array
    const newTickets = [...tickets];
    newTickets[ticketIndex] = updatedTicket;
    setTickets(newTickets);
    
    toast({
      title: "Priority updated",
      description: `Ticket priority changed to ${newPriority}.`,
    });
  };
  
  const handleAssign = () => {
    if (!selectedAgent) {
      toast({
        title: "No agent selected",
        description: "Please select an agent to assign the ticket to.",
        variant: "destructive"
      });
      return;
    }
    
    // Find the selected ticket
    const ticketIndex = tickets.findIndex(t => t.id === selectedTicketId);
    if (ticketIndex === -1) return;
    
    // Update the ticket with the assigned agent
    const updatedTicket = {
      ...tickets[ticketIndex],
      assignedTo: selectedAgent,
      updatedAt: new Date(),
      status: tickets[ticketIndex].status === 'pending' ? 'in-progress' : tickets[ticketIndex].status
    };
    
    // Update the tickets array
    const newTickets = [...tickets];
    newTickets[ticketIndex] = updatedTicket;
    setTickets(newTickets);
    
    // Reset the selected agent and close the dialog
    setSelectedAgent('');
    setAssignDialogOpen(false);
    
    toast({
      title: "Ticket assigned",
      description: `Ticket has been assigned to ${selectedAgent}.`,
    });
  };
  
  // Find the selected ticket
  const selectedTicket = tickets.find(ticket => ticket.id === selectedTicketId);
  
  return (
    <ProtectedRoute requireAdmin>
      <Helmet>
        <title>Support Tickets | Admin Dashboard</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">Manage customer support requests and inquiries</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setNewTicketDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Ticket List</CardTitle>
                
                <div className="flex flex-col gap-3 mt-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tickets..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden">
                <Tabs defaultValue="all" className="h-full flex flex-col">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="flex-1 overflow-hidden">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredTickets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No tickets found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                      </div>
                    ) : (
                      <TicketList 
                        tickets={filteredTickets}
                        onSelectTicket={handleTicketSelect}
                        selectedTicketId={selectedTicketId || undefined}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="pending" className="flex-1 overflow-hidden">
                    <TicketList 
                      tickets={filteredTickets.filter(t => t.status === 'pending')}
                      onSelectTicket={handleTicketSelect}
                      selectedTicketId={selectedTicketId || undefined}
                    />
                  </TabsContent>
                  
                  <TabsContent value="in-progress" className="flex-1 overflow-hidden">
                    <TicketList 
                      tickets={filteredTickets.filter(t => t.status === 'in-progress')}
                      onSelectTicket={handleTicketSelect}
                      selectedTicketId={selectedTicketId || undefined}
                    />
                  </TabsContent>
                  
                  <TabsContent value="resolved" className="flex-1 overflow-hidden">
                    <TicketList 
                      tickets={filteredTickets.filter(t => t.status === 'resolved' || t.status === 'closed')}
                      onSelectTicket={handleTicketSelect}
                      selectedTicketId={selectedTicketId || undefined}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3 flex flex-row justify-between items-start">
                <CardTitle className="text-lg font-medium">
                  {selectedTicket ? 'Ticket Details' : 'Select a Ticket'}
                </CardTitle>
                
                {selectedTicket && (
                  <div className="flex gap-2">
                    <Select
                      value={selectedTicket.priority}
                      onValueChange={(value) => handlePriorityChange(
                        selectedTicket.id, 
                        value as SupportTicketProps['priority']
                      )}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(value) => handleStatusChange(
                        selectedTicket.id, 
                        value as SupportTicketProps['status']
                      )}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 overflow-auto pb-6">
                {!selectedTicket ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Ticket Selected</h3>
                    <p className="text-muted-foreground max-w-md">
                      Select a ticket from the list to view its details and respond to the customer.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <h2 className="text-xl font-semibold">{selectedTicket.subject}</h2>
                        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1" />
                            <span>{selectedTicket.userName}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>{format(new Date(selectedTicket.createdAt), 'MMM dd, yyyy')}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center">
                            <Tag className="h-3.5 w-3.5 mr-1" />
                            <span className="capitalize">{selectedTicket.category}</span>
                          </div>
                          {selectedTicket.assignedTo && (
                            <>
                              <span>•</span>
                              <div className="flex items-center">
                                <Info className="h-3.5 w-3.5 mr-1" />
                                <span>Assigned to: {selectedTicket.assignedTo}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setAssignDialogOpen(true)}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                        
                        <Button 
                          size="sm"
                          onClick={() => setReplyDialogOpen(true)}
                          disabled={selectedTicket.status === 'closed'}
                        >
                          <ArrowRightLeft className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <SupportTicketItem
                      {...selectedTicket}
                      onReply={() => setReplyDialogOpen(true)}
                      onClose={selectedTicket.status !== 'closed' ? 
                        () => handleStatusChange(selectedTicket.id, 'closed') : 
                        undefined
                      }
                      onReopen={selectedTicket.status === 'closed' ? 
                        () => handleStatusChange(selectedTicket.id, 'in-progress') : 
                        undefined
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
            <DialogDescription>
              Respond to the customer's support request. This message will be added to the ticket thread.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-3 rounded-md text-sm">
                <div className="font-medium">Original message:</div>
                <p className="mt-1">{selectedTicket.message}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea
                  id="reply"
                  placeholder="Type your response here..."
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReplySubmit}>
              <Send className="mr-2 h-4 w-4" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Ticket Dialog */}
      <Dialog open={newTicketDialogOpen} onOpenChange={setNewTicketDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Create a new support ticket on behalf of a user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  placeholder="Full name"
                  value={newTicket.name}
                  onChange={(e) => setNewTicket({...newTicket, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Customer Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={newTicket.email}
                  onChange={(e) => setNewTicket({...newTicket, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature_request">Feature Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Detailed description of the issue..."
                rows={5}
                value={newTicket.message}
                onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTicketDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleNewTicketSubmit}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Ticket Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Assign this ticket to a support agent or team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent">Select Agent</Label>
              <Select
                value={selectedAgent}
                onValueChange={setSelectedAgent}
              >
                <SelectTrigger id="agent">
                  <SelectValue placeholder="Select agent or team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin User">Admin User</SelectItem>
                  <SelectItem value="Support Team">Support Team</SelectItem>
                  <SelectItem value="Technical Support">Technical Support</SelectItem>
                  <SelectItem value="Billing Department">Billing Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedTicket && (
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">Ticket Information:</div>
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Subject:</span> {selectedTicket.subject}</div>
                  <div><span className="font-medium">Customer:</span> {selectedTicket.userName}</div>
                  <div><span className="font-medium">Priority:</span> {selectedTicket.priority}</div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <Badge className="ml-2" variant="outline">{selectedTicket.status}</Badge>
                  </div>
                  {selectedTicket.assignedTo && (
                    <div><span className="font-medium">Currently Assigned:</span> {selectedTicket.assignedTo}</div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign}>Assign Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
};

export default SupportTicketsPage;
