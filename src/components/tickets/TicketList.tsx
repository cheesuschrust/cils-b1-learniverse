import React, { useState } from 'react';
import { Search, Filter, Inbox, Clock, CheckCircle, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SupportTicketItem, { SupportTicketProps } from './SupportTicketItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSystemLog } from '@/hooks/use-system-log';

interface TicketListProps {
  tickets: SupportTicketProps[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  onUpdateTicket?: (ticketId: string, updates: Partial<SupportTicketProps>) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, selectedTicketId, onSelectTicket, onUpdateTicket }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { logUserAction } = useSystemLog();

  const handleUpdateTicket = (ticketId: string, updates: Partial<SupportTicketProps>) => {
    if (onUpdateTicket) {
      onUpdateTicket(ticketId, updates);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(ticket.status);
    
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(ticket.priority);
    
    const matchesTab = 
      currentTab === 'all' || 
      (currentTab === 'open' && ticket.status === 'open') ||
      (currentTab === 'in-progress' && ticket.status === 'in-progress') ||
      (currentTab === 'resolved' && ticket.status === 'resolved') ||
      (currentTab === 'closed' && ticket.status === 'closed');
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const inProgressTicketsCount = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTicketsCount = tickets.filter(t => t.status === 'resolved').length;
  const closedTicketsCount = tickets.filter(t => t.status === 'closed').length;

  const handleReply = (ticketId: string) => {
    onSelectTicket(ticketId);
    setReplyDialogOpen(true);
  };

  const handleClose = (ticketId: string) => {
    handleUpdateTicket(ticketId, { status: 'closed', updatedAt: new Date() });
    logUserAction(`Closed ticket ${ticketId}`);
    toast({
      title: "Ticket closed",
      description: "The ticket has been closed successfully",
    });
  };

  const handleReopen = (ticketId: string) => {
    handleUpdateTicket(ticketId, { status: 'open', updatedAt: new Date() });
    logUserAction(`Reopened ticket ${ticketId}`);
    toast({
      title: "Ticket reopened",
      description: "The ticket has been reopened successfully",
    });
  };

  const submitReply = () => {
    if (!selectedTicketId || !replyMessage.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const ticket = tickets.find(t => t.id === selectedTicketId);
      if (!ticket) return;
      
      const newResponse = {
        id: Date.now().toString(),
        message: replyMessage,
        createdAt: new Date(),
        userId: 'admin-user',
        userName: 'Admin User',
        isAdmin: true,
      };
      
      const updatedResponses = [...(ticket.responses || []), newResponse];
      handleUpdateTicket(selectedTicketId, { 
        responses: updatedResponses,
        status: 'in-progress',
        updatedAt: new Date()
      });
      
      logUserAction(`Replied to ticket ${selectedTicketId}`);
      
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully",
      });
      
      setReplyDialogOpen(false);
      setReplyMessage('');
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast({
        title: "Failed to send reply",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setPriorityFilter([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('open')}
                onCheckedChange={(checked) => {
                  setStatusFilter(checked 
                    ? [...statusFilter, 'open'] 
                    : statusFilter.filter(s => s !== 'open')
                  );
                }}
              >
                Open
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('in-progress')}
                onCheckedChange={(checked) => {
                  setStatusFilter(checked 
                    ? [...statusFilter, 'in-progress'] 
                    : statusFilter.filter(s => s !== 'in-progress')
                  );
                }}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('resolved')}
                onCheckedChange={(checked) => {
                  setStatusFilter(checked 
                    ? [...statusFilter, 'resolved'] 
                    : statusFilter.filter(s => s !== 'resolved')
                  );
                }}
              >
                Resolved
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('closed')}
                onCheckedChange={(checked) => {
                  setStatusFilter(checked 
                    ? [...statusFilter, 'closed'] 
                    : statusFilter.filter(s => s !== 'closed')
                  );
                }}
              >
                Closed
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('low')}
                onCheckedChange={(checked) => {
                  setPriorityFilter(checked 
                    ? [...priorityFilter, 'low'] 
                    : priorityFilter.filter(p => p !== 'low')
                  );
                }}
              >
                Low
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('medium')}
                onCheckedChange={(checked) => {
                  setPriorityFilter(checked 
                    ? [...priorityFilter, 'medium'] 
                    : priorityFilter.filter(p => p !== 'medium')
                  );
                }}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('high')}
                onCheckedChange={(checked) => {
                  setPriorityFilter(checked 
                    ? [...priorityFilter, 'high'] 
                    : priorityFilter.filter(p => p !== 'high')
                  );
                }}
              >
                High
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start font-normal" 
                onClick={handleReset}
              >
                Reset Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="flex items-center justify-center gap-1">
            <Inbox className="h-4 w-4" />
            All
            <Badge variant="secondary" className="ml-1">{tickets.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="open" className="flex items-center justify-center gap-1">
            <Clock className="h-4 w-4" />
            Open
            <Badge variant="secondary" className="ml-1">{openTicketsCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center justify-center gap-1">
            <Clock className="h-4 w-4" />
            In Progress
            <Badge variant="secondary" className="ml-1">{inProgressTicketsCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center justify-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Resolved
            <Badge variant="secondary" className="ml-1">{resolvedTicketsCount}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="m-0">
          {filteredTickets.length > 0 ? (
            <ScrollArea className="h-[600px]">
              {filteredTickets.map((ticket) => (
                <SupportTicketItem
                  key={ticket.id}
                  {...ticket}
                  onReply={handleReply}
                  onClose={handleClose}
                  onReopen={handleReopen}
                />
              ))}
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No tickets found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="open" className="m-0">
          {filteredTickets.length > 0 ? (
            <ScrollArea className="h-[600px]">
              {filteredTickets.map((ticket) => (
                <SupportTicketItem
                  key={ticket.id}
                  {...ticket}
                  onReply={handleReply}
                  onClose={handleClose}
                />
              ))}
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No open tickets found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="m-0">
          {filteredTickets.length > 0 ? (
            <ScrollArea className="h-[600px]">
              {filteredTickets.map((ticket) => (
                <SupportTicketItem
                  key={ticket.id}
                  {...ticket}
                  onReply={handleReply}
                  onClose={handleClose}
                />
              ))}
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No in-progress tickets found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="m-0">
          {filteredTickets.length > 0 ? (
            <ScrollArea className="h-[600px]">
              {filteredTickets.map((ticket) => (
                <SupportTicketItem
                  key={ticket.id}
                  {...ticket}
                  onClose={handleClose}
                />
              ))}
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No resolved tickets found.
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
          </DialogHeader>
          
          <Textarea
            placeholder="Type your reply here..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            rows={6}
          />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setReplyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={submitReply} 
              disabled={isSubmitting || !replyMessage.trim()}
            >
              {isSubmitting ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketList;
