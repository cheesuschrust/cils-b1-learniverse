
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon } from "lucide-react";
import UserPreferences from "@/components/user/UserPreferences";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("preferences");
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>You must be logged in to access settings</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const isAdmin = user.role === "admin";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <SettingsIcon className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          {isAdmin && <TabsTrigger value="account">Account Management</TabsTrigger>}
          {isAdmin && <TabsTrigger value="system">System Configuration</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="preferences">
          <UserPreferences />
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Administrator tools to manage user accounts will be displayed here.</p>
              <div className="mt-4 p-4 border rounded-md bg-amber-50 border-amber-200">
                <p className="text-amber-700">This section is under development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure system-wide settings and features</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Administrator tools to configure the system will be displayed here.</p>
              <div className="mt-4 p-4 border rounded-md bg-amber-50 border-amber-200">
                <p className="text-amber-700">This section is under development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
