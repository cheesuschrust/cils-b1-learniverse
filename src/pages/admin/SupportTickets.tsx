
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, UserCircle, Search, Filter, PlusCircle, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import TicketList, { SupportTicketProps, SupportTicketStatus, SupportTicketPriority } from '@/components/tickets/TicketList';

const SupportTickets = () => {
  const { toast } = useToast();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setStatusPriority] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock tickets for demo
  const [tickets, setTickets] = useState<SupportTicketProps[]>([
    {
      id: "ticket-001",
      subject: "Problem with lesson audio",
      message: "I can't hear the audio in the listening exercises. I've tried multiple browsers.",
      status: "pending",
      priority: "high",
      category: "Technical",
      createdAt: new Date(2023, 3, 15).toISOString(),
      updatedAt: new Date(2023, 3, 15).toISOString(),
      userId: "user-001",
      userEmail: "john.doe@example.com",
      userName: "John Doe",
      user: {
        id: "user-001",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://github.com/shadcn.png",
      },
      messages: [
        {
          id: "msg-001",
          content: "I can't hear the audio in the listening exercises. I've tried multiple browsers.",
          timestamp: new Date(2023, 3, 15).toISOString(),
          isAdmin: false,
        },
      ],
    },
    {
      id: "ticket-002",
      subject: "Subscription charge issue",
      message: "I was charged twice for my monthly subscription. Can you please check?",
      status: "in-progress",
      priority: "urgent",
      category: "Billing",
      createdAt: new Date(2023, 3, 18).toISOString(),
      updatedAt: new Date(2023, 3, 20).toISOString(),
      userId: "user-002",
      userEmail: "jane.smith@example.com",
      userName: "Jane Smith",
      user: {
        id: "user-002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "",
      },
      messages: [
        {
          id: "msg-002",
          content: "I was charged twice for my monthly subscription. Can you please check?",
          timestamp: new Date(2023, 3, 18).toISOString(),
          isAdmin: false,
        },
        {
          id: "msg-003",
          content: "We're looking into this issue for you. We'll need to check with our payment processor.",
          timestamp: new Date(2023, 3, 20).toISOString(),
          isAdmin: true,
        },
      ],
    },
    {
      id: "ticket-003",
      subject: "Request for advanced grammar lessons",
      message: "I'd like to see more advanced Italian grammar lessons, especially covering the subjunctive mood.",
      status: "resolved",
      priority: "medium",
      category: "Content",
      createdAt: new Date(2023, 3, 10).toISOString(),
      updatedAt: new Date(2023, 3, 12).toISOString(),
      userId: "user-003",
      userEmail: "robert.johnson@example.com",
      userName: "Robert Johnson",
      user: {
        id: "user-003",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        avatar: "",
      },
      messages: [
        {
          id: "msg-004",
          content: "I'd like to see more advanced Italian grammar lessons, especially covering the subjunctive mood.",
          timestamp: new Date(2023, 3, 10).toISOString(),
          isAdmin: false,
        },
        {
          id: "msg-005",
          content: "Thanks for the suggestion! We're working on expanding our advanced grammar section.",
          timestamp: new Date(2023, 3, 11).toISOString(),
          isAdmin: true,
        },
        {
          id: "msg-006",
          content: "We've added new lessons on the subjunctive mood. Please check them out and let us know what you think!",
          timestamp: new Date(2023, 3, 12).toISOString(),
          isAdmin: true,
        },
      ],
    },
  ]);
  
  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };
  
  const selectedTicket = tickets.find(ticket => ticket.id === selectedTicketId);
  
  const getStatusIcon = (status: SupportTicketStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const filteredTickets = tickets.filter(ticket => {
    // Apply search query
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    // Apply priority filter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  const updateTicketStatus = (status: SupportTicketStatus) => {
    if (!selectedTicketId) return;
    
    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicketId 
        ? {...ticket, status, updatedAt: new Date().toISOString()} 
        : ticket
    ));
    
    toast({
      title: "Ticket Updated",
      description: `Ticket status changed to ${status}`,
    });
  };
  
  const sendReply = () => {
    if (!selectedTicketId || !replyText.trim()) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: replyText,
      timestamp: new Date().toISOString(),
      isAdmin: true,
    };
    
    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicketId 
        ? {
            ...ticket, 
            messages: [...(ticket.messages || []), newMessage],
            updatedAt: new Date().toISOString(),
            status: ticket.status === "pending" ? "in-progress" as const : ticket.status
          } 
        : ticket
    ));
    
    setReplyText("");
    
    toast({
      title: "Reply Sent",
      description: "Your response has been sent to the user",
    });
  };
  
  const createNewTicket = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Creating new support tickets will be available in a future update.",
    });
  };
  
  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <Button onClick={createNewTicket}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TicketList 
            tickets={filteredTickets}
            onSelectTicket={handleSelectTicket}
            selectedTicketId={selectedTicketId || undefined}
          />
        </div>
        
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription>
                      Ticket #{selectedTicket.id} • {formatDate(selectedTicket.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      defaultValue={selectedTicket.status}
                      onValueChange={(value) => updateTicketStatus(value as SupportTicketStatus)}
                    >
                      <SelectTrigger className="w-[140px]">
                        {getStatusIcon(selectedTicket.status)}
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{selectedTicket.category}</Badge>
                  <Badge variant="outline">{selectedTicket.priority}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-4">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{selectedTicket.user?.name}</span> ({selectedTicket.user?.email})
                  </div>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                  {selectedTicket.messages?.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex gap-3 ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isAdmin && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedTicket.user?.avatar} alt={selectedTicket.user?.name} />
                          <AvatarFallback>{selectedTicket.user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[80%] rounded-lg p-3 
                        ${message.isAdmin 
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs mt-1 opacity-70">{formatDate(message.timestamp)}</div>
                      </div>
                      
                      {message.isAdmin && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/admin-avatar.png" alt="Admin" />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Label htmlFor="reply" className="sr-only">Reply</Label>
                  <div className="flex gap-2">
                    <Textarea 
                      id="reply" 
                      placeholder="Type your reply..." 
                      className="min-h-[80px]"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Button 
                      className="self-end" 
                      onClick={sendReply}
                      disabled={!replyText.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Ticket Selected</h3>
              <p>Select a ticket from the list to view details and respond.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
