
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, MoreHorizontal, UserPlus, Download, Trash2, Mail, ShieldCheck, ShieldX, Lock, UserX, Edit, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { updateUserSubscription } from "@/lib/supabase";
import UsersStatsCards from "@/components/admin/analytics/UsersStatsCards";

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  last_active: string | null;
  created_at: string;
  subscription: 'free' | 'premium';
  is_verified: boolean;
}

const UserManagementComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    subscription: "free"
  });
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    growth: 0,
    premium: 0,
    newToday: 0
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = users;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        (user.first_name?.toLowerCase().includes(query) || false) || 
        (user.last_name?.toLowerCase().includes(query) || false) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Role filter
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, statusFilter, roleFilter]);
  
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
      
      setUsers(data || []);
      setFilteredUsers(data || []);
      
      // Calculate stats
      if (data) {
        const today = new Date().toISOString().split('T')[0];
        const activeUsers = data.filter(user => user.status === 'active');
        const premiumUsers = data.filter(user => user.subscription === 'premium');
        const newToday = data.filter(user => user.created_at.startsWith(today)).length;
        
        // Calculate growth (comparing to 30 days ago)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
        
        const olderUsers = data.filter(user => {
          const createdDate = new Date(user.created_at).toISOString().split('T')[0];
          return createdDate < thirtyDaysAgoStr;
        }).length;
        
        const newUsers = data.length - olderUsers;
        const growth = olderUsers > 0 ? Math.round((newUsers / olderUsers) * 100) : 100;
        
        setUserStats({
          total: data.length,
          active: activeUsers.length,
          premium: premiumUsers.length,
          growth,
          newToday
        });
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const validateForm = (data: typeof newUser): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!data.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!data.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email address is invalid";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();
        
      if (error && error.code !== 'PGSQL_EMPTY_RESULT') {
        console.error('Error checking email:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };
  
  const handleAddUser = async () => {
    if (isSubmitting) return;
    
    if (!validateForm(newUser)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }
    
    // Check if email already exists
    const emailExists = await checkEmailExists(newUser.email);
    if (emailExists) {
      setFormErrors({...formErrors, email: "This email is already in use"});
      toast({
        title: "Email already exists",
        description: "Please use a different email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a random password for the new user
      const password = generateRandomPassword();
      
      // Create auth user with Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email.toLowerCase(),
        password,
        email_confirm: true
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      // Insert user data into users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: newUser.email.toLowerCase(),
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          role: newUser.role,
          subscription: newUser.subscription,
          status: 'active',
          is_verified: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          last_active: new Date().toISOString()
        });
        
      if (userError) {
        throw userError;
      }
      
      toast({
        title: "User added",
        description: `${newUser.firstName} ${newUser.lastName} has been added successfully`,
      });
      
      // Reset form
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        role: "user",
        subscription: "free"
      });
      setFormErrors({});
      setShowAddUserDialog(false);
      
      // Refresh user list
      fetchUsers();
      
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateUser = async () => {
    if (!selectedUser || isSubmitting) return;
    
    const userData = {
      firstName: selectedUser.first_name || "",
      lastName: selectedUser.last_name || "",
      email: selectedUser.email,
      role: selectedUser.role,
      subscription: selectedUser.subscription
    };
    
    if (!validateForm(userData)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If email is changed, check if new email already exists
      if (selectedUser.email !== userData.email) {
        const emailExists = await checkEmailExists(selectedUser.email);
        if (emailExists) {
          setFormErrors({...formErrors, email: "This email is already in use"});
          toast({
            title: "Email already exists",
            description: "Please use a different email address",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      const { error } = await supabase
        .from('users')
        .update({
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email.toLowerCase(),
          role: selectedUser.role,
          status: selectedUser.status,
          subscription: selectedUser.subscription,
          last_active: new Date().toISOString()
        })
        .eq('id', selectedUser.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "User updated",
        description: "User information has been updated successfully",
      });
      
      setFormErrors({});
      setShowEditUserDialog(false);
      fetchUsers();
      
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteUser = async (id: string) => {
    try {
      // First, check if this is the last admin
      if (users.filter(u => u.role === 'admin').length <= 1) {
        const userToDelete = users.find(u => u.id === id);
        if (userToDelete?.role === 'admin') {
          toast({
            title: "Cannot delete user",
            description: "Cannot delete the last admin user",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Confirm before deletion
      if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        return;
      }
      
      // Delete the user using Supabase Admin API
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) {
        throw error;
      }
      
      // Also delete the user from the users table
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      toast({
        title: "User deleted",
        description: "User has been deleted successfully",
      });
      
      fetchUsers();
      
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user: " + error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleStatusChange = async (id: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status,
          last_active: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Status updated",
        description: `User status has been updated to ${status}`,
      });
      
      fetchUsers();
      
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status: " + error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleRoleChange = async (id: string, role: 'user' | 'admin') => {
    try {
      // Check if this is the last admin
      if (role === 'user' && users.filter(u => u.role === 'admin').length <= 1) {
        const userToChange = users.find(u => u.id === id);
        if (userToChange?.role === 'admin') {
          toast({
            title: "Cannot change role",
            description: "Cannot demote the last admin user",
            variant: "destructive"
          });
          return;
        }
      }
      
      const { error } = await supabase
        .from('users')
        .update({ 
          role,
          last_active: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${role}`,
      });
      
      fetchUsers();
      
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role: " + error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleSubscriptionChange = async (id: string, subscription: 'free' | 'premium') => {
    try {
      const success = await updateUserSubscription(id, subscription);
      
      if (!success) {
        throw new Error("Failed to update subscription");
      }
      
      toast({
        title: "Subscription updated",
        description: `User subscription has been updated to ${subscription}`,
      });
      
      fetchUsers();
      
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription: " + error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset",
        description: `Password reset email sent to ${email}`,
      });
      
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast({
        title: "Error",
        description: "Failed to send password reset: " + error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleExportUsers = () => {
    try {
      // Format data for export
      const exportData = filteredUsers.map(user => ({
        ID: user.id,
        FirstName: user.first_name || '',
        LastName: user.last_name || '',
        Email: user.email,
        Role: user.role,
        Status: user.status,
        Subscription: user.subscription,
        LastActive: user.last_active || 'Never',
        Created: user.created_at,
      }));
      
      // Convert to CSV
      const headers = Object.keys(exportData[0]).join(',');
      const rows = exportData.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Export successful",
        description: `Exported ${exportData.length} users to CSV`,
      });
    } catch (error: any) {
      console.error('Error exporting users:', error);
      toast({
        title: "Export failed",
        description: "Failed to export users: " + error.message,
        variant: "destructive"
      });
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "user":
        return "secondary";
      default:
        return "outline";
    }
  };
  
  const getSubscriptionBadgeVariant = (subscription: string) => {
    switch (subscription) {
      case "premium":
        return "default";
      case "free":
        return "secondary";
      default:
        return "outline";
    }
  };
  
  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
    }
  };
  
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return (
    <div className="w-full">
      {/* Statistics Section */}
      <UsersStatsCards 
        data={userStats}
      />
      
      <Card className="mb-8 mt-8">
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
          <CardDescription>Search and filter users by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage your application users</CardDescription>
          </div>
          <Button onClick={() => setShowAddUserDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{`${user.first_name || ''} ${user.last_name || ''}`}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSubscriptionBadgeVariant(user.subscription)}>
                          {user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.last_active)}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedUser(user);
                              setShowEditUserDialog(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              window.location.href = `mailto:${user.email}`;
                            }}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role === "admin" ? "user" : "admin")}>
                              {user.role === "admin" ? (
                                <>
                                  <ShieldX className="mr-2 h-4 w-4" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Make Admin
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.subscription === "free" ? (
                              <DropdownMenuItem onClick={() => handleSubscriptionChange(user.id, "premium")}>
                                <span className="mr-2">⭐</span>
                                Upgrade to Premium
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleSubscriptionChange(user.id, "free")}>
                                <span className="mr-2">↓</span>
                                Downgrade to Free
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                <Check className="mr-2 h-4 w-4" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} 
                              className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <Button variant="outline" size="sm" onClick={handleExportUsers}>
                <Download className="mr-2 h-4 w-4" />
                Export Users
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and send them an invitation email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name*</Label>
              <Input 
                id="firstName" 
                value={newUser.firstName} 
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                placeholder="John"
                className={formErrors.firstName ? "border-red-500" : ""}
              />
              {formErrors.firstName && (
                <span className="text-sm text-red-500">{formErrors.firstName}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input 
                id="lastName" 
                value={newUser.lastName} 
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                placeholder="Doe"
                className={formErrors.lastName ? "border-red-500" : ""}
              />
              {formErrors.lastName && (
                <span className="text-sm text-red-500">{formErrors.lastName}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email*</Label>
              <Input 
                id="email" 
                type="email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="john@example.com"
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <span className="text-sm text-red-500">{formErrors.email}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value: any) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subscription">Subscription</Label>
                <Select 
                  value={newUser.subscription} 
                  onValueChange={(value: any) => setNewUser({...newUser, subscription: value})}
                >
                  <SelectTrigger id="subscription">
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddUserDialog(false);
              setFormErrors({});
            }}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                'Add User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={(open) => {
        setShowEditUserDialog(open);
        if (!open) setFormErrors({});
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-firstName">First Name*</Label>
                <Input 
                  id="edit-firstName" 
                  value={selectedUser.first_name || ''} 
                  onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})}
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && (
                  <span className="text-sm text-red-500">{formErrors.firstName}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lastName">Last Name*</Label>
                <Input 
                  id="edit-lastName" 
                  value={selectedUser.last_name || ''} 
                  onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})}
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && (
                  <span className="text-sm text-red-500">{formErrors.lastName}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email*</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={selectedUser.email} 
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <span className="text-sm text-red-500">{formErrors.email}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(value: any) => setSelectedUser({...selectedUser, role: value})}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedUser.status} 
                    onValueChange={(value: any) => setSelectedUser({...selectedUser, status: value})}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-subscription">Subscription</Label>
                <Select 
                  value={selectedUser.subscription} 
                  onValueChange={(value: any) => setSelectedUser({...selectedUser, subscription: value})}
                >
                  <SelectTrigger id="edit-subscription">
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditUserDialog(false);
              setFormErrors({});
            }}>Cancel</Button>
            <Button onClick={handleUpdateUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementComponent;
