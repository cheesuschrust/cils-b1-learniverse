
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock, AlertCircle, MessageCircle, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface SupportTicketMessageProps {
  id: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface SupportTicketUserProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface SupportTicketProps {
  id: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
  userEmail: string;
  userName: string;
  user?: SupportTicketUserProps;
  messages?: SupportTicketMessageProps[];
}

export type SupportTicketStatus = 'pending' | 'in-progress' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface TicketListProps {
  tickets: SupportTicketProps[];
  onSelectTicket: (ticketId: string) => void;
  selectedTicketId?: string;
}

const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  onSelectTicket,
  selectedTicketId
}) => {
  const getStatusIcon = (status: SupportTicketStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  const getStatusColor = (status: SupportTicketStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return '';
    }
  };
  
  const getPriorityColor = (priority: SupportTicketPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  };
  
  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };
  
  return (
    <div className="space-y-3 pr-2 max-h-[calc(100vh-200px)] overflow-y-auto">
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No tickets found
          </CardContent>
        </Card>
      ) : (
        tickets.map((ticket) => (
          <Card 
            key={ticket.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedTicketId === ticket.id ? 'border-primary/50 bg-muted/30' : ''
            }`}
            onClick={() => onSelectTicket(ticket.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10 mt-1">
                    <AvatarImage src={ticket.user?.avatar} alt={ticket.userName} />
                    <AvatarFallback>{ticket.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{ticket.subject}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {ticket.message}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1">{ticket.status}</span>
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(ticket.createdAt)}
                  </div>
                  {ticket.messages && ticket.messages.length > 0 && (
                    <Badge variant="secondary" className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {ticket.messages.length}
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TicketList;
