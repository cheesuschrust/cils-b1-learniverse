
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Book,
  CheckSquare,
  Headphones,
  Pen,
  Menu,
  X,
  LogOut,
  Mic,
  UserCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const mainLinks: NavItem[] = [
    {
      name: "Flashcards",
      href: "/flashcards",
      icon: <Book className="w-5 h-5 mr-2" />,
    },
    {
      name: "Multiple Choice",
      href: "/multiple-choice",
      icon: <CheckSquare className="w-5 h-5 mr-2" />,
    },
    {
      name: "Listening",
      href: "/listening",
      icon: <Headphones className="w-5 h-5 mr-2" />,
    },
    {
      name: "Writing",
      href: "/writing",
      icon: <Pen className="w-5 h-5 mr-2" />,
    },
    {
      name: "Speaking",
      href: "/speaking",
      icon: <Mic className="w-5 h-5 mr-2" />,
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full py-4 px-6 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-italian-green via-italian-white to-italian-red">
            CILS B1
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <div className="flex items-center space-x-6">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="flex w-full items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard" className="flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-primary" />
          ) : (
            <Menu className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 p-4 glass shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4 p-4">
            {isAuthenticated && (
              <>
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "flex items-center text-sm font-medium p-2 rounded-md transition-colors",
                      location.pathname === link.href
                        ? "bg-secondary text-primary"
                        : "text-foreground hover:bg-secondary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center text-sm font-medium p-2 rounded-md transition-colors",
                    location.pathname === "/dashboard"
                      ? "bg-secondary text-primary"
                      : "text-foreground hover:bg-secondary"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  <span>Dashboard</span>
                </Link>
                
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className={cn(
                      "flex items-center text-sm font-medium p-2 rounded-md transition-colors",
                      location.pathname.startsWith("/admin")
                        ? "bg-secondary text-primary"
                        : "text-foreground hover:bg-secondary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start text-sm w-full"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
