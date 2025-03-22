
import React, { useState, useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  UserPlus, 
  Users, 
  Search, 
  MoreVertical, 
  Shield, 
  UserCheck, 
  UserX, 
  Star, 
  Clock, 
  RefreshCw, 
  Plus 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useSystemLog } from "@/hooks/use-system-log";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    makeAdmin: false,
    subscription: "free" as "free" | "premium",
  });
  
  const { getAllUsers, updateUserStatus, updateUserSubscription, addAdmin } = useAuth();
  const { toast } = useToast();
  const systemLog = useSystemLog();
  
  const [users, setUsers] = useState<Array<any>>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = () => {
    setUsers(getAllUsers());
  };
  
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.username && user.username.toLowerCase().includes(searchLower))
    );
  });
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };
  
  const activateUser = async (userId: string) => {
    const success = await updateUserStatus(userId, "active");
    if (success) {
      loadUsers();
      systemLog.logUserAction("User activated", `User ID: ${userId} was activated`);
      toast({
        title: "User Activated",
        description: "User has been successfully activated",
      });
    }
  };
  
  const deactivateUser = async (userId: string) => {
    const success = await updateUserStatus(userId, "inactive");
    if (success) {
      loadUsers();
      systemLog.logUserAction("User deactivated", `User ID: ${userId} was deactivated`);
      toast({
        title: "User Deactivated",
        description: "User has been successfully deactivated",
      });
    }
  };
  
  const upgradeUser = async (userId: string) => {
    const success = await updateUserSubscription(userId, "premium");
    if (success) {
      loadUsers();
      systemLog.logUserAction("User upgraded", `User ID: ${userId} was upgraded to Premium`);
      toast({
        title: "Subscription Updated",
        description: "User has been upgraded to Premium",
      });
    }
  };
  
  const downgradeUser = async (userId: string) => {
    const success = await updateUserSubscription(userId, "free");
    if (success) {
      loadUsers();
      systemLog.logUserAction("User downgraded", `User ID: ${userId} was downgraded to Free`);
      toast({
        title: "Subscription Updated",
        description: "User has been downgraded to Free",
      });
    }
  };
  
  const viewUserDetails = (user: any) => {
    setUserDetails(user);
    setShowUserDetails(true);
  };
  
  const promoteToAdmin = async (userId: string) => {
    await addAdmin(userId);
    systemLog.logUserAction("User promoted", `User ID: ${userId} was promoted to Admin`);
    loadUsers();
    toast({
      title: "Role Updated",
      description: "User has been promoted to Admin",
    });
  };
  
  const handleAddUser = async () => {
    try {
      // Here would typically be code to create a new user
      // For this demo, we'll just show a success message
      
      toast({
        title: "User Added",
        description: `New user ${newUserData.email} has been created`,
      });
      
      setNewUserData({
        firstName: "",
        lastName: "",
        email: "",
        makeAdmin: false,
        subscription: "free"
      });
      
      systemLog.logUserAction("Admin added", `New admin account created: ${newUserData.email}`);
      setIsAddUserOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };
  
  // Fixed: Updated the handler to handle both input and select elements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setNewUserData(prev => ({ ...prev, makeAdmin: checked }));
  };
  
  const handleRefresh = () => {
    loadUsers();
    toast({
      title: "Refreshed",
      description: "User list has been refreshed",
    });
  };
  
  const handleUserSubscriptionChange = async (userId: string, newSubscription: string) => {
    const success = await updateUserSubscription(userId, newSubscription);
    if (success) {
      loadUsers();
      toast({
        title: "Subscription Updated",
        description: `User has been upgraded to ${newSubscription}`,
      });
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account for the platform.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={newUserData.firstName}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={newUserData.lastName}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={newUserData.email}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subscription" className="text-right">
                      Subscription
                    </Label>
                    <select
                      id="subscription"
                      name="subscription"
                      value={newUserData.subscription}
                      onChange={handleInputChange}
                      className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="makeAdmin" className="text-right">
                      Make Admin
                    </Label>
                    <Checkbox
                      id="makeAdmin"
                      checked={newUserData.makeAdmin}
                      onCheckedChange={handleCheckboxChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddUser}>
                    Create User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users" onClick={() => setActiveTab("users")}>
                Users
              </TabsTrigger>
              <TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")}>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="logs" onClick={() => setActiveTab("logs")}>
                Logs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Badge variant="secondary">
                  Total Users: {users.length}
                </Badge>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Avatar</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={`https://avatar.api.dicebear.com/7.x/ лица/${user.email}.svg`} />
                            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          {user.firstName} {user.lastName}
                          {user.role === "admin" && (
                            <Badge className="ml-2" variant="outline">
                              Admin
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.subscription === "premium" ? (
                            <Badge variant="secondary">Premium</Badge>
                          ) : (
                            <Badge variant="default">Free</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(user.status)}`}
                            ></div>
                            {user.status}
                          </div>
                        </TableCell>
                        <TableCell>{getTimeAgo(user.lastActive)}</TableCell>
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
                              <DropdownMenuItem onClick={() => viewUserDetails(user)}>
                                <Users className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => deactivateUser(user.id)}>
                                  <UserX className="mr-2 h-4 w-4" /> Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => activateUser(user.id)}>
                                  <UserCheck className="mr-2 h-4 w-4" /> Activate
                                </DropdownMenuItem>
                              )}
                              {user.subscription === "free" ? (
                                <DropdownMenuItem onClick={() => upgradeUser(user.id)}>
                                  <Star className="mr-2 h-4 w-4" /> Upgrade to Premium
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => downgradeUser(user.id)}>
                                  <Clock className="mr-2 h-4 w-4" /> Downgrade to Free
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => promoteToAdmin(user.id)}>
                                <Shield className="mr-2 h-4 w-4" /> Make Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div>Analytics content</div>
            </TabsContent>
            <TabsContent value="logs">
              <div>Logs content</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Information about the selected user.
            </DialogDescription>
          </DialogHeader>
          {userDetails && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Avatar</Label>
                <Avatar className="col-span-3">
                  <AvatarImage src={`https://avatar.api.dicebear.com/7.x/ лица/${userDetails.email}.svg`} />
                  <AvatarFallback>{getInitials(userDetails.firstName, userDetails.lastName)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Full Name</Label>
                <div className="col-span-3">
                  {userDetails.firstName} {userDetails.lastName}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <div className="col-span-3">{userDetails.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Subscription</Label>
                <div className="col-span-3">
                  {userDetails.subscription === "premium" ? "Premium" : "Free"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">{userDetails.status}</div>
              </div>
              {/* Add more user details here */}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowUserDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

