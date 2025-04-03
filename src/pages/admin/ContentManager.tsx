
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash, 
  Eye, 
  MoreHorizontal,
  Check,
  X,
  FileUp,
  Tag,
  Loader2
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  category_id: string | null;
  tags: string[];
}

const ContentManager = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    category: 'all'
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const itemsPerPage = 10;

  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, filter]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
        
      if (error) throw error;
      
      if (data) {
        setContent(data);
        
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
        description: 'Failed to fetch content. Please try again.',
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
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const filterContent = () => {
    let filtered = [...content];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => item.title?.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
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
  
  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter(id => id !== itemId);
      } else {
        return [...prevSelected, itemId];
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
  
  const handleUpdateStatus = async (itemId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .update({ status })
        .eq('id', itemId);
        
      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `Content status has been updated to ${status}.`,
      });
      
      // Refresh content
      fetchContent();
    } catch (error) {
      console.error('Error updating content status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content status. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const getCategoryNameById = (id: string | null) => {
    if (!id) return 'Uncategorized';
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'Unknown';
  };
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Content Management - Admin</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Management</h1>
        
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
                <DialogDescription>
                  Add new learning content to the platform.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">Text Content</TabsTrigger>
                  <TabsTrigger value="upload">File Upload</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input id="title" placeholder="Content title" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content-type" className="text-right">
                        Content Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lesson">Lesson</SelectItem>
                          <SelectItem value="exercise">Exercise</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="flashcards">Flashcards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="content" className="text-right pt-2">
                        Content
                      </Label>
                      <Textarea 
                        id="content" 
                        placeholder="Enter your content here..." 
                        className="col-span-3 min-h-[200px]" 
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tags" className="text-right">
                        Tags
                      </Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Input id="tags" placeholder="Add tags separated by commas" />
                        <Button variant="outline" size="icon">
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="upload-title" className="text-right">
                        Title
                      </Label>
                      <Input id="upload-title" placeholder="File title" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        File
                      </Label>
                      <div className="col-span-3">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-8 text-center">
                          <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Drag and drop or click to upload
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Supports PDF, DOCX, PPTX up to 10MB
                            </p>
                          </div>
                          <Input 
                            type="file" 
                            className="hidden" 
                            id="file-upload" 
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Select File
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="file-type" className="text-right">
                        Content Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="presentation">Presentation</SelectItem>
                          <SelectItem value="worksheet">Worksheet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="file-category" className="text-right">
                        Category
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="bulk" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-8 text-center">
                      <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Upload a CSV file with content items
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Download template for required format
                        </p>
                      </div>
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                      >
                        Download Template
                      </Button>
                      <Input 
                        type="file" 
                        className="hidden" 
                        id="bulk-upload" 
                        accept=".csv"
                      />
                      <Button 
                        type="button"
                        className="mt-4 ml-2"
                        onClick={() => document.getElementById('bulk-upload')?.click()}
                      >
                        Select CSV File
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>The CSV file should include the following columns:</p>
                      <ul className="list-disc ml-5 mt-1">
                        <li>title</li>
                        <li>content_type</li>
                        <li>category_id</li>
                        <li>content (JSON format)</li>
                        <li>tags (comma-separated)</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <div className="flex items-center mr-auto space-x-2">
                  <Checkbox id="publish" />
                  <Label htmlFor="publish">Publish immediately</Label>
                </div>
                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                <Button>Save Content</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => fetchContent()}>
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="review">Under Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>
                Manage all learning content in the platform.
              </CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
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
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filter.status}
                    onValueChange={(value) => setFilter({ ...filter, status: value })}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="review">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filter.category}
                    onValueChange={(value) => setFilter({ ...filter, category: value })}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
                          </TableCell>
                          <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div></TableCell>
                          <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div></TableCell>
                          <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div></TableCell>
                          <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div></TableCell>
                          <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div></TableCell>
                          <TableCell><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div></TableCell>
                        </TableRow>
                      ))
                    ) : filteredContent.length > 0 ? (
                      filteredContent.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                              aria-label={`Select ${item.title}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.content_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {getCategoryNameById(item.category_id)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              item.status === 'published' ? 'default' : 
                              item.status === 'review' ? 'outline' : 
                              'secondary'
                            }>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>Preview</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Content</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => handleUpdateStatus(item.id, 'draft')}>
                                  <Badge variant="secondary" className="mr-2">Draft</Badge>
                                  <span>Set as Draft</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleUpdateStatus(item.id, 'review')}>
                                  <Badge variant="outline" className="mr-2">Review</Badge>
                                  <span>Send for Review</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleUpdateStatus(item.id, 'published')}>
                                  <Badge variant="default" className="mr-2">Published</Badge>
                                  <span>Publish</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
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
                        <TableCell colSpan={8} className="h-24 text-center">
                          No content items found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="mt-4">
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
                <div className="mt-4 p-2 bg-muted rounded-md flex justify-between items-center">
                  <span>{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedItems[0], 'published')}>
                      <Check className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedItems[0], 'draft')}>
                      <X className="mr-2 h-4 w-4" />
                      Unpublish
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Content</CardTitle>
              <CardDescription>Content items that are still in progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Filter status set to "draft" will display here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Content</CardTitle>
              <CardDescription>Content that is live and visible to users.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Filter status set to "published" will display here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Under Review</CardTitle>
              <CardDescription>Content waiting for approval before publishing.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Filter status set to "review" will display here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
