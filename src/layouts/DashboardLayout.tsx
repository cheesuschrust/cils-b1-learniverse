
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  Headphones, 
  Mic, 
  Pen
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // If not logged in, redirect to login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md rounded-lg border bg-card shadow-sm p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-center">Access Denied</h1>
          <p className="text-center text-muted-foreground">
            You need to log in to access the dashboard.
          </p>
          <div className="flex justify-center">
            <Button asChild variant="default">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card hidden md:block">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold">Italian Learning</Link>
        </div>
        
        <nav className="px-4 py-6 space-y-1">
          <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link to="/profile" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
          <Link to="/settings" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
          
          <div className="pt-4 pb-2">
            <div className="px-3 text-xs font-semibold text-muted-foreground">Learning</div>
          </div>
          
          <Link to="/flashcards" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
            <BookOpen className="mr-2 h-4 w-4" />
            Flashcards
          </Link>
          <Link to="/practice/reading" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
            <BookOpen className="mr-2 h-4 w-4" />
            Reading
          </Link>
          <Link to="/practice/listening" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
            <Headphones className="mr-2 h-4 w-4" />
            Listening
          </Link>
          <Link to="/practice/speaking" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
            <Mic className="mr-2 h-4 w-4" />
            Speaking
          </Link>
          <Link to="/practice/writing" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent">
            <Pen className="mr-2 h-4 w-4" />
            Writing
          </Link>
          
          <div className="pt-6">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm px-3" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="border-b md:border-0 py-4 px-6 md:hidden">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Italian Learning</Link>
            {/* Mobile menu button would go here */}
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
