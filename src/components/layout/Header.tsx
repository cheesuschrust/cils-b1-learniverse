
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  LogOut, 
  User, 
  Settings, 
  BookOpen, 
  Brain, 
  BarChart, 
  Moon, 
  Sun, 
  Languages, 
  UserCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils';

const navigationLinks = [
  {
    label: "Learn",
    icon: <Brain className="h-4 w-4 mr-1" />,
    items: [
      { 
        title: "Flashcards",
        href: "/activities/flashcards",
        description: "Learn vocabulary with flashcards"
      },
      { 
        title: "Multiple Choice",
        href: "/activities/multiple-choice",
        description: "Test your knowledge with quizzes"
      },
      { 
        title: "Reading",
        href: "/activities/reading",
        description: "Improve your reading comprehension"
      },
      { 
        title: "Writing",
        href: "/activities/writing",
        description: "Practice writing in Italian"
      },
      { 
        title: "Speaking",
        href: "/activities/speaking",
        description: "Improve your pronunciation"
      },
      { 
        title: "Listening",
        href: "/activities/listening",
        description: "Train your listening skills"
      }
    ]
  },
  {
    label: "Resources",
    icon: <BookOpen className="h-4 w-4 mr-1" />,
    items: [
      { 
        title: "Grammar Guide",
        href: "/resources/grammar",
        description: "Italian grammar explanations"
      },
      { 
        title: "Vocabulary Lists",
        href: "/resources/vocabulary",
        description: "Common Italian words and phrases"
      },
      { 
        title: "Cultural Notes",
        href: "/resources/culture",
        description: "Italian culture and traditions"
      }
    ]
  },
  {
    label: "Progress",
    icon: <BarChart className="h-4 w-4 mr-1" />,
    items: [
      { 
        title: "Stats Dashboard",
        href: "/progress/stats",
        description: "Your learning statistics"
      },
      { 
        title: "Achievements",
        href: "/progress/achievements",
        description: "Milestones and badges"
      },
      { 
        title: "Learning Path",
        href: "/progress/path",
        description: "Your personalized curriculum"
      }
    ]
  }
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <Languages className="h-6 w-6" />
            <span className="font-bold text-xl">LinguaLearn</span>
          </Link>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationLinks.map((navItem) => (
                <NavigationMenuItem key={navItem.label}>
                  <NavigationMenuTrigger className="h-9 px-4">
                    <span className="flex items-center">
                      {navItem.icon}
                      {navItem.label}
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                      {navItem.items.map((item) => (
                        <li key={item.title} className="row-span-1">
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <Languages className="h-6 w-6" />
                <span className="font-bold text-xl">LinguaLearn</span>
              </Link>
              
              <div className="grid gap-4">
                {navigationLinks.map((section) => (
                  <div key={section.label} className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      {section.icon}
                      <span className="ml-1">{section.label}</span>
                    </h4>
                    <div className="grid gap-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="py-2 px-3 text-sm rounded-md hover:bg-accent transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </Button>
                
                {user ? (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                ) : (
                  <Button 
                    variant="default"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* User Options */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImage} alt={user.displayName || user.email} />
                    <AvatarFallback className="bg-primary/10">
                      {getInitials(user.displayName || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard" className="cursor-pointer flex w-full">
                      <BarChart className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2 hidden sm:block">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
