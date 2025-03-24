
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import TicketList from '@/components/tickets/TicketList';
import { Input } from '@/components/ui/input';

const SupportTickets = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  
  // Modified ticket data to match SupportTicketProps expected by TicketList
  const tickets = [
    {
      id: "ticket-1",
      subject: "Audio pronunciation not working",
      message: "I'm having issues with the audio pronunciation feature. When I click on the speaker icon, nothing happens.",
      status: "open",
      priority: "high",
      category: "technical",
      createdAt: "2023-09-15T14:30:00Z",
      updatedAt: "2023-09-15T16:45:00Z",
      userId: "user-1",
      userEmail: "john.doe@example.com",
      userName: "John Doe",
      user: {
        id: "user-1",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://github.com/shadcn.png"
      },
      messages: [
        {
          id: "msg-1",
          content: "I'm having issues with the audio pronunciation feature. When I click on the speaker icon, nothing happens.",
          timestamp: "2023-09-15T14:30:00Z",
          isAdmin: false
        },
        {
          id: "msg-2",
          content: "Thank you for reporting this issue. Could you please provide more information about your browser and device?",
          timestamp: "2023-09-15T15:20:00Z",
          isAdmin: true
        },
        {
          id: "msg-3",
          content: "I'm using Chrome 116 on Windows 11. This issue started happening after the latest update.",
          timestamp: "2023-09-15T16:45:00Z",
          isAdmin: false
        }
      ]
    },
    {
      id: "ticket-2",
      subject: "Premium subscription payment failed",
      message: "I tried to upgrade to premium but my payment was declined, even though my card is valid.",
      status: "pending",
      priority: "medium",
      category: "billing",
      createdAt: "2023-09-14T10:15:00Z",
      updatedAt: "2023-09-14T11:30:00Z",
      userId: "user-2",
      userEmail: "jane.smith@example.com",
      userName: "Jane Smith",
      user: {
        id: "user-2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: ""
      },
      messages: [
        {
          id: "msg-1",
          content: "I tried to upgrade to premium but my payment was declined, even though my card is valid.",
          timestamp: "2023-09-14T10:15:00Z",
          isAdmin: false
        },
        {
          id: "msg-2",
          content: "I apologize for the inconvenience. Let me check your account and the payment gateway status.",
          timestamp: "2023-09-14T11:30:00Z",
          isAdmin: true
        }
      ]
    },
    {
      id: "ticket-3",
      subject: "Feature request: More grammar exercises",
      message: "I'd love to see more advanced grammar exercises, particularly focusing on subjunctive mood.",
      status: "closed",
      priority: "low",
      category: "feature",
      createdAt: "2023-09-10T09:45:00Z",
      updatedAt: "2023-09-11T14:20:00Z",
      userId: "user-3",
      userEmail: "robert.j@example.com",
      userName: "Robert Johnson",
      user: {
        id: "user-3",
        name: "Robert Johnson",
        email: "robert.j@example.com",
        avatar: ""
      },
      messages: [
        {
          id: "msg-1",
          content: "I'd love to see more advanced grammar exercises, particularly focusing on subjunctive mood.",
          timestamp: "2023-09-10T09:45:00Z",
          isAdmin: false
        },
        {
          id: "msg-2",
          content: "Thank you for your suggestion! We're actually working on expanding our grammar section and will include more exercises on the subjunctive mood in our next update.",
          timestamp: "2023-09-11T14:20:00Z",
          isAdmin: true
        }
      ]
    }
  ];
  
  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return ticket.status === 'open';
    if (activeTab === 'pending') return ticket.status === 'pending';
    if (activeTab === 'closed') return ticket.status === 'closed';
    return true;
  });
  
  const ticket = tickets.find(t => t.id === selectedTicket) || null;
  
  const handleReply = () => {
    // Handle reply submission
    setIsReplying(false);
  };

  const handleUpdateTicket = (ticketId: string, updates: any) => {
    // This would update the ticket in a real application
    console.log('Updating ticket:', ticketId, updates);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage and respond to user support requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>New Ticket</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Ticket Management</CardTitle>
              <CardDescription>
                {filteredTickets.length} tickets found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select defaultValue="newest">
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest first</SelectItem>
                          <SelectItem value="oldest">Oldest first</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <TicketList 
                      tickets={filteredTickets}
                      selectedTicketId={selectedTicket}
                      onSelectTicket={setSelectedTicket}
                      onUpdateTicket={handleUpdateTicket}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue placeholder="Per page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="20">20 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" disabled>
                        1
                      </Button>
                      <Button variant="ghost" size="icon">
                        2
                      </Button>
                      <Button variant="ghost" size="icon">
                        3
                      </Button>
                    </div>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {ticket ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{ticket.subject}</CardTitle>
                    <CardDescription>
                      Ticket #{ticket.id} • Opened on {new Date(ticket.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={ticket.status === 'open' ? 'default' : ticket.status === 'pending' ? 'outline' : 'secondary'}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="capitalize">{ticket.category}</Badge>
                    <Badge variant={
                      ticket.priority === 'high' ? 'destructive' : 
                      ticket.priority === 'medium' ? 'default' : 'secondary'
                    } className="capitalize">{ticket.priority}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={ticket.user.avatar} alt={ticket.user.name} />
                    <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ticket.user.name}</p>
                    <p className="text-sm text-muted-foreground">{ticket.user.email}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  {ticket.messages.map((message) => (
                    <div key={message.id} className={`flex gap-4 ${message.isAdmin ? 'justify-end' : ''}`}>
                      {!message.isAdmin && (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={ticket.user.avatar} alt={ticket.user.name} />
                          <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`border rounded-lg px-4 py-3 max-w-[70%] ${message.isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium">{message.isAdmin ? 'Support Agent' : ticket.user.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(message.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.isAdmin && (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
                
                {isReplying ? (
                  <div className="mt-6 space-y-4">
                    <Textarea placeholder="Type your reply here..." className="min-h-[120px]" />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsReplying(false)}>Cancel</Button>
                      <Button onClick={handleReply}>Send Reply</Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    {ticket.status !== 'closed' && (
                      <Button onClick={() => setIsReplying(true)} className="w-full">Reply to Ticket</Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-muted-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Ticket Selected</h3>
                <p className="text-muted-foreground mb-6">
                  Select a ticket from the list to view details and respond
                </p>
                <Button variant="outline">Create New Ticket</Button>
              </CardContent>
            </Card>
          )}
          
          {ticket && (
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle>Ticket Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">
                      Status
                    </Label>
                    <Select defaultValue={ticket.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">
                      Priority
                    </Label>
                    <Select defaultValue={ticket.priority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="assignee">
                      Assign To
                    </Label>
                    <Select defaultValue="current">
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current User</SelectItem>
                        <SelectItem value="agent1">Support Agent 1</SelectItem>
                        <SelectItem value="agent2">Support Agent 2</SelectItem>
                        <SelectItem value="agent3">Support Agent 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Add Note</Button>
                  <Button variant="outline" size="sm">Add Tags</Button>
                  <Button variant="outline" size="sm">Merge Tickets</Button>
                  <Button variant="destructive" size="sm">Close Ticket</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
