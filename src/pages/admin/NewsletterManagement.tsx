
import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Trash2, 
  Mail, 
  Search, 
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  UploadCloud,
  Users,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import DynamicSEO from '@/components/marketing/DynamicSEO';
import NewsletterEditor from '@/components/admin/NewsletterEditor';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  status: 'active' | 'pending' | 'unsubscribed' | 'bounced';
  source?: string;
  last_email_sent?: string;
  tags?: string[];
}

const NewsletterManagement: React.FC = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [importEmails, setImportEmails] = useState('');
  const [activeTab, setActiveTab] = useState('subscribers');
  
  useEffect(() => {
    fetchSubscribers();
  }, []);
  
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to load subscribers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      setSubscribers(subscribers.map(sub => 
        sub.id === id ? { ...sub, status: status as any } : sub
      ));
      
      toast({
        title: "Status updated",
        description: `Subscriber status changed to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update subscriber status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      
      toast({
        title: "Subscriber deleted",
        description: "The subscriber has been removed from the list.",
      });
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the subscriber. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .in('id', selectedSubscribers);
        
      if (error) throw error;
      
      setSubscribers(subscribers.filter(sub => !selectedSubscribers.includes(sub.id)));
      setSelectedSubscribers([]);
      setDeleteDialogOpen(false);
      
      toast({
        title: "Bulk delete successful",
        description: `${selectedSubscribers.length} subscribers have been removed.`,
      });
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast({
        title: "Bulk delete failed",
        description: "Failed to delete the selected subscribers. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBulkImport = async () => {
    if (!importEmails.trim()) return;
    
    const emails = importEmails
      .split('\n')
      .map(e => e.trim())
      .filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
      
    if (emails.length === 0) {
      toast({
        title: "Invalid input",
        description: "No valid email addresses found.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newSubscribers = emails.map(email => ({
        email,
        status: 'pending',
        source: 'bulk-import'
      }));
      
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert(newSubscribers);
        
      if (error) throw error;
      
      setBulkImportOpen(false);
      setImportEmails('');
      fetchSubscribers();
      
      toast({
        title: "Import successful",
        description: `${emails.length} subscribers have been imported.`,
      });
    } catch (error) {
      console.error('Error importing subscribers:', error);
      toast({
        title: "Import failed",
        description: "Failed to import subscribers. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const exportSubscribers = () => {
    const filteredSubs = subscribers.filter(sub => 
      (statusFilter === 'all' || sub.status === statusFilter) &&
      (!searchTerm || sub.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (filteredSubs.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no subscribers matching your filters.",
        variant: "destructive",
      });
      return;
    }
    
    const csvContent = [
      ["Email", "Status", "Subscribed On", "Source"].join(","),
      ...filteredSubs.map(sub => [
        sub.email,
        sub.status,
        new Date(sub.created_at).toLocaleDateString(),
        sub.source || 'website'
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const filteredSubscribers = subscribers.filter(sub => 
    (!searchTerm || sub.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="Newsletter Management - Admin Dashboard"
        description="Manage newsletter subscribers, export data, and track engagement metrics."
        keywords="newsletter, subscribers, email marketing, admin dashboard"
        type="website"
      />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Newsletter Management</h1>
              <p className="text-gray-500">Manage subscribers and send newsletters</p>
            </div>
          </div>
          
          <Tabs defaultValue="subscribers" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="subscribers" className="flex items-center gap-2">
                <Users size={16} />
                Subscribers
              </TabsTrigger>
              <TabsTrigger value="compose" className="flex items-center gap-2">
                <FileText size={16} />
                Compose
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscribers" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Total Subscribers</CardTitle>
                    <CardDescription>All registered emails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{subscribers.length}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Active Subscribers</CardTitle>
                    <CardDescription>Confirmed and active emails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">
                      {subscribers.filter(s => s.status === 'active').length}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Unsubscribed</CardTitle>
                    <CardDescription>Opted-out emails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">
                      {subscribers.filter(s => s.status === 'unsubscribed').length}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <Button onClick={exportSubscribers} variant="outline" className="flex gap-2 items-center">
                  <Download size={16} />
                  Export CSV
                </Button>
                <Button onClick={() => setBulkImportOpen(true)} variant="outline" className="flex gap-2 items-center">
                  <UploadCloud size={16} />
                  Import
                </Button>
                <Button 
                  onClick={() => setDeleteDialogOpen(true)} 
                  variant="destructive" 
                  className="flex gap-2 items-center"
                  disabled={selectedSubscribers.length === 0}
                >
                  <Trash2 size={16} />
                  Delete Selected
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={fetchSubscribers} 
                  variant="outline" 
                  className="whitespace-nowrap"
                >
                  Refresh List
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input 
                            type="checkbox" 
                            className="rounded"
                            checked={selectedSubscribers.length > 0 && selectedSubscribers.length === filteredSubscribers.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubscribers(filteredSubscribers.map(s => s.id));
                              } else {
                                setSelectedSubscribers([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subscribed On</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading subscribers...
                          </TableCell>
                        </TableRow>
                      ) : filteredSubscribers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No subscribers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSubscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell>
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedSubscribers.includes(subscriber.id)} 
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSubscribers([...selectedSubscribers, subscriber.id]);
                                  } else {
                                    setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {subscriber.status === 'active' && (
                                  <CheckCircle size={16} className="text-green-500" />
                                )}
                                {subscriber.status === 'pending' && (
                                  <AlertCircle size={16} className="text-yellow-500" />
                                )}
                                {subscriber.status === 'unsubscribed' && (
                                  <XCircle size={16} className="text-gray-500" />
                                )}
                                {subscriber.status === 'bounced' && (
                                  <XCircle size={16} className="text-red-500" />
                                )}
                                {subscriber.status}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(subscriber.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{subscriber.source || 'website'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Select 
                                  defaultValue={subscriber.status} 
                                  onValueChange={(value) => handleStatusChange(subscriber.id, value)}
                                >
                                  <SelectTrigger className="w-24 h-8">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                                    <SelectItem value="bounced">Bounced</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteSubscriber(subscriber.id)}
                                  className="h-8 w-8 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compose" className="mt-6">
              <NewsletterEditor onSent={() => setActiveTab('subscribers')} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Subscribers</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedSubscribers.length} selected subscribers? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete {selectedSubscribers.length} Subscribers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Import Dialog */}
      <Dialog open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Subscribers</DialogTitle>
            <DialogDescription>
              Enter email addresses, one per line. These will be imported as pending subscribers.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <textarea
              className="w-full h-40 p-2 border rounded-md"
              placeholder="email1@example.com
email2@example.com
email3@example.com"
              value={importEmails}
              onChange={(e) => setImportEmails(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport}>
              Import Subscribers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
};

export default NewsletterManagement;
