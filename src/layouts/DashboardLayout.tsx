
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ListChecks,
  PenTool,
  Mic,
  Headphones,
  LineChart,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  User,
  Brain,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { getContextualSuggestions } from '@/utils/AIIntegrationUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import HelpDocumentation from '@/components/help/HelpDocumentation';

interface DashboardLayoutProps {
  suggestions?: string[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ suggestions = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSuggestions, setSuggestions] = useState<string[]>(suggestions);
  const { isAIEnabled } = useAIUtils();
  
  const getCurrentPage = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path;
  };
  
  useEffect(() => {
    if (isAIEnabled && user) {
      const currentPage = getCurrentPage();
      
      const userActivity = {
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        streak: 3,
        dueCards: 12,
        hasUsedSpacedRepetition: false,
        questionAttempts: 15
      };
      
      const userPreferences = {
        preferredVoice: 'natural'
      };
      
      const pageSuggestions = getContextualSuggestions(
        currentPage,
        userActivity,
        userPreferences
      );
      
      setSuggestions(pageSuggestions);
    }
  }, [location.pathname, isAIEnabled, user]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Flashcards', path: '/flashcards', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Multiple Choice', path: '/multiple-choice', icon: <ListChecks className="h-5 w-5" /> },
    { name: 'Writing', path: '/writing', icon: <PenTool className="h-5 w-5" /> },
    { name: 'Speaking', path: '/speaking', icon: <Mic className="h-5 w-5" /> },
    { name: 'Listening', path: '/listening', icon: <Headphones className="h-5 w-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <LineChart className="h-5 w-5" /> },
    { name: 'Achievements', path: '/achievements', icon: <Award className="h-5 w-5" /> },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <Brain className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden">
      <div className="md:hidden border-b p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">Lingua</span>Learn
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col border-r w-64 h-full overflow-hidden bg-background">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Lingua</span>Learn
          </Link>
        </div>
        
        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/settings"
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            
            <ThemeToggle />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">
                {user?.displayName || 'User'}
              </div>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-8 w-8"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </aside>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            
            <motion.nav
              className="relative w-3/4 max-w-xs h-full overflow-y-auto bg-background p-4 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                  <span className="text-primary">Lingua</span>Learn
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 p-4 border rounded-lg mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user?.displayName || 'User'}</div>
                  <Link to="/profile" className="text-sm text-muted-foreground">
                    View Profile
                  </Link>
                </div>
              </div>
              
              <div className="space-y-1 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t space-y-3">
                <Link
                  to="/settings"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-background">
        <AnimatePresence>
          {isAIEnabled && localSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 p-3"
            >
              <div className="container mx-auto flex items-center gap-3">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {localSuggestions[0]}
                </div>
                {localSuggestions.length > 1 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-blue-600 dark:text-blue-400 ml-auto"
                        >
                          +{localSuggestions.length - 1} more
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-64">
                        <div className="space-y-2">
                          {localSuggestions.slice(1).map((suggestion, index) => (
                            <p key={index} className="text-sm">{suggestion}</p>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
      
      {/* User profile shortcut */}
      <div className="hidden md:block border-l w-16 overflow-hidden bg-background">
        <div className="h-full flex flex-col items-center py-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/profile">
                  <Avatar className="h-10 w-10 mb-6">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{user?.displayName || 'Your Profile'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <HelpDocumentation defaultTopic={getCurrentPage()} />
    </div>
  );
};

export default DashboardLayout;
