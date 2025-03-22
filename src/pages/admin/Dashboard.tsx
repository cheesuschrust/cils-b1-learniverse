import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  joined: string;
  lastActive: string;
  completedTasks: number;
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const mockUsers: User[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      status: "active",
      joined: "2023-01-15",
      lastActive: "2023-06-04",
      completedTasks: 45,
    },
    {
      id: 2,
      name: "Emma Johnson",
      email: "emma.j@example.com",
      status: "active",
      joined: "2023-02-21",
      lastActive: "2023-06-01",
      completedTasks: 37,
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.b@example.com",
      status: "pending",
      joined: "2023-05-10",
      lastActive: "2023-05-10",
      completedTasks: 8,
    },
    {
      id: 4,
      name: "Sophia Davis",
      email: "sophia.d@example.com",
      status: "inactive",
      joined: "2023-03-15",
      lastActive: "2023-04-20",
      completedTasks: 22,
    },
    {
      id: 5,
      name: "William Wilson",
      email: "william.w@example.com",
      status: "active",
      joined: "2023-01-05",
      lastActive: "2023-06-03",
      completedTasks: 56,
    },
  ];
  
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  const activateUser = (userId: number) => {
    console.log(`Activating user with ID: ${userId}`);
    // API call would go here
  };
  
  const deactivateUser = (userId: number) => {
    console.log(`Deactivating user with ID: ${userId}`);
    // API call would go here
  };
  
  const deleteUser = (userId: number) => {
    console.log(`Deleting user with ID: ${userId}`);
    // API call would go here
  };
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8 animate-fade-in">
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
                placeholder="Search users..."
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
              <Button size="sm" className="flex items-center">
                Add User
              </Button>
            </div>
          </div>
          
          <Card className="backdrop-blur-sm border-accent/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(user.status)}
                          <span className="ml-2">{getStatusText(user.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.joined}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>{user.completedTasks}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {user.status !== "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => activateUser(user.id)}
                              className="h-8 w-8 p-0"
                            >
                              <UserCheck className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          {user.status !== "inactive" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deactivateUser(user.id)}
                              className="h-8 w-8 p-0"
                            >
                              <UserX className="h-4 w-4 text-amber-500" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteUser(user.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
                <CardDescription>All registered accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">145</div>
                <p className="text-xs text-green-500 mt-1">+12.5% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Users</CardTitle>
                <CardDescription>Users active in last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98</div>
                <p className="text-xs text-green-500 mt-1">+5.3% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completed Tasks</CardTitle>
                <CardDescription>Questions answered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,458</div>
                <p className="text-xs text-green-500 mt-1">+18.2% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="backdrop-blur-sm border-accent/20">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>
                User engagement over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">
                Charts and detailed statistics will be implemented here
              </p>
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
