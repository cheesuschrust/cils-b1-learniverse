
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, FileText, PenSquare, Settings, Calendar, Database, DollarSign, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    { title: "Active Users", value: "1,234", icon: <Users className="h-6 w-6" />, change: "+12%" },
    { title: "Questions", value: "3,456", icon: <BookOpen className="h-6 w-6" />, change: "+8%" },
    { title: "Content Items", value: "567", icon: <FileText className="h-6 w-6" />, change: "+5%" },
    { title: "Revenue", value: "€8,901", icon: <DollarSign className="h-6 w-6" />, change: "+19%" },
  ];

  const adminActions = [
    { title: "User Management", description: "Manage users, roles and permissions", icon: <Users className="h-8 w-8" />, href: "/admin/user-management" },
    { title: "Content Management", description: "Upload and manage learning content", icon: <FileText className="h-8 w-8" />, href: "/admin/content-uploader" },
    { title: "Content Analysis", description: "Analytics on content usage and performance", icon: <Activity className="h-8 w-8" />, href: "/admin/content-analysis" },
    { title: "AI Management", description: "Configure AI learning assistants", icon: <Settings className="h-8 w-8" />, href: "/admin/ai-management" },
    { title: "System Logs", description: "View system activity and logs", icon: <Database className="h-8 w-8" />, href: "/admin/system-logs" },
    { title: "Exam Scheduling", description: "Configure exam dates and settings", icon: <Calendar className="h-8 w-8" />, href: "/admin/exam-scheduling" },
    { title: "Revenue Reports", description: "Review financial data and reports", icon: <DollarSign className="h-8 w-8" />, href: "/admin/revenue" },
    { title: "Content Editor", description: "Create and edit learning materials", icon: <PenSquare className="h-8 w-8" />, href: "/admin/content-editor" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your CILS B1 learning platform
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                {React.cloneElement(stat.icon, { 
                  className: "h-4 w-4 text-primary" 
                })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className={stat.change.startsWith('+') ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold">Quick Actions</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminActions.map((action, i) => (
          <Link to={action.href} key={i}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="p-2 w-fit bg-primary/10 rounded-lg">
                  {React.cloneElement(action.icon, { 
                    className: "h-6 w-6 text-primary" 
                  })}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full justify-start p-0">
                  Access
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      {[
                        "New user registered",
                        "Content updated",
                        "User upgraded to premium",
                        "New question added",
                        "System backup completed",
                      ][i]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Date.now() - i * 3600000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    <p className="text-sm">
                      {[
                        "Review 5 content submissions",
                        "Process 3 refund requests",
                        "Update exam schedule",
                      ][i]}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {["Review", "Process", "Update"][i]}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
