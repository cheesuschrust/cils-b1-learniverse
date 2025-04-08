
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MessageSquare, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';
import SupportTicketItem from '@/components/help/SupportTicketItem';
import SupportTicketResponse from '@/components/help/SupportTicketResponse';

// Mock data for support tickets
const mockTickets = [
  {
    id: 'ticket-1',
    subject: 'Problem with subscription renewal',
    message: 'My subscription was supposed to renew automatically but it did not. Can you help me fix this issue?',
    status: 'open' as const,
    priority: 'high' as const,
    category: 'billing' as const,
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    createdAt: new Date('2025-04-05T10:23:45'),
    updatedAt: new Date('2025-04-05T10:23:45'),
  },
  {
    id: 'ticket-2',
    subject: 'Audio not working in lessons',
    message: 'I cannot hear the audio in any of the listening lessons. I have checked my device settings and everything seems to be working fine.',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    category: 'technical' as const,
    userName: 'Sarah Smith',
    userEmail: 'sarah.smith@example.com',
    createdAt: new Date('2025-04-03T14:32:10'),
    updatedAt: new Date('2025-04-04T09:17:22'),
    assignedTo: 'Tech Support Team',
  },
  {
    id: 'ticket-3',
    subject: 'Request for new content',
    message: 'I would love to see more content about Italian regional dialects. Is this something you plan to add in the future?',
    status: 'closed' as const,
    priority: 'low' as const,
    category: 'feature-request' as const,
    userName: 'Michael Johnson',
    userEmail: 'michael.j@example.com',
    createdAt: new Date('2025-04-01T08:45:30'),
    updatedAt: new Date('2025-04-06T11:12:15'),
    responses: [
      {
        id: 'response-1',
        content: 'Thank you for your suggestion! We are currently working on expanding our content to include regional dialects. Stay tuned for updates in the coming months.',
        timestamp: new Date('2025-04-02T10:30:00'),
        authorName: 'Content Team',
        authorType: 'admin',
      },
      {
        id: 'response-2',
        content: 'That sounds great! Looking forward to the new content.',
        timestamp: new Date('2025-04-03T14:22:10'),
        authorName: 'Michael Johnson',
        authorType: 'user',
      }
    ]
  }
];

const SupportTickets: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showResponseForm, setShowResponseForm] = useState(false);
  
  // Filter tickets based on search query and active tab
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = searchQuery.length === 0 || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'open' && ticket.status === 'open') ||
      (activeTab === 'in-progress' && ticket.status === 'in-progress') ||
      (activeTab === 'closed' && (ticket.status === 'closed' || ticket.status === 'resolved'));
    
    return matchesSearch && matchesTab;
  });
  
  const currentTicket = selectedTicket 
    ? mockTickets.find(ticket => ticket.id === selectedTicket)
    : null;
  
  const handleTicketRead = (id: string) => {
    setSelectedTicket(id);
  };
  
  const handleTicketReply = (id: string) => {
    setSelectedTicket(id);
    setShowResponseForm(true);
  };
  
  const handleTicketClose = (id: string) => {
    console.log('Closing ticket:', id);
    // In a real app, this would call an API to update the ticket status
  };
  
  const handleTicketReopen = (id: string) => {
    console.log('Reopening ticket:', id);
    // In a real app, this would call an API to update the ticket status
  };
  
  const handleResponseSubmit = async (message: string) => {
    console.log('Sending response for ticket:', selectedTicket, message);
    // In a real app, this would call an API to add a response to the ticket
    return Promise.resolve();
  };
  
  return (
    <>
      <Helmet>
        <title>
          {language === 'italian' ? 'Gestione Ticket di Supporto' : 'Support Ticket Management'}
        </title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">
          <BilingualText
            english="Support Ticket Management"
            italian="Gestione Ticket di Supporto"
          />
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">
                    <BilingualText
                      english="Tickets"
                      italian="Ticket"
                    />
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    <BilingualText
                      english="Filter"
                      italian="Filtra"
                    />
                  </Button>
                </div>
                <CardDescription>
                  <BilingualText
                    english="Manage user support requests"
                    italian="Gestisci le richieste di supporto degli utenti"
                  />
                </CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'italian' ? "Cerca ticket..." : "Search tickets..."}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-2">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="all">
                      <BilingualText
                        english="All"
                        italian="Tutti"
                      />
                    </TabsTrigger>
                    <TabsTrigger value="open">
                      <BilingualText
                        english="Open"
                        italian="Aperti"
                      />
                    </TabsTrigger>
                    <TabsTrigger value="closed">
                      <BilingualText
                        english="Closed"
                        italian="Chiusi"
                      />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="space-y-2 mt-2">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
                      <div 
                        key={ticket.id}
                        className={`p-3 rounded-md cursor-pointer ${
                          selectedTicket === ticket.id 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleTicketRead(ticket.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium line-clamp-1">{ticket.subject}</h3>
                          <Badge variant={
                            ticket.status === 'open' 
                              ? 'default' 
                              : ticket.status === 'in-progress' 
                                ? 'secondary'
                                : 'outline'
                          }>
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {ticket.message}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{ticket.userName}</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p>
                        <BilingualText
                          english="No tickets found"
                          italian="Nessun ticket trovato"
                        />
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <BilingualText
                    english="Quick Stats"
                    italian="Statistiche Rapide"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <BilingualText
                        english="Open Tickets"
                        italian="Ticket Aperti"
                      />
                    </p>
                    <p className="text-2xl font-bold">
                      {mockTickets.filter(t => t.status === 'open').length}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <BilingualText
                        english="In Progress"
                        italian="In Corso"
                      />
                    </p>
                    <p className="text-2xl font-bold">
                      {mockTickets.filter(t => t.status === 'in-progress').length}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <BilingualText
                        english="Response Time"
                        italian="Tempo di Risposta"
                      />
                    </p>
                    <p className="text-2xl font-bold">4h</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <BilingualText
                        english="Resolved"
                        italian="Risolti"
                      />
                    </p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold mr-1">
                        {mockTickets.filter(t => t.status === 'closed' || t.status === 'resolved').length}
                      </p>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {currentTicket ? (
              <>
                {showResponseForm ? (
                  <SupportTicketResponse
                    ticketId={currentTicket.id}
                    onResponse={handleResponseSubmit}
                    onCancel={() => setShowResponseForm(false)}
                  />
                ) : (
                  <SupportTicketItem
                    id={currentTicket.id}
                    subject={currentTicket.subject}
                    message={currentTicket.message}
                    status={currentTicket.status}
                    priority={currentTicket.priority}
                    category={currentTicket.category}
                    userName={currentTicket.userName}
                    userEmail={currentTicket.userEmail}
                    createdAt={currentTicket.createdAt}
                    updatedAt={currentTicket.updatedAt}
                    assignedTo={currentTicket.assignedTo}
                    responses={currentTicket.responses}
                    onReply={() => setShowResponseForm(true)}
                    onClose={() => handleTicketClose(currentTicket.id)}
                    onReopen={() => handleTicketReopen(currentTicket.id)}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/30 rounded-lg p-10">
                <MessageSquare className="h-20 w-20 text-muted-foreground/20 mb-4" />
                <h2 className="text-xl font-medium mb-2">
                  <BilingualText
                    english="Select a ticket to view"
                    italian="Seleziona un ticket da visualizzare"
                  />
                </h2>
                <p className="text-muted-foreground text-center">
                  <BilingualText
                    english="Click on a ticket from the list to view details and respond"
                    italian="Clicca su un ticket dalla lista per visualizzare i dettagli e rispondere"
                  />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportTickets;
