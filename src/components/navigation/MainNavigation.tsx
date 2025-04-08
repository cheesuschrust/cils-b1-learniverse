
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  Book,
  Headphones,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

const MainNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <Link to="/" className="flex items-center mr-6">
          <span className="text-xl font-bold text-primary">CILS Prep</span>
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList>
            {user && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Practice</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/flashcards"
                            className={cn(
                              "flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md",
                              location.pathname === "/flashcards" ? "bg-accent" : ""
                            )}
                          >
                            <Book className="h-6 w-6 mb-2" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Flashcards
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Practice vocabulary with spaced repetition
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/practice/reading"
                            className={cn(
                              "flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md",
                              location.pathname === "/practice/reading" ? "bg-accent" : ""
                            )}
                          >
                            <Book className="h-6 w-6 mb-2" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Reading
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Practice reading comprehension
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/practice/listening"
                            className={cn(
                              "flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md",
                              location.pathname === "/practice/listening" ? "bg-accent" : ""
                            )}
                          >
                            <Headphones className="h-6 w-6 mb-2" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Listening
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Practice listening comprehension
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/practice/speaking"
                            className={cn(
                              "flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md",
                              location.pathname === "/practice/speaking" ? "bg-accent" : ""
                            )}
                          >
                            <MessageSquare className="h-6 w-6 mb-2" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Speaking
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Practice speaking and pronunciation
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/resources/grammar"
                            className="flex select-none items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                          >
                            <Book className="mr-2 h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">Grammar Guide</div>
                              <p className="line-clamp-1 text-sm text-muted-foreground">
                                Comprehensive Italian grammar rules and examples
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/resources/vocabulary"
                            className="flex select-none items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                          >
                            <Book className="mr-2 h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">Vocabulary Lists</div>
                              <p className="line-clamp-1 text-sm text-muted-foreground">
                                Essential vocabulary for the CILS exam
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/resources/exam-info"
                            className="flex select-none items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                          >
                            <Award className="mr-2 h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">CILS Exam Info</div>
                              <p className="line-clamp-1 text-sm text-muted-foreground">
                                Information about the exam structure and requirements
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </>
            )}
            
            <NavigationMenuItem>
              <Link to="/about">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div className="flex items-center space-x-2">
        {user ? (
          <>
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MainNavigation;
