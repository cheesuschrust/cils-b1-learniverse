
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

export type SupportTicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed' | 'pending';
export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicketMessageProps {
  id: string;
  content: string;
  timestamp: Date;
  authorName: string;
  authorType: 'user' | 'admin' | 'system';
  attachments?: string[];
}

export interface SupportTicketProps {
  id: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: string;
  userName: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  responses?: SupportTicketMessageProps[];
  onReply: () => void;
  onClose: () => void;
  onReopen: () => void;
}

const SupportTicketItem: React.FC<SupportTicketProps> = ({
  id,
  subject,
  message,
  status,
  priority,
  category,
  userName,
  userEmail,
  createdAt,
  updatedAt,
  assignedTo,
  responses,
  onReply,
  onClose,
  onReopen
}) => {
  const { language } = useLanguage();
  
  const getStatusIcon = () => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusLabel = () => {
    switch (status) {
      case 'open':
        return {
          english: 'Open',
          italian: 'Aperto'
        };
      case 'in-progress':
        return {
          english: 'In Progress',
          italian: 'In Corso'
        };
      case 'resolved':
        return {
          english: 'Resolved',
          italian: 'Risolto'
        };
      case 'closed':
        return {
          english: 'Closed',
          italian: 'Chiuso'
        };
      case 'pending':
        return {
          english: 'Pending',
          italian: 'In Attesa'
        };
      default:
        return {
          english: 'Unknown',
          italian: 'Sconosciuto'
        };
    }
  };
  
  const getPriorityColor = () => {
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
  
  const getFormattedDate = (date: Date) => {
    return format(date, 'PPP');
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{subject}</CardTitle>
            <div className="flex space-x-2 mt-1">
              <Badge variant="outline" className="flex items-center gap-1">
                {getStatusIcon()}
                <BilingualText 
                  english={getStatusLabel().english}
                  italian={getStatusLabel().italian}
                />
              </Badge>
              <Badge variant="outline" className={getPriorityColor()}>
                {priority}
              </Badge>
              <Badge variant="outline">{category}</Badge>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <BilingualText 
              english={`Created: ${getFormattedDate(createdAt)}`}
              italian={`Creato: ${getFormattedDate(createdAt)}`}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-start space-x-4 mb-4">
          <Avatar>
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
            <div className="mt-2">{message}</div>
          </div>
        </div>
        
        {responses && responses.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-lg">
              <BilingualText 
                english="Responses"
                italian="Risposte"
              />
            </h3>
            {responses.map(response => (
              <div key={response.id} className="flex items-start space-x-4 p-3 rounded-md bg-muted/50">
                <Avatar>
                  <AvatarFallback>
                    {response.authorType === 'admin' ? 'A' : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">{response.authorName}</p>
                    <p className="text-xs text-muted-foreground ml-2">
                      {format(response.timestamp, 'PPp')}
                    </p>
                  </div>
                  <div className="mt-1">{response.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div>
          {status === 'resolved' || status === 'closed' ? (
            <Button 
              variant="outline" 
              onClick={onReopen}
            >
              <BilingualText 
                english="Reopen Ticket"
                italian="Riapri Ticket"
              />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              <BilingualText 
                english="Close Ticket"
                italian="Chiudi Ticket"
              />
            </Button>
          )}
        </div>
        
        {status !== 'closed' && (
          <Button onClick={onReply}>
            <MessageSquare className="h-4 w-4 mr-2" />
            <BilingualText 
              english="Reply"
              italian="Rispondi"
            />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SupportTicketItem;
