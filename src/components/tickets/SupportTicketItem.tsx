import React from 'react';
import { format } from 'date-fns';
import { Mail, MessageCircle, Calendar, UserCircle, Check, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export type SupportTicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'medium' | 'high';

export interface SupportTicketProps {
  id: string;
  subject: string;
  message: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: string;
  userId: string;
  userEmail: string;
  userName: string;
  assignedTo?: string;
  responses?: {
    id: string;
    message: string;
    createdAt: string | Date;
    userId: string;
    userName: string;
    isAdmin: boolean;
  }[];
  onReply?: (ticketId: string) => void;
  onClose?: (ticketId: string) => void;
  onReopen?: (ticketId: string) => void;
}

const SupportTicketItem: React.FC<SupportTicketProps> = ({
  id,
  subject,
  message,
  createdAt,
  updatedAt,
  status,
  priority,
  category,
  userId,
  userEmail,
  userName,
  assignedTo,
  responses,
  onReply,
  onClose,
  onReopen,
}) => {
  const getStatusColor = (status: SupportTicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (priority: SupportTicketPriority) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="text-green-500 border-green-500">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-red-500 border-red-500">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityIcon = (priority: SupportTicketPriority) => {
    switch (priority) {
      case 'low':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return format(new Date(date), 'MMM dd, yyyy HH:mm');
    }
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium">{subject}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
              <span className="capitalize">{status.replace('-', ' ')}</span>
              <span>•</span>
              {getPriorityIcon(priority)}
              <span>{priority}</span>
              <span>•</span>
              <Badge variant="secondary">{category}</Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            {onReply && status !== 'closed' && (
              <Button size="sm" variant="outline" onClick={() => onReply(id)}>
                <MessageCircle className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
            {onClose && status !== 'closed' && (
              <Button size="sm" variant="outline" onClick={() => onClose(id)}>
                <Check className="h-4 w-4 mr-1" />
                Close
              </Button>
            )}
            {onReopen && status === 'closed' && (
              <Button size="sm" variant="outline" onClick={() => onReopen(id)}>
                Reopen
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-start space-x-3 mb-3 text-sm">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium">{userName}</div>
            <div className="text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>{userEmail}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-md text-sm mt-2 mb-3">
          {message}
        </div>

        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Created: {formatDate(createdAt)}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Updated: {formatDate(updatedAt)}
          </div>
        </div>

        {responses && responses.length > 0 && (
          <div className="mt-4">
            <Separator className="mb-3" />
            <div className="space-y-3">
              {responses.map((response) => (
                <div key={response.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{response.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{response.userName}</span>
                      {response.isAdmin && <Badge variant="secondary">Admin</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(response.createdAt)}
                    </span>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-sm ml-8">
                    {response.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupportTicketItem;
