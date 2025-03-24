
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Check, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Search, 
  User,
  CheckCircle2,
  XCircle,
  Users,
  Calendar,
  HelpCircle,
  PencilRuler
} from 'lucide-react';

// Mock ticket data
const mockTickets = [
  {
    id: 'TICKET-1001',
    user: 'Sophie Anderson',
    email: 'sophie@example.com',
    subject: 'Problem with flashcard creation',
    status: 'open',
    priority: 'high',
    category: 'Content',
    created: '2023-10-15T14:20:00Z',
    updated: '2023-10-15T16:45:00Z',
    assigned: 'Admin User',
    messages: [
      {
        id: 1,
        user: 'Sophie Anderson',
        role: 'user',
        message: "I'm trying to create flashcards but the system keeps giving me an error when I try to save them. The error says 'Invalid content format'.",
        timestamp: '2023-10-15T14:20:00Z'
      },
      {
        id: 2,
        user: 'Admin User',
        role: 'admin',
        message: "Thank you for reporting this issue. Could you please let me know what content you're trying to add to the flashcards? Are you including any special characters or formatting?",
        timestamp: '2023-10-15T16:45:00Z'
      }
    ]
  },
  {
    id: 'TICKET-1002',
    user: 'Marco Rossi',
    email: 'marco@example.com',
    subject: 'Audio not playing in listening exercises',
    status: 'in_progress',
    priority: 'medium',
    category: 'Technical',
    created: '2023-10-14T09:15:00Z',
    updated: '2023-10-14T11:30:00Z',
    assigned: 'Tech Support',
    messages: [
      {
        id: 1,
        user: 'Marco Rossi',
        role: 'user',
        message: "I can't play any audio in the listening exercises section. I've tried on both Chrome and Firefox browsers.",
        timestamp: '2023-10-14T09:15:00Z'
      },
      {
        id: 2,
        user: 'Tech Support',
        role: 'admin',
        message: "We're looking into this issue. Could you please confirm if you've allowed microphone permissions in your browser? Also, are you using any ad-blockers that might be interfering?",
        timestamp: '2023-10-14T11:30:00Z'
      }
    ]
  },
  {
    id: 'TICKET-1003',
    user: 'Elena Bianchi',
    email: 'elena@example.com',
    subject: 'Request for additional grammar lessons',
    status: 'resolved',
    priority: 'low',
    category: 'Content Request',
    created: '2023-10-10T17:30:00Z',
    updated: '2023-10-12T14:20:00Z',
    assigned: 'Content Team',
    messages: [
      {
        id: 1,
        user: 'Elena Bianchi',
        role: 'user',
        message: "I've completed all the available grammar lessons for intermediate level. Would it be possible to add more lessons on the conditional tense and subjunctive mood?",
        timestamp: '2023-10-10T17:30:00Z'
      },
      {
        id: 2,
        user: 'Content Team',
        role: 'admin',
        message: "Thank you for your suggestion! We're actually planning to add more lessons on those topics next month. In the meantime, have you checked out our supplementary resources section?",
        timestamp: '2023-10-11T09:45:00Z'
      },
      {
        id: 3,
        user: 'Elena Bianchi',
        role: 'user',
        message: "Yes, I found the resources helpful. Looking forward to the new lessons!",
        timestamp: '2023-10-11T12:20:00Z'
      },
      {
        id: 4,
        user: 'Content Team',
        role: 'admin',
        message: "Great! We've marked this as resolved, but feel free to reopen if you have any other questions.",
        timestamp: '2023-10-12T14:20:00Z'
      }
    ]
  },
  {
    id: 'TICKET-1004',
    user: 'Thomas Weber',
    email: 'thomas@example.com',
    subject: 'Account login issues',
    status: 'pending',
    priority: 'high',
    category: 'Account',
    created: '2023-10-16T08:10:00Z',
    updated: '2023-10-16T08:10:00Z',
    assigned: 'Unassigned',
    messages: [
      {
        id: 1,
        user: 'Thomas Weber',
        role: 'user',
        message: "I can't log into my account. I've tried resetting my password multiple times but I never receive the reset email.",
        timestamp: '2023-10-16T08:10:00Z'
      }
    ]
  },
  {
    id: 'TICKET-1005',
    user: 'Julia Kim',
    email: 'julia@example.com',
    subject: 'Billing question',
    status: 'closed',
    priority: 'medium',
    category: 'Billing',
    created: '2023-10-05T16:40:00Z',
    updated: '2023-10-06T10:15:00Z',
    assigned: 'Finance Team',
    messages: [
      {
        id: 1,
        user: 'Julia Kim',
        role: 'user',
        message: "I was charged twice for my monthly subscription. Could you please look into this and refund the extra charge?",
        timestamp: '2023-10-05T16:40:00Z'
      },
      {
        id: 2,
        user: 'Finance Team',
        role: 'admin',
        message: "We've verified the double charge and processed a refund for the extra payment. It should appear in your account within 3-5 business days. We apologize for the inconvenience.",
        timestamp: '2023-10-06T10:15:00Z'
      }
    ]
  }
];

const SupportTickets = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(mockTickets);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  
  const filteredTickets = tickets.filter(ticket => {
    // Filter by tab
    if (activeTab !== 'all' && ticket.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.id.toLowerCase().includes(query) ||
        ticket.user.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };
  
  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    
    setIsReplying(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === selectedTicket?.id) {
          const updatedTicket = {
            ...ticket,
            status: 'in_progress',
            updated: new Date().toISOString(),
            messages: [
              ...ticket.messages,
              {
                id: ticket.messages.length + 1,
                user: 'Admin User',
                role: 'admin',
                message: replyText,
                timestamp: new Date().toISOString()
              }
            ]
          };
          setSelectedTicket(updatedTicket);
          return updatedTicket;
        }
        return ticket;
      });
      
      setTickets(updatedTickets);
      setReplyText('');
      setIsReplying(false);
      
      toast({
        title: 'Reply Sent',
        description: 'Your response has been added to the ticket.',
      });
    }, 1000);
  };
  
  const handleStatusChange = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedTicket = {
          ...ticket,
          status: newStatus,
          updated: new Date().toISOString()
        };
        
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(updatedTicket);
        }
        
        return updatedTicket;
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    toast({
      title: 'Status Updated',
      description: `Ticket ${ticketId} has been marked as ${newStatus.replace('_', ' ')}.`,
    });
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      open: { label: 'Open', variant: 'default', icon: <Clock className="h-3 w-3 mr-1" /> },
      in_progress: { label: 'In Progress', variant: 'warning', icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
      pending: { label: 'Pending', variant: 'secondary', icon: <HelpCircle className="h-3 w-3 mr-1" /> },
      resolved: { label: 'Resolved', variant: 'success', icon: <Check className="h-3 w-3 mr-1" /> },
      closed: { label: 'Closed', variant: 'outline', icon: <XCircle className="h-3 w-3 mr-1" /> }
    };
    
    const { label, variant, icon } = statusMap[status] || statusMap.open;
    
    return (
      <Badge variant={variant} className="flex items-center">
        {icon}
        {label}
      </Badge>
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage and respond to user support requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Tickets</DialogTitle>
                <DialogDescription>
                  Set filters to narrow down the ticket list
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <Select defaultValue="all" className="col-span-3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Priority</Label>
                  <Select defaultValue="all" className="col-span-3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Category</Label>
                  <Select defaultValue="all" className="col-span-3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Assigned To</Label>
                  <Select defaultValue="all" className="col-span-3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Staff</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="me">Assigned to Me</SelectItem>
                      <SelectItem value="tech">Tech Support</SelectItem>
                      <SelectItem value="content">Content Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Ticket List</CardTitle>
              <CardDescription>
                {filteredTickets.length} tickets found
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <div className="px-4">
                <TabsList className="w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <CardContent className="p-0">
                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map(ticket => (
                        <div 
                          key={ticket.id}
                          className={`p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${
                            selectedTicket?.id === ticket.id ? 'bg-secondary/70' : ''
                          }`}
                          onClick={() => handleSelectTicket(ticket)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm truncate">{ticket.subject}</h3>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <User className="h-3 w-3" />
                            <span>{ticket.user}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div>{ticket.id}</div>
                            <div>{formatDate(ticket.updated)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                        <p>No tickets found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="open" className="m-0">
                {/* Similar content structure for open tickets */}
              </TabsContent>
              
              <TabsContent value="in_progress" className="m-0">
                {/* Similar content structure for in-progress tickets */}
              </TabsContent>
              
              <TabsContent value="resolved" className="m-0">
                {/* Similar content structure for resolved tickets */}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                    <CardDescription>
                      {selectedTicket.id} • Opened {formatDate(selectedTicket.created)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(selectedTicket.status)}
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="grid gap-4 mb-4 md:grid-cols-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Requester</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{selectedTicket.user}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{selectedTicket.email}</div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Assigned To</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{selectedTicket.assigned || 'Unassigned'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Category</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <PencilRuler className="h-3 w-3 text-muted-foreground" />
                      <span>{selectedTicket.category}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{formatDate(selectedTicket.updated)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-1 mb-4">
                  <div className="flex justify-between items-center bg-secondary/50 rounded-sm px-3 py-2 text-sm font-medium">
                    <span>Conversation History</span>
                    <span>{selectedTicket.messages.length} message{selectedTicket.messages.length !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto p-3 space-y-4">
                    {selectedTicket.messages.map(message => (
                      <div key={message.id} className={`flex gap-3 ${message.role === 'admin' ? 'justify-end' : ''}`}>
                        <div className={`max-w-[80%] ${message.role === 'admin' ? 'order-2' : ''}`}>
                          <div className={`rounded-lg p-3 ${
                            message.role === 'admin' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                            message.role === 'admin' ? 'justify-end' : ''
                          }`}>
                            <span>{message.user}</span>
                            <span>•</span>
                            <span>{formatDate(message.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reply">Reply</Label>
                  <Textarea 
                    id="reply" 
                    placeholder="Type your response..."
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between mt-4">
                  <div className="flex gap-2">
                    <Select 
                      value={selectedTicket.status}
                      onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Assign to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin User</SelectItem>
                        <SelectItem value="tech">Tech Support</SelectItem>
                        <SelectItem value="content">Content Team</SelectItem>
                        <SelectItem value="finance">Finance Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    disabled={!replyText.trim() || isReplying}
                    onClick={handleReplySubmit}
                  >
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="py-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Ticket Selected</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select a ticket from the list to view details and respond to user inquiries.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for labels
const Label = ({ className, children, ...props }) => {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default SupportTickets;
