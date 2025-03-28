
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { Loader2, Search, UserPlus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { normalizeUser } from '@/types/type-compatibility';

// Validation schema for user form
const userFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  role: z.enum(['user', 'admin'], { 
    required_error: 'Please select a role',
  }),
  subscription: z.enum(['free', 'premium'], {
    required_error: 'Please select a subscription',
  }),
  status: z.enum(['active', 'inactive', 'suspended'], {
    required_error: 'Please select a status',
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagementComponent: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState<boolean>(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState<boolean>(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      role: 'user',
      subscription: 'free',
      status: 'active',
      password: '',
    }
  });

  // Edit form with different validation (password optional)
  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(
      userFormSchema.omit({ password: true }).merge(
        z.object({
          password: z.string().min(8, { message: 'Password must be at least 8 characters' }).optional(),
        })
      )
    ),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      role: 'user',
      subscription: 'free',
      status: 'active',
    }
  });

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(lowercaseQuery) ||
        (user.firstName && user.firstName.toLowerCase().includes(lowercaseQuery)) ||
        (user.lastName && user.lastName.toLowerCase().includes(lowercaseQuery)) ||
        user.role.toLowerCase().includes(lowercaseQuery) ||
        (user.subscription && user.subscription.toLowerCase().includes(lowercaseQuery)) ||
        (user.status && user.status.toLowerCase().includes(lowercaseQuery))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Fetch users from database
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform data to match User type using our normalizeUser utility
      const formattedUsers = data.map(user => normalizeUser({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role as 'user' | 'admin',
        isVerified: user.is_verified,
        created_at: new Date(user.created_at),
        last_login: user.last_login ? new Date(user.last_login) : new Date(),
        last_active: user.last_active ? new Date(user.last_active) : new Date(),
        status: user.status as 'active' | 'inactive' | 'suspended',
        subscription: user.subscription as 'free' | 'premium',
        preferred_language: user.preferred_language as 'english' | 'italian' | 'both',
      }));
      
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        description: error.message || 'An error occurred while fetching users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add user form submission
  const onAddUserSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      // First check if email exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', values.email)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      if (existingUser) {
        toast({
          title: 'Email already exists',
          description: 'A user with this email address already exists.',
          variant: 'destructive',
        });
        return;
      }
      
      // Create auth user if password provided
      let userId = crypto.randomUUID();
      
      if (values.password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        
        if (authError) {
          throw authError;
        }
        
        if (authData.user) {
          userId = authData.user.id;
        }
      }
      
      // Create user in the database
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          role: values.role,
          subscription: values.subscription,
          status: values.status,
          is_verified: false,
          created_at: new Date().toISOString(),
          preferred_language: 'english',
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Create user metrics
      await supabase
        .from('user_metrics')
        .insert({
          user_id: userId,
          total_questions: 0,
          correct_answers: 0,
          streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      toast({
        title: 'User created',
        description: `Successfully created user ${values.email}`,
      });
      
      setIsAddUserDialogOpen(false);
      form.reset();
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error adding user',
        description: error.message || 'An error occurred while adding the user.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit user form submission
  const onEditUserSubmit = async (values: UserFormValues) => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      const updates: any = {
        first_name: values.first_name,
        last_name: values.last_name,
        role: values.role,
        subscription: values.subscription,
        status: values.status,
      };
      
      // Update user in the database
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', selectedUser.id);
      
      if (error) {
        throw error;
      }
      
      // Update password if provided
      if (values.password) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          selectedUser.id,
          { password: values.password }
        );
        
        if (passwordError) {
          throw passwordError;
        }
      }
      
      toast({
        title: 'User updated',
        description: `Successfully updated user ${values.email}`,
      });
      
      setIsEditUserDialogOpen(false);
      editForm.reset();
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error updating user',
        description: error.message || 'An error occurred while updating the user.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const onDeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      // Delete user from the auth system
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedUser.id
      );
      
      if (authError) {
        console.error('Error deleting auth user:', authError);
        // Continue with database deletion even if auth deletion fails
      }
      
      // Delete user from the database
      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id);
      
      if (dbError) {
        throw dbError;
      }
      
      toast({
        title: 'User deleted',
        description: `Successfully deleted user ${selectedUser.email}`,
      });
      
      setIsDeleteUserDialogOpen(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error deleting user',
        description: error.message || 'An error occurred while deleting the user.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit user dialog and populate form
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      email: user.email,
      first_name: user.firstName || '',
      last_name: user.lastName || '',
      role: user.role as 'user' | 'admin',
      subscription: user.subscription as 'free' | 'premium',
      status: user.status as 'active' | 'inactive' | 'suspended',
      password: '',
    });
    setIsEditUserDialogOpen(true);
  };

  // Open delete user dialog
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage the users of your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No users match your search criteria' : 'No users found'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.firstName || user.lastName ? 
                          `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                          'N/A'}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.subscription === 'premium' ? 'default' : 'outline'}>
                          {user.subscription === 'premium' ? 'Premium' : 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.status === 'active' ? 'success' :
                            user.status === 'inactive' ? 'secondary' : 'destructive'
                          }
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddUserSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="email@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter password"
                      />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subscription" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Modify user details
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditUserSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Leave blank to keep current password"
                      />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="subscription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subscription" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-md">
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p>
                  <strong>Name:</strong> {selectedUser.firstName || selectedUser.lastName ? 
                    `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() : 
                    'N/A'
                  }
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </p>
              </div>
              <DialogFooter className="flex flex-row gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteUserDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={onDeleteUser}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete User'
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementComponent;
