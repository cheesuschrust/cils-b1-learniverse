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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { User, UserRole } from '@/types/user';
import { ExtendedButtonVariant } from '@/types/variant-fixes';
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
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
        const normalizedUsers = data.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName || user.first_name,
          lastName: user.lastName || user.last_name,
          first_name: user.firstName || user.first_name,
          last_name: user.lastName || user.last_name,
          displayName: user.displayName || user.name,
          photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage,
          role: user.role || 'user',
          isVerified: user.isVerified || user.is_verified || false,
          createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
          created_at: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
          updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
          updated_at: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
          lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
          last_login: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
          lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
          last_active: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
          status: user.status || 'active',
          subscription: user.subscription || 'free',
          phoneNumber: user.phoneNumber || user.phone_number,
          address: user.address,
          preferences: user.preferences || {},
          preferredLanguage: user.preferredLanguage || user.preferred_language || 'english',
          preferred_language: user.preferredLanguage || user.preferred_language || 'english',
          language: user.language || user.preferredLanguage || user.preferred_language || 'english',
          metrics: user.metrics || { totalQuestions: 0, correctAnswers: 0, streak: 0 },
          dailyQuestionCounts: user.dailyQuestionCounts || { 
            flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
          }
        }));
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
        (user.firstName || user.first_name || '').toLowerCase().includes(lowercaseTerm) ||
        (user.lastName || user.last_name || '').toLowerCase().includes(lowercaseTerm) ||
        user.email.toLowerCase().includes(lowercaseTerm) ||
        user.role.toLowerCase().includes(lowercaseTerm)
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
      first_name: '',
      last_name: '',
      displayName: '',
      photoURL: '',
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
      created_at: new Date(),
      updatedAt: new Date(),
      updated_at: new Date(),
      lastLogin: undefined,
      last_login: undefined,
      lastActive: undefined,
      last_active: undefined,
      status: 'active',
      subscription: 'free',
      phoneNumber: '',
      address: '',
      preferences: {},
      preferredLanguage: 'english',
      preferred_language: 'english',
      language: 'english',
      metrics: { totalQuestions: 0, correctAnswers: 0, streak: 0 },
      dailyQuestionCounts: { 
        flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
      }
    });
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
          firstName: selectedUser.first_name,
          lastName: selectedUser.last_name,
          role: selectedUser.role || 'user',
          isVerified: selectedUser.isVerified,
          createdAt: new Date(selectedUser.created_at),
          updatedAt: new Date(),
          lastLogin: new Date(selectedUser.last_login),
          lastActive: new Date(selectedUser.last_active),
          status: selectedUser.status,
          subscription: selectedUser.subscription,
          preferredLanguage: selectedUser.preferred_language,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          preferred_language: selectedUser.preferred_language,
        };
        await createUser(newUser);
        toast({
          title: "Success",
          description: "User created successfully.",
        });
      } else {
        await updateUser(selectedUser.id, selectedUser);
        toast({
          title: "Success",
          description: "User updated successfully.",
        });
      }

      const data = await getAllUsers();
      const normalizedUsers = data.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName || user.first_name,
        lastName: user.lastName || user.last_name,
        first_name: user.firstName || user.first_name,
        last_name: user.lastName || user.last_name,
        displayName: user.displayName || user.name,
        photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage,
        role: user.role || 'user',
        isVerified: user.isVerified || user.is_verified || false,
        createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
        created_at: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
        updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
        updated_at: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
        lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
        last_login: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
        lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
        last_active: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
        status: user.status || 'active',
        subscription: user.subscription || 'free',
        phoneNumber: user.phoneNumber || user.phone_number,
        address: user.address,
        preferences: user.preferences || {},
        preferredLanguage: user.preferredLanguage || user.preferred_language || 'english',
        preferred_language: user.preferredLanguage || user.preferred_language || 'english',
        language: user.language || user.preferredLanguage || user.preferred_language || 'english',
        metrics: user.metrics || { totalQuestions: 0, correctAnswers: 0, streak: 0 },
        dailyQuestionCounts: user.dailyQuestionCounts || { 
          flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
        }
      }));
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
      const normalizedUsers = data.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName || user.first_name,
        lastName: user.lastName || user.last_name,
        first_name: user.firstName || user.first_name,
        last_name: user.lastName || user.last_name,
        displayName: user.displayName || user.name,
        photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage,
        role: user.role || 'user',
        isVerified: user.isVerified || user.is_verified || false,
        createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
        created_at: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
        updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
        updated_at: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
        lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
        last_login: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
        lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
        last_active: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
        status: user.status || 'active',
        subscription: user.subscription || 'free',
        phoneNumber: user.phoneNumber || user.phone_number,
        address: user.address,
        preferences: user.preferences || {},
        preferredLanguage: user.preferredLanguage || user.preferred_language || 'english',
        preferred_language: user.preferredLanguage || user.preferred_language || 'english',
        language: user.language || user.preferredLanguage || user.preferred_language || 'english',
        metrics: user.metrics || { totalQuestions: 0, correctAnswers: 0, streak: 0 },
        dailyQuestionCounts: user.dailyQuestionCounts || { 
          flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
        }
      }));
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
        await updateUser(userId, updatedUser);
        toast({
          title: "Success",
          description: "User role updated successfully.",
        });

        const data = await getAllUsers();
        const normalizedUsers = data.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName || user.first_name,
          lastName: user.lastName || user.last_name,
          first_name: user.firstName || user.first_name,
          last_name: user.lastName || user.last_name,
          displayName: user.displayName || user.name,
          photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage,
          role: user.role || 'user',
          isVerified: user.isVerified || user.is_verified || false,
          createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
          created_at: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
          updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
          updated_at: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
          lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
          last_login: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
          lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
          last_active: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
          status: user.status || 'active',
          subscription: user.subscription || 'free',
          phoneNumber: user.phoneNumber || user.phone_number,
          address: user.address,
          preferences: user.preferences || {},
          preferredLanguage: user.preferredLanguage || user.preferred_language || 'english',
          preferred_language: user.preferredLanguage || user.preferred_language || 'english',
          language: user.language || user.preferredLanguage || user.preferred_language || 'english',
          metrics: user.metrics || { totalQuestions: 0, correctAnswers: 0, streak: 0 },
          dailyQuestionCounts: user.dailyQuestionCounts || { 
            flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
          }
        }));
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
        await updateUser(userId, updatedUser);
        toast({
          title: "Success",
          description: "User status updated successfully.",
        });

        const data = await getAllUsers();
        const normalizedUsers = data.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName || user.first_name,
          lastName: user.lastName || user.last_name,
          first_name: user.firstName || user.first_name,
          last_name: user.lastName || user.last_name,
          displayName: user.displayName || user.name,
          photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage,
          role: user.role || 'user',
          isVerified: user.isVerified || user.is_verified || false,
          createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
          created_at: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
          updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
          updated_at: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
          lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
          last_login: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
          lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
          last_active: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
          status: user.status || 'active',
          subscription: user.subscription || 'free',
          phoneNumber: user.phoneNumber || user.phone_number,
          address: user.address,
          preferences: user.preferences || {},
          preferredLanguage: user.preferredLanguage || user.preferred_language || 'english',
          preferred_language: user.preferredLanguage || user.preferred_language || 'english',
          language: user.language || user.preferredLanguage || user.preferred_language || 'english',
          metrics: user.metrics || { totalQuestions: 0, correctAnswers: 0, streak: 0 },
          dailyQuestionCounts: user.dailyQuestionCounts || { 
            flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
          }
        }));
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
                            <AvatarFallback>{user.firstName?.[0] || user.first_name?.[0] || 'U'}{user.lastName?.[0] || user.last_name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{user.firstName || user.first_name} {user.lastName || user.last_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select value={user.role} onValueChange={(newRole: UserRole) => handleChangeRole(user.id, newRole)}>
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
                          <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
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
                  <PaginationPrevious onClick={() => setPage(page - 1)} disabled={page === 1} />
                  {page > 2 && (
                    <PaginationItem onClick={() => setPage(1)}>
                      1
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
                            onClick={() => setPage(pageNumber)}
                            className={pageNumber === page ? "active" : ""}
                          >
                            {pageNumber}
                          </PaginationItem>
                        )
                      );
                    })}
                  {page < pageCount - 2 && <PaginationEllipsis />}
                  {page < pageCount - 1 && (
                    <PaginationItem onClick={() => setPage(pageCount)}>
                      {pageCount}
                    </PaginationItem>
                  )}
                  <PaginationNext onClick={() => setPage(page + 1)} disabled={page === pageCount} />
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
                      value={selectedUser?.firstName || selectedUser?.first_name || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      value={selectedUser?.lastName || selectedUser?.last_name || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value, last_name: e.target.value})}
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
                  <Select value={selectedUser.role} onValueChange={(role: UserRole) => setSelectedUser({ ...selectedUser, role })}>
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
                  <Select value={selectedUser.status} onValueChange={(status: 'active' | 'inactive' | 'suspended') => setSelectedUser({ ...selectedUser, status })}>
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
              <Button type="submit" onClick={handleSaveUser} disabled={loading}>
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
