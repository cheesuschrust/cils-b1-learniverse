
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Table, 
  TableBody, 
  TableCaption, 
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash, 
  MoreHorizontal,
  Eye,
  FileCheck,
  FileX,
  Link as LinkIcon,
  ArrowUpRight,
  Tags
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  status: string;
  tags: string[];
  created_at: string;
  created_by: string;
  updated_at: string;
  category_id: string | null;
  metadata: any;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
}

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    category: 'all',
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, [currentPage]);
  
  useEffect(() => {
    filterContent();
  }, [content, searchQuery, filter, currentTab]);
  
  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*, created_by:users(email)')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
        
      if (error) throw error;
      
      if (data) {
        setContent(data as ContentItem[]);
        
        // Get total count for pagination
        const { count, error: countError } = await supabase
          .from('content_items')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        const totalPages = Math.ceil((count || 0) / itemsPerPage);
        setTotalPages(totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch content items. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch categories. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const filterContent = () => {
    let filtered = [...content];
    
    // Apply tab filter first
    if (currentTab !== 'all') {
      filtered = filtered.filter(item => item.status === currentTab);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply dropdown filters
    if (filter.type !== 'all') {
      filtered = filtered.filter(item => item.content_type === filter.type);
    }
    
    if (filter.status !== 'all') {
      filtered = filtered.filter(item => item.status === filter.status);
    }
    
    if (filter.category !== 'all') {
      filtered = filtered.filter(item => item.category_id === filter.category);
    }
    
    setFilteredContent(filtered);
  };
  
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.id));
    }
  };
  
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `Content status changed to "${status}".`,
      });
      
      // Refresh content
      const updatedContent = content.map(item => 
        item.id === id ? { ...item, status } : item
      );
      setContent(updatedContent);
      filterContent();
      
    } catch (error) {
      console.error('Error updating content status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content status. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleBulkStatusChange = async (status: string) => {
    if (selectedItems.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('content_items')
        .update({ status })
        .in('id', selectedItems);
        
      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `${selectedItems.length} items updated to "${status}".`,
      });
      
      // Refresh content
      fetchContent();
      
      // Clear selection
      setSelectedItems([]);
      
    } catch (error) {
      console.error('Error updating content status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content status. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Content Deleted',
        description: 'The content item has been permanently deleted.',
      });
      
      // Refresh content
      const updatedContent = content.filter(item => item.id !== id);
      setContent(updatedContent);
      filterContent();
      
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Published</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'review':
        return <Badge variant="secondary">In Review</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'flashcards':
        return <Badge className="bg-blue-500">Flashcards</Badge>;
      case 'multiple_choice':
        return <Badge className="bg-green-500">Quiz</Badge>;
      case 'reading':
        return <Badge className="bg-purple-500">Reading</Badge>;
      case 'writing':
        return <Badge className="bg-amber-500">Writing</Badge>;
      case 'speaking':
        return <Badge className="bg-rose-500">Speaking</Badge>;
      case 'listening':
        return <Badge className="bg-cyan-500">Listening</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>Content Management - Admin</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your learning content
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button asChild>
              <a href="/admin/content-upload">
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </a>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Content Library</CardTitle>
            <CardDescription>
              Browse, filter, and manage all content items.
            </CardDescription>
            
            <Tabs 
              value={currentTab} 
              onValueChange={setCurrentTab}
              className="mt-6"
            >
              <TabsList>
                <TabsTrigger value="all">
                  All Content
                </TabsTrigger>
                <TabsTrigger value="published">
                  Published
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Drafts
                </TabsTrigger>
                <TabsTrigger value="review">
                  In Review
                </TabsTrigger>
                <TabsTrigger value="archived">
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filter.type}
                  onValueChange={(value) => setFilter({ ...filter, type: value })}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="flashcards">Flashcards</SelectItem>
                    <SelectItem value="multiple_choice">Quiz</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filter.category}
                  onValueChange={(value) => setFilter({ ...filter, category: value })}
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
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
                          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredContent.length > 0 ? (
                    filteredContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium truncate max-w-[250px]">{item.title}</div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {item.tags.slice(0, 3).map((tag, i) => (
                                <span 
                                  key={i} 
                                  className="px-1.5 py-0.5 bg-muted text-xs rounded-sm">
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="px-1.5 py-0.5 bg-muted text-xs rounded-sm">
                                  +{item.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{getContentTypeBadge(item.content_type)}</TableCell>
                        <TableCell>{getCategoryName(item.category_id)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Content</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Content</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Tags className="mr-2 h-4 w-4" />
                                <span>Edit Tags</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {item.status !== 'published' && (
                                <DropdownMenuItem onSelect={() => handleStatusChange(item.id, 'published')}>
                                  <FileCheck className="mr-2 h-4 w-4" />
                                  <span>Publish</span>
                                </DropdownMenuItem>
                              )}
                              {item.status !== 'draft' && (
                                <DropdownMenuItem onSelect={() => handleStatusChange(item.id, 'draft')}>
                                  <FileX className="mr-2 h-4 w-4" />
                                  <span>Mark as Draft</span>
                                </DropdownMenuItem>
                              )}
                              {item.status !== 'archived' && (
                                <DropdownMenuItem onSelect={() => handleStatusChange(item.id, 'archived')}>
                                  <FileX className="mr-2 h-4 w-4" />
                                  <span>Archive</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteContent(item.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No content found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages)
                      .map((page, i, array) => {
                        if (i > 0 && array[i - 1] !== page - 1) {
                          return (
                            <React.Fragment key={`ellipsis-${page}`}>
                              <PaginationItem>
                                <PaginationLink disabled>...</PaginationLink>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        }
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
            
            {selectedItems.length > 0 && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-background border shadow-lg rounded-lg p-4 flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange('published')}>
                    <FileCheck className="mr-1 h-4 w-4" /> Publish
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange('draft')}>
                    Mark as Draft
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange('archived')}>
                    Archive
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ContentManager;
