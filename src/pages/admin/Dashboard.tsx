
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  UserCheck, 
  UserX, 
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  FileUp,
  Upload,
  CreditCard,
  Tag,
  Info,
  UserPlus,
  Calendar,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subscription: "free" as "free" | "premium",
  });
  
  const { getAllUsers, updateUserStatus, updateUserSubscription, addAdmin, addSystemLog } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<Array<any>>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };
  
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "inactive":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending":
        return "Pending";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };
  
  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "premium":
        return <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">Premium</Badge>;
      case "free":
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const activateUser = async (userId: string) => {
    await updateUserStatus(userId, "active");
    loadUsers();
    toast({
      title: "User Activated",
      description: "User has been successfully activated",
    });
  };
  
  const deactivateUser = async (userId: string) => {
    await updateUserStatus(userId, "inactive");
    loadUsers();
    toast({
      title: "User Deactivated",
      description: "User has been successfully deactivated",
    });
  };
  
  const upgradeUser = async (userId: string) => {
    await updateUserSubscription(userId, "premium");
    loadUsers();
    toast({
      title: "Subscription Updated",
      description: "User has been upgraded to Premium",
    });
  };
  
  const downgradeUser = async (userId: string) => {
    await updateUserSubscription(userId, "free");
    loadUsers();
    toast({
      title: "Subscription Updated",
      description: "User has been downgraded to Free",
    });
  };
  
  const viewUserDetails = (user: any) => {
    setUserDetails(user);
    setIsUserDetailsOpen(true);
  };
  
  const handleAddUser = async () => {
    try {
      await addAdmin(
        newUserData.email,
        newUserData.firstName,
        newUserData.lastName,
        newUserData.password
      );
      
      setNewUserData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        subscription: "free"
      });
      
      setIsAddUserOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUserStatusChange = async (userId: string, newStatus: string) => {
    const success = await updateUserStatus(userId, newStatus);
    if (success) {
      const targetUser = users.find(u => u.id === userId);
      if (targetUser) {
        // Fix: Call addSystemLog with the correct parameters
        addSystemLog('user', `User status updated to ${newStatus}`, `Updated user status to ${newStatus} for ${targetUser.email}`);
      }
      setUsers(getAllUsers());
    }
  };
  
  const handleUserSubscriptionChange = async (userId: string, newSubscription: string) => {
    await updateUserSubscription(userId, newSubscription);
    loadUsers();
    toast({
      title: "Subscription Updated",
      description: `User has been upgraded to ${newSubscription}`,
    });
  };
  
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === "active").length;
  const premiumUsers = users.filter(user => user.subscription === "premium").length;
  const totalQuestions = users.reduce((sum, user) => sum + user.metrics.totalQuestions, 0);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = users.filter(user => new Date(user.createdAt) >= thirtyDaysAgo).length;
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users, view statistics, and control content
          </p>
        </div>
        
        <Link to="/admin/content-uploader">
          <Button className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Content Uploader
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="users" className="animate-fade-up">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
              <Input
                placeholder="Search users by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <FileUp className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Administrator</DialogTitle>
                    <DialogDescription>
                      Create a new admin account with full system access.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          value={newUserData.firstName}
                          onChange={handleNewUserChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          value={newUserData.lastName}
                          onChange={handleNewUserChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={newUserData.email}
                        onChange={handleNewUserChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        value={newUserData.password}
                        onChange={handleNewUserChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddUser}>Add Admin</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card className="backdrop-blur-sm border-accent/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(user.status)}
                          <span className="ml-2">{getStatusText(user.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSubscriptionBadge(user.subscription)}
                      </TableCell>
                      <TableCell>{formatDate(user.created)}</TableCell>
                      <TableCell>{formatDate(user.lastActive)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => viewUserDetails(user)}
                                >
                                  <Info className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {user.status !== "active" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => activateUser(user.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <UserCheck className="h-4 w-4 text-green-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Activate User</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          
                          {user.status !== "inactive" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deactivateUser(user.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <UserX className="h-4 w-4 text-amber-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Deactivate User</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          
                          {user.subscription === "free" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => upgradeUser(user.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <CreditCard className="h-4 w-4 text-purple-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Upgrade to Premium</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          
                          {user.subscription === "premium" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => downgradeUser(user.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Tag className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Downgrade to Free</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
            {userDetails && (
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>User Details</DialogTitle>
                  <DialogDescription>
                    Complete information about {userDetails.firstName} {userDetails.lastName}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Basic Information</h3>
                      <div className="rounded-md bg-accent/30 p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <span className="text-sm font-medium">{userDetails.firstName} {userDetails.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Username:</span>
                          <span className="text-sm font-medium">{userDetails.username || "Not set"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm font-medium">{userDetails.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Phone:</span>
                          <span className="text-sm font-medium">{userDetails.phoneNumber || "Not set"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Address:</span>
                          <span className="text-sm font-medium">{userDetails.address || "Not set"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Account Details</h3>
                      <div className="rounded-md bg-accent/30 p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <div className="flex items-center">
                            {getStatusIcon(userDetails.status)}
                            <span className="ml-2 text-sm font-medium">{getStatusText(userDetails.status)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Role:</span>
                          <Badge variant={userDetails.role === "admin" ? "default" : "outline"}>
                            {userDetails.role}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Subscription:</span>
                          {getSubscriptionBadge(userDetails.subscription)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Joined:</span>
                          <span className="text-sm font-medium">{formatDate(userDetails.created)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Last Active:</span>
                          <span className="text-sm font-medium">{formatDate(userDetails.lastActive)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Daily Question Usage</h3>
                      <div className="rounded-md bg-accent/30 p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Flashcards:</span>
                          <Badge variant="outline">{userDetails.dailyQuestionCounts?.flashcards || 0}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Multiple Choice:</span>
                          <Badge variant="outline">{userDetails.dailyQuestionCounts?.multipleChoice || 0}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Listening:</span>
                          <Badge variant="outline">{userDetails.dailyQuestionCounts?.listening || 0}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Writing:</span>
                          <Badge variant="outline">{userDetails.dailyQuestionCounts?.writing || 0}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Speaking:</span>
                          <Badge variant="outline">{userDetails.dailyQuestionCounts?.speaking || 0}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Performance Metrics</h3>
                      <div className="rounded-md bg-accent/30 p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Questions:</span>
                          <span className="text-sm font-medium">{userDetails.metrics?.totalQuestions || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Correct Answers:</span>
                          <span className="text-sm font-medium">{userDetails.metrics?.correctAnswers || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Streak:</span>
                          <span className="text-sm font-medium">{userDetails.metrics?.streak || 0} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Time Spent:</span>
                          <span className="text-sm font-medium">{userDetails.metrics?.totalTimeSpent || 0} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Accuracy Rate:</span>
                          <span className="text-sm font-medium">
                            {userDetails.metrics?.totalQuestions > 0 
                              ? Math.round((userDetails.metrics?.correctAnswers / userDetails.metrics?.totalQuestions) * 100) 
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {userDetails.status !== "active" ? (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {
                            activateUser(userDetails.id);
                            setIsUserDetailsOpen(false);
                          }}
                          className="flex-1"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Activate User
                        </Button>
                      ) : (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            deactivateUser(userDetails.id);
                            setIsUserDetailsOpen(false);
                          }}
                          className="flex-1"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Deactivate User
                        </Button>
                      )}
                      
                      {userDetails.subscription === "free" ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            upgradeUser(userDetails.id);
                            setIsUserDetailsOpen(false);
                          }}
                          className="flex-1"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            downgradeUser(userDetails.id);
                            setIsUserDetailsOpen(false);
                          }}
                          className="flex-1"
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Downgrade to Free
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
                <CardDescription>All registered accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalUsers}</div>
                <p className="text-xs text-green-500 mt-1">+{newUsers} new in the last 30 days</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Users</CardTitle>
                <CardDescription>Users with active status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeUsers}</div>
                <p className="text-xs text-green-500 mt-1">{Math.round((activeUsers / totalUsers) * 100)}% of total users</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Premium Users</CardTitle>
                <CardDescription>Subscribers with paid plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{premiumUsers}</div>
                <p className="text-xs text-amber-500 mt-1">{Math.round((premiumUsers / totalUsers) * 100)}% conversion rate</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>
                  Login frequency and engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Total questions answered: {totalQuestions}
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Avg. {totalUsers > 0 ? Math.round(totalQuestions / totalUsers) : 0} questions per user
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle>Subscription Metrics</CardTitle>
                <CardDescription>
                  Revenue and subscription patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Premium conversion: {Math.round((premiumUsers / totalUsers) * 100)}%
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Estimated monthly revenue: ${premiumUsers * 9.99}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="backdrop-blur-sm border-accent/20">
            <CardHeader>
              <CardTitle>User Growth Over Time</CardTitle>
              <CardDescription>
                New user registrations by month
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {newUsers} new users in the last 30 days
                </p>
                <p className="text-muted-foreground mt-2">
                  User retention rate: {activeUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="backdrop-blur-sm border-accent/20">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Manage application settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Content Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="daily-questions" className="text-sm font-medium">
                          Daily Questions Limit (Free Users)
                        </label>
                        <Input
                          id="daily-questions"
                          type="number"
                          defaultValue="1"
                          min="1"
                          max="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="premium-questions" className="text-sm font-medium">
                          Daily Questions Limit (Premium Users)
                        </label>
                        <Input
                          id="premium-questions"
                          type="number"
                          defaultValue="Unlimited"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Language Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="default-language" className="text-sm font-medium">
                          Default Interface Language
                        </label>
                        <select
                          id="default-language"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="en">English</option>
                          <option value="it">Italian</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="ai-language" className="text-sm font-medium">
                          AI Feedback Language
                        </label>
                        <select
                          id="ai-language"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="both">Both (English & Italian)</option>
                          <option value="en">English Only</option>
                          <option value="it">Italian Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Administrator Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="admin-emails" className="text-sm font-medium">
                          Admin Notification Emails
                        </label>
                        <Input
                          id="admin-emails"
                          type="text"
                          placeholder="admin@example.com, admin2@example.com"
                        />
                        <p className="text-xs text-muted-foreground">
                          Comma-separated list of email addresses to receive system notifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
