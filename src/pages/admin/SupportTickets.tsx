
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TicketList from '@/components/tickets/TicketList';
import { SupportTicketProps } from '@/components/tickets/SupportTicketItem';
import { useSystemLog } from '@/hooks/use-system-log';
import HelpTooltip from '@/components/help/HelpTooltip';

// Mock data - in a real app, this would come from your backend
const mockTickets: SupportTicketProps[] = [
  {
    id: '1',
    subject: 'Problem with flashcards not saving',
    message: 'I created several flashcards but when I closed the browser and came back, they were all gone. Is there a way to recover them?',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 days ago
    status: 'open',
    priority: 'high',
    category: 'technical',
    userId: 'user1',
    userEmail: 'user1@example.com',
    userName: 'John Doe',
    responses: []
  },
  {
    id: '2',
    subject: 'Question about subscription plan',
    message: 'I\'m interested in upgrading to the premium plan. Does it include unlimited speaking practice sessions?',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: 'in-progress',
    priority: 'medium',
    category: 'billing',
    userId: 'user2',
    userEmail: 'user2@example.com',
    userName: 'Jane Smith',
    responses: [
      {
        id: 'resp1',
        message: 'Hi Jane, yes, the premium plan includes unlimited speaking practice sessions. Would you like me to provide more details about the other premium features?',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        userId: 'admin1',
        userName: 'Admin User',
        isAdmin: true
      }
    ]
  },
  {
    id: '3',
    subject: 'Feature request: Dictionary integration',
    message: 'It would be great if you could add a dictionary feature that allows users to look up words directly from the lessons without leaving the platform.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    status: 'resolved',
    priority: 'low',
    category: 'feedback',
    userId: 'user3',
    userEmail: 'user3@example.com',
    userName: 'Maria Rodriguez',
    responses: [
      {
        id: 'resp2',
        message: 'Thank you for your suggestion! We're actually working on a dictionary integration feature that should be available in the next update. We'll keep you posted on the release date.',
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        userId: 'admin1',
        userName: 'Admin User',
        isAdmin: true
      },
      {
        id: 'resp3',
        message: 'That sounds great! Looking forward to it.',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        userId: 'user3',
        userName: 'Maria Rodriguez',
        isAdmin: false
      }
    ]
  }
];

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicketProps[]>(mockTickets);
  const { logSystemAction } = useSystemLog();
  
  useEffect(() => {
    logSystemAction('Viewed support tickets');
  }, [logSystemAction]);
  
  const handleUpdateTicket = (ticketId: string, updates: Partial<SupportTicketProps>) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    );
  };
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>Support Tickets | Admin Dashboard</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <HelpTooltip 
            content="Manage user support tickets. You can reply to tickets, change their status, and filter them based on various criteria."
            className="mt-2"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>
            View and manage user support tickets
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <TicketList 
            tickets={tickets} 
            onUpdateTicket={handleUpdateTicket} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTickets;
