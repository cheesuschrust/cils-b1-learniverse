
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, normalizeUser } from '@/types/core';
import { UserRole } from '@/types/user';
import { MoreVertical, Edit, Trash2, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const UserManagementComponent: React.FC = () => {
  const { getAllUsers, createUser, updateUser, deleteUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        const normalizedUsers = data.map(user => normalizeUser(user));
        setUsers(normalizedUsers);
        setFilteredUsers(normalizedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAllUsers, toast]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercaseTerm = term.toLowerCase();
      const filtered = users.filter(user => 
        (user.firstName || '').toLowerCase().includes(lowercaseTerm) ||
        (user.lastName || '').toLowerCase().includes(lowercaseTerm) ||
        user.email.toLowerCase().includes(lowercaseTerm) ||
        (user.role as string).toLowerCase().includes(lowercaseTerm)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleOpenModal = (user: User | null, createMode: boolean) => {
    setSelectedUser(user ? { ...user } : {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      displayName: '',
      photoURL: '',
      role: 'user' as UserRole,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: undefined,
      lastActive: undefined,
      status: 'active',
      subscription: 'free',
      phoneNumber: '',
      address: '',
      preferences: {},
      preferredLanguage: 'english',
      language: 'english',
      metrics: { totalQuestions: 0, correctAnswers: 0, streak: 0 },
      dailyQuestionCounts: { 
        flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
      }
    } as User);
    setIsCreateMode(createMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      if (isCreateMode) {
        const newUser = {
          id: selectedUser.id,
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          role: selectedUser.role as UserRole,
          isVerified: selectedUser.isVerified,
          createdAt: new Date(selectedUser.createdAt || new Date()),
          updatedAt: new Date(),
          lastLogin: selectedUser.lastLogin ? new Date(selectedUser.lastLogin) : undefined,
          lastActive: selectedUser.lastActive ? new Date(selectedUser.lastActive) : undefined,
          status: selectedUser.status,
          subscription: selectedUser.subscription,
          preferredLanguage: selectedUser.preferredLanguage,
        };
        await createUser(newUser);
        toast({
          title: "Success",
          description: "User created successfully.",
        });
      } else {
        await updateUser(selectedUser.id, {
          ...selectedUser,
          role: selectedUser.role as UserRole
        });
        toast({
          title: "Success",
          description: "User updated successfully.",
        });
      }

      const data = await getAllUsers();
      const normalizedUsers = data.map(user => normalizeUser(user));
      setUsers(normalizedUsers);
      setFilteredUsers(normalizedUsers);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save user:", error);
      toast({
        title: "Error",
        description: `Failed to ${isCreateMode ? 'create' : 'update'} user. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });

      const data = await getAllUsers();
      const normalizedUsers = data.map(user => normalizeUser(user));
      setUsers(normalizedUsers);
      setFilteredUsers(normalizedUsers);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    try {
      setLoading(true);
      const updatedUser = users.find(user => user.id === userId);
      if (updatedUser) {
        updatedUser.role = newRole;
        await updateUser(userId, {
          ...updatedUser,
          role: updatedUser.role as UserRole
        });
        toast({
          title: "Success",
          description: "User role updated successfully.",
        });

        const data = await getAllUsers();
        const normalizedUsers = data.map(user => normalizeUser(user));
        setUsers(normalizedUsers);
        setFilteredUsers(normalizedUsers);
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      setLoading(true);
      const updatedUser = users.find(user => user.id === userId);
      if (updatedUser) {
        updatedUser.status = newStatus;
        await updateUser(userId, {
          ...updatedUser,
          role: updatedUser.role as UserRole
        });
        toast({
          title: "Success",
          description: "User status updated successfully.",
        });

        const data = await getAllUsers();
        const normalizedUsers = data.map(user => normalizeUser(user));
        setUsers(normalizedUsers);
        setFilteredUsers(normalizedUsers);
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'outline';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and roles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>
              View and manage user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-between items-center">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button onClick={() => handleOpenModal(null, true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>A list of all registered users.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Avatar</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={user.photoURL} />
                            <AvatarFallback>{user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select 
                            value={user.role as string} 
                            onValueChange={(newRole: UserRole) => handleChangeRole(user.id, newRole)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder={user.role} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(user.status) as "default" | "destructive" | "outline" | "secondary"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenModal(user, false)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
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

            <div className="flex items-center justify-between pt-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {filteredUsers.length} of {users.length} user(s)
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                  {page > 2 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setPage(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {page > 3 && <PaginationEllipsis />}
                  {Array.from({ length: Math.min(5, pageCount) })
                    .map((_, i) => {
                      const pageNumber = Math.max(1, Math.min(pageCount, page - 2 + i));
                      return (
                        pageNumber > 0 &&
                        pageNumber <= pageCount && (
                          <PaginationItem
                            key={pageNumber}
                            className={pageNumber === page ? "active" : ""}
                          >
                            <PaginationLink 
                              onClick={() => setPage(pageNumber)}
                              isActive={pageNumber === page}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      );
                    })}
                  {page < pageCount - 2 && <PaginationEllipsis />}
                  {page < pageCount - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setPage(pageCount)}>
                        {pageCount}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationNext
                    onClick={() => page < pageCount && setPage(page + 1)}
                    className={page === pageCount ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isCreateMode ? "Create User" : "Edit User"}</DialogTitle>
              <DialogDescription>
                {isCreateMode ? "Create a new user account." : "Update user details."}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      value={selectedUser?.firstName || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      value={selectedUser?.lastName || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={selectedUser.role as string} 
                    onValueChange={(role: UserRole) => setSelectedUser({ ...selectedUser, role })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedUser.role} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={selectedUser.status} 
                    onValueChange={(status: 'active' | 'inactive' | 'suspended') => setSelectedUser({ ...selectedUser, status })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedUser.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVerified"
                    checked={selectedUser.isVerified}
                    onCheckedChange={(checked) => setSelectedUser({ ...selectedUser, isVerified: checked })}
                  />
                  <Label htmlFor="isVerified">Verified</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSaveUser}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default UserManagementComponent;
