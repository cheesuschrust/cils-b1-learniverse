
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Mail, MapPin, Phone, User } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }
  
  // If still loading, show a loading state
  if (isLoading) {
    return <div className="container py-8 flex justify-center">Loading profile...</div>;
  }
  
  if (!user) {
    return <div className="container py-8 flex justify-center">User data not available.</div>;
  }
  
  return (
    <div className="container max-w-4xl py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={user.avatarUrl || ""} alt={user.firstName} />
                <AvatarFallback className="text-lg">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <User className="mr-1 h-4 w-4 text-muted-foreground" />
                  @{user.username || (user.firstName + user.lastName).toLowerCase()}
                </CardDescription>
                {user.role && (
                  <Badge variant={user.role === "admin" ? "default" : "outline"} className="mt-2">
                    {user.role === "admin" ? "Administrator" : "Student"}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {user.email}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Joined</p>
                <p className="flex items-center">
                  <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
              
              {user.phone && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {user.phone}
                  </p>
                </div>
              )}
              
              {user.location && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {user.location}
                  </p>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-md font-medium mb-2">About</h3>
              <p className="text-sm text-muted-foreground">
                {user.bio || "No bio provided yet."}
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Learning Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">75%</p>
                  <p className="text-xs text-muted-foreground">Reading</p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">65%</p>
                  <p className="text-xs text-muted-foreground">Writing</p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">80%</p>
                  <p className="text-xs text-muted-foreground">Listening</p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">60%</p>
                  <p className="text-xs text-muted-foreground">Speaking</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
