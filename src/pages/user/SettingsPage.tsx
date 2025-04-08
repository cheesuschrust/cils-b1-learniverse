
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfileSettings from '@/components/user/UserProfileSettings';
import { User, Settings, Shield, CreditCard, Bell, Languages } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <>
      <Helmet>
        <title>Account Settings | Italian Language Learning</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="sticky top-20">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <nav className="space-y-1">
                <SettingsNavItem 
                  icon={<User className="h-4 w-4" />} 
                  label="Profile" 
                  active={activeTab === 'profile'} 
                  onClick={() => setActiveTab('profile')}
                />
                <SettingsNavItem 
                  icon={<Settings className="h-4 w-4" />} 
                  label="Preferences" 
                  active={activeTab === 'preferences'} 
                  onClick={() => setActiveTab('preferences')}
                />
                <SettingsNavItem 
                  icon={<Bell className="h-4 w-4" />} 
                  label="Notifications" 
                  active={activeTab === 'notifications'} 
                  onClick={() => setActiveTab('notifications')}
                />
                <SettingsNavItem 
                  icon={<Shield className="h-4 w-4" />} 
                  label="Privacy & Security" 
                  active={activeTab === 'security'} 
                  onClick={() => setActiveTab('security')}
                />
                <SettingsNavItem 
                  icon={<CreditCard className="h-4 w-4" />} 
                  label="Subscription" 
                  active={activeTab === 'subscription'} 
                  onClick={() => setActiveTab('subscription')}
                />
                <SettingsNavItem 
                  icon={<Languages className="h-4 w-4" />} 
                  label="Language" 
                  active={activeTab === 'language'} 
                  onClick={() => setActiveTab('language')}
                />
              </nav>
            </div>
          </div>
          
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="profile">
                <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
                <UserProfileSettings />
              </TabsContent>
              
              <TabsContent value="preferences">
                <h1 className="text-3xl font-bold mb-6">Preferences</h1>
                <p className="text-muted-foreground">
                  Customize your learning experience with these preferences.
                </p>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Preferences settings will be implemented soon.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>
                <p className="text-muted-foreground">
                  Control what notifications you receive and how you receive them.
                </p>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Notification settings will be implemented soon.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="security">
                <h1 className="text-3xl font-bold mb-6">Privacy & Security</h1>
                <p className="text-muted-foreground">
                  Manage your account security and privacy settings.
                </p>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Privacy & security settings will be implemented soon.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="subscription">
                <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
                <p className="text-muted-foreground">
                  View and manage your subscription details.
                </p>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Subscription management will be implemented soon.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="language">
                <h1 className="text-3xl font-bold mb-6">Language Settings</h1>
                <p className="text-muted-foreground">
                  Set your preferred application language and content language preferences.
                </p>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Language settings will be implemented soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

const SettingsNavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
        active
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};

export default SettingsPage;
