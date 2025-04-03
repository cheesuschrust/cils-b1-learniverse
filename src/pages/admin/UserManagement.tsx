
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  Shield,
  Ban,
  Mail
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface User {
  id: string;
  email: string;
  role: string;
  subscription_tier: string;
  full_name: string | null;
  last_login: string | null;
  created_at: string;
  status: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    role: 'all',
    subscription: 'all',
    status: 'all'
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * usersPerPage, currentPage * usersPerPage - 1);
        
      if (error) throw error;
      
      if (data) {
        setUsers(data);
        
        // Get total count for pagination
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        const totalPages = Math.ceil((count || 0) / usersPerPage);
        setTotalPages(totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filterUsers = () => {
    let filtered = [...users];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.email?.toLowerCase().includes(query) || 
          user.full_name?.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filter.role !== 'all') {
      filtered = filtered.filter(user => user.role === filter.role);
    }
    
    if (filter.subscription !== 'all') {
      filtered = filtered.filter(user => user.subscription_tier === filter.subscription);
    }
    
    if (filter.status !== 'all') {
      filtered = filtered.filter(user => user.status === filter.status);
    }
    
    setFilteredUsers(filtered);
  };
  
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      // Update user role
      const { error: userError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);
        
      if (userError) throw userError;
      
      // Check if role exists in user_roles
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', role);
        
      if (!existingRole || existingRole.length === 0) {
        // Add role to user_roles
        await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });
      }
      
      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${role}.`,
      });
      
      // Refresh users
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `User status has been updated to ${status}.`,
      });
      
      // Refresh users
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateUserSubscription = async (userId: string, subscription_tier: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ subscription_tier })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: 'Subscription Updated',
        description: `User subscription has been updated to ${subscription_tier}.`,
      });
      
      // Refresh users
      fetchUsers();
    } catch (error) {
      console.error('Error updating user subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>User Management - Admin</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the platform. They will receive an email to set their password.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" placeholder="user@example.com" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Full Name
                    </Label>
                    <Input id="name" placeholder="John Doe" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subscription" className="text-right">
                      Subscription
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a subscription" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-start-2 col-span-3 flex items-center space-x-2">
                      <Checkbox id="send-email" />
                      <Label htmlFor="send-email">Send welcome email</Label>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={() => fetchUsers()}>
              Refresh
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage and monitor user accounts on the platform.
            </CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filter.role}
                  onValueChange={(value) => setFilter({ ...filter, role: value })}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filter.subscription}
                  onValueChange={(value) => setFilter({ ...filter, subscription: value })}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subs</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Login</TableHead>
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
                          <div className="flex flex-col space-y-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
                          </div>
                        </TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div></TableCell>
                        <TableCell><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                            aria-label={`Select ${user.email}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.full_name || 'No name'}</span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 
                                        user.role === 'moderator' ? 'outline' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.subscription_tier === 'premium' ? 'default' : 
                                        user.subscription_tier === 'instructor' ? 'outline' : 'secondary'}>
                            {user.subscription_tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 
                                        user.status === 'suspended' ? 'destructive' : 'outline'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</TableCell>
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
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit User</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleUpdateUserRole(user.id, 'admin')}>
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Make Admin</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => handleUpdateUserStatus(user.id, 'active')}>
                                <Badge variant="default" className="mr-2">Active</Badge>
                                <span>Set Active</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleUpdateUserStatus(user.id, 'suspended')}>
                                <Ban className="mr-2 h-4 w-4" />
                                <span>Suspend User</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Email User</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No users found.
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
            
            {selectedUsers.length > 0 && (
              <div className="mt-4 p-2 bg-muted rounded-md flex justify-between items-center">
                <span>{selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected</span>
                <div className="space-x-2">
                  <Button size="sm" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button size="sm" variant="default">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
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
      </div>
    </ProtectedRoute>
  );
};

export default UserManagement;
