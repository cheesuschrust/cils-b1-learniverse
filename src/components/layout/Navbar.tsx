
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Book,
  CheckSquare,
  Headphones,
  Pen,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if user is logged in
  useEffect(() => {
    // This will be replaced with actual auth check
    const userToken = localStorage.getItem("userToken");
    setIsLoggedIn(!!userToken);
  }, []);

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
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    // Redirect to home
    window.location.href = "/";
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
          {isLoggedIn && (
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
              
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === "/dashboard"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <User className="w-5 h-5 mr-2" />
                <span>Dashboard</span>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
          
          {!isLoggedIn && (
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
            {isLoggedIn && (
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
                  <User className="w-5 h-5 mr-2" />
                  <span>Dashboard</span>
                </Link>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start text-sm w-full"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            
            {!isLoggedIn && (
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
