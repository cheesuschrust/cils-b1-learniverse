
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { 
  UserCircle, 
  Settings, 
  LogOut, 
  User,
  CreditCard,
  HelpCircle,
  Bell
} from 'lucide-react';

const UserButton: React.FC = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };
  
  const isPremium = user?.isPremiumUser || false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <UserCircle className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="font-normal">
            <div className="font-medium">
              {user?.firstName || ''} {user?.lastName || ''}
            </div>
            <div className="text-xs text-muted-foreground overflow-hidden text-ellipsis">
              {user?.email || ''}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer flex w-full">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer flex w-full">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          
          {!isPremium && (
            <DropdownMenuItem asChild>
              <Link to="/subscription" className="cursor-pointer flex w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Upgrade to Premium</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link to="/notifications" className="cursor-pointer flex w-full">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/help" className="cursor-pointer flex w-full">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
