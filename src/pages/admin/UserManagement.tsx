
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  UserCog, 
  MoreHorizontal, 
  ShieldAlert, 
  Shield, 
  Trash2, 
  CheckCircle,
  XCircle,
  UserPlus,
  ArrowUpDown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/contexts/shared-types";

// Placeholder for a dialog component that could be used for confirming actions
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { getAllUsers, makeAdmin, deleteUser, disableUser, enableUser, updateUserStatus, updateUserSubscription } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  
  useEffect(() => {
    const fetchUsers = () => {
      try {
        const allUsers = getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [getAllUsers, toast]);
  
  const handleMakeAdmin = (userId: string, userName: string) => {
    setDialogState({
      isOpen: true,
      title: "Promote to Admin",
      message: `Are you sure you want to promote ${userName} to admin? This will give them full access to all administrative features.`,
      onConfirm: async () => {
        try {
          await makeAdmin(userId);
          // Update local user list
          setUsers(users.map(user => 
            user.id === userId ? { ...user, role: 'admin' } : user
          ));
          toast({
            title: "User Promoted",
            description: `${userName} has been promoted to admin.`,
          });
        } catch (error) {
          console.error("Error promoting user:", error);
          toast({
            title: "Error",
            description: "Failed to promote user.",
            variant: "destructive"
          });
        } finally {
          setDialogState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };
  
  const handleDeleteUser = (userId: string, userName: string) => {
    setDialogState({
      isOpen: true,
      title: "Delete User",
      message: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteUser(userId);
          // Update local user list
          setUsers(users.filter(user => user.id !== userId));
          toast({
            title: "User Deleted",
            description: `${userName} has been deleted.`,
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          toast({
            title: "Error",
            description: "Failed to delete user.",
            variant: "destructive"
          });
        } finally {
          setDialogState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };
  
  const handleToggleUserStatus = async (userId: string, userName: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'suspend';
    
    try {
      await updateUserStatus(userId, newStatus);
      // Update local user list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus as 'active' | 'inactive' | 'suspended' } : user
      ));
      toast({
        title: "User Updated",
        description: `${userName} has been ${action}d.`,
      });
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} user.`,
        variant: "destructive"
      });
    }
  };
  
  const handleToggleSubscription = async (userId: string, userName: string, currentSubscription: string) => {
    const newSubscription = currentSubscription === 'premium' ? 'free' : 'premium';
    
    try {
      await updateUserSubscription(userId, newSubscription);
      // Update local user list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, subscription: newSubscription as 'free' | 'premium' } : user
      ));
      toast({
        title: "Subscription Updated",
        description: `${userName}'s subscription has been updated to ${newSubscription}.`,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription.",
        variant: "destructive"
      });
    }
  };
  
  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <UserCog className="h-6 w-6 mr-2" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === 'admin' ? (
                          <Badge variant="default" className="bg-purple-600">
                            <ShieldAlert className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'success' : 'destructive'}
                          className={user.status === 'active' ? 'bg-green-600' : ''}
                        >
                          {user.status === 'active' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'}>
                          {user.subscription === 'premium' ? 'Premium' : 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.role !== 'admin' && (
                              <DropdownMenuItem onClick={() => handleMakeAdmin(user.id, `${user.firstName} ${user.lastName}`)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Promote to Admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleToggleSubscription(user.id, `${user.firstName} ${user.lastName}`, user.subscription)}>
                              <ArrowUpDown className="h-4 w-4 mr-2" />
                              {user.subscription === 'premium' ? 'Downgrade to Free' : 'Upgrade to Premium'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, `${user.firstName} ${user.lastName}`, user.status)}>
                              {user.status === 'active' ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Suspend User
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <ConfirmDialog 
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        onClose={closeDialog}
        onConfirm={dialogState.onConfirm}
      />
    </div>
  );
};

export default UserManagement;
