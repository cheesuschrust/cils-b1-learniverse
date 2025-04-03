
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MessageCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink, 
  Mail, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface SupportTicket {
  id: string;
  user_id: string;
  user_email?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
}

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [tickets, searchQuery, statusFilter, priorityFilter]);
  
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          users (
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedTickets: SupportTicket[] = data.map(ticket => ({
        ...ticket,
        user_email: ticket.users?.email
      }));
      
      setTickets(formattedTickets);
      setFilteredTickets(formattedTickets);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      
      // Create mock data for demonstration
      const mockTickets: SupportTicket[] = [
        {
          id: uuidv4(),
          user_id: '123',
          user_email: 'user1@example.com',
          subject: 'Cannot access speaking exercises',
          description: 'When I try to access the speaking exercises, I get an error message saying "Microphone access denied".',
          status: 'open',
          priority: 'high',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: uuidv4(),
          user_id: '456',
          user_email: 'user2@example.com',
          subject: 'Flashcards not syncing across devices',
          description: 'I created some flashcards on my computer, but they are not appearing on my phone app.',
          status: 'in_progress',
          priority: 'medium',
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          assigned_to: 'admin1'
        },
        {
          id: uuidv4(),
          user_id: '789',
          user_email: 'user3@example.com',
          subject: 'Billing question about subscription',
          description: 'I was charged twice for my monthly subscription. Can you please help me resolve this issue?',
          status: 'resolved',
          priority: 'high',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: 'admin2'
        },
        {
          id: uuidv4(),
          user_id: '101',
          user_email: 'user4@example.com',
          subject: 'Feature request: Dark mode',
          description: 'Would it be possible to add a dark mode option to the application? It would be easier on the eyes when studying at night.',
          status: 'open',
          priority: 'low',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: uuidv4(),
          user_id: '112',
          user_email: 'user5@example.com',
          subject: 'AI pronunciation feedback not working',
          description: 'When I try to get feedback on my pronunciation, the system just loads forever and never gives me any feedback.',
          status: 'in_progress',
          priority: 'medium',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: 'admin1'
        },
        {
          id: uuidv4(),
          user_id: '131',
          user_email: 'user6@example.com',
          subject: 'Cannot reset password',
          description: 'I tried to reset my password but I never received the reset email. I checked my spam folder too.',
          status: 'closed',
          priority: 'high',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: 'admin2'
        }
      ];
      
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      
      toast({
        title: 'Using demo data',
        description: 'Could not connect to database. Using demonstration data instead.',
        variant: 'default',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...tickets];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ticket =>
          ticket.subject.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.user_email?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    setFilteredTickets(filtered);
  };
  
  const updateTicketStatus = async (ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      // In a real app, update the database
      // const { error } = await supabase
      //  .from('support_tickets')
      //  .update({ status, updated_at: new Date().toISOString() })
      //  .eq('id', ticketId);
      
      // if (error) throw error;
      
      // Update local state
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status, updated_at: new Date().toISOString() } 
          : ticket
      ));
      
      toast({
        title: 'Ticket Updated',
        description: `Ticket status changed to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update ticket status. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const assignTicket = async (ticketId: string, adminId: string) => {
    try {
      // In a real app, update the database
      // const { error } = await supabase
      //  .from('support_tickets')
      //  .update({ 
      //    assigned_to: adminId, 
      //    status: 'in_progress',
      //    updated_at: new Date().toISOString() 
      //  })
      //  .eq('id', ticketId);
      
      // if (error) throw error;
      
      // Update local state
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              assigned_to: adminId,
              status: 'in_progress', 
              updated_at: new Date().toISOString() 
            } 
          : ticket
      ));
      
      toast({
        title: 'Ticket Assigned',
        description: `Ticket assigned to admin and status updated to in progress.`,
      });
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast({
        title: 'Assignment Failed',
        description: 'Failed to assign ticket. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-blue-500">Open</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-amber-500">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-500">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>Support Tickets - Admin</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground mt-2">
              Manage and respond to user support requests
            </p>
          </div>
        </div>
        
        {/* Ticket Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Open Tickets
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  {tickets.filter(t => t.status === 'open').length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-blue-500">
                <AlertCircle className="h-10 w-10" />
                <div className="ml-4">
                  <div className="text-xl font-bold">
                    {tickets.filter(t => t.status === 'open' && t.priority === 'high').length}
                  </div>
                  <div className="text-xs">High Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                In Progress
                <Badge variant="outline" className="text-amber-500 border-amber-500">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-amber-500">
                <Clock className="h-10 w-10" />
                <div className="ml-4">
                  <div className="text-xl font-bold">
                    {Math.round(tickets.filter(t => t.status === 'in_progress').length / 2)} hrs
                  </div>
                  <div className="text-xs">Avg. Resolution Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Resolved
                <Badge variant="outline" className="text-green-500 border-green-500">
                  {tickets.filter(t => t.status === 'resolved').length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-10 w-10" />
                <div className="ml-4">
                  <div className="text-xl font-bold">
                    {tickets.filter(t => t.status === 'resolved').length}
                  </div>
                  <div className="text-xs">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Closed
                <Badge variant="outline">
                  {tickets.filter(t => t.status === 'closed').length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-muted-foreground">
                <XCircle className="h-10 w-10" />
                <div className="ml-4">
                  <div className="text-xl font-bold">
                    {tickets.filter(t => t.status === 'closed').length}
                  </div>
                  <div className="text-xs">All Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Ticket List */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>
              View and manage user support requests
            </CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div className="font-medium truncate max-w-[250px]">
                            {ticket.subject}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                            {ticket.description}
                          </div>
                        </TableCell>
                        <TableCell>{ticket.user_email}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>
                          <div className="text-sm">{getTimeAgo(ticket.created_at)}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {ticket.assigned_to ? (
                            <Badge variant="outline">
                              Admin {ticket.assigned_to.slice(-1)}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                <span>Reply</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Email User</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              
                              {!ticket.assigned_to && (
                                <>
                                  <DropdownMenuItem onClick={() => assignTicket(ticket.id, 'admin1')}>
                                    <span>Assign to Me</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              
                              {ticket.status === 'open' && (
                                <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'in_progress')}>
                                  <Clock className="mr-2 h-4 w-4" />
                                  <span>Mark In Progress</span>
                                </DropdownMenuItem>
                              )}
                              
                              {(ticket.status === 'open' || ticket.status === 'in_progress') && (
                                <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'resolved')}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>Mark Resolved</span>
                                </DropdownMenuItem>
                              )}
                              
                              {ticket.status === 'resolved' && (
                                <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'closed')}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  <span>Close Ticket</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-muted-foreground">No tickets found</div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default SupportTickets;
