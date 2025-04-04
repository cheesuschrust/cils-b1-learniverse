
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MarketingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
      isScrolled 
        ? "bg-white/90 backdrop-blur-md shadow-sm py-3" 
        : "bg-transparent py-5"
    )}>
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-bold text-2xl">CILS<span className="text-primary">Prep</span></span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link 
                    to="/features"
                    className={location.pathname === '/features' ? 'text-primary' : ''}
                  >
                    Features
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                    <li className="col-span-2">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/about"
                          className="flex items-center justify-between p-2 w-full hover:bg-accent rounded-md"
                        >
                          <div>
                            <div className="text-sm font-medium mb-1">About Us</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Learn about our mission and team
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/support-center"
                          className="block p-2 hover:bg-accent rounded-md"
                        >
                          <div className="text-sm font-medium mb-1">Help Center</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Guides and support resources
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="https://www.unistrasi.it/1/558/4986/Le_certificazioni_CILS.htm"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 hover:bg-accent rounded-md"
                        >
                          <div className="text-sm font-medium mb-1">CILS Exam Info</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Official CILS examination details
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink 
                  asChild 
                  className={navigationMenuTriggerStyle()}
                >
                  <Link 
                    to="/pricing"
                    className={location.pathname === '/pricing' ? 'text-primary' : ''}
                  >
                    Pricing
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Call to Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[385px]">
            <div className="py-6 px-4">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="font-bold text-2xl">CILS<span className="text-primary">Prep</span></span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/features" 
                  className="py-2 px-4 hover:bg-muted rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/about" 
                  className="py-2 px-4 hover:bg-muted rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  to="/support-center" 
                  className="py-2 px-4 hover:bg-muted rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Help Center
                </Link>
                <Link 
                  to="/pricing" 
                  className="py-2 px-4 hover:bg-muted rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="pt-6 flex flex-col space-y-3">
                  {isAuthenticated ? (
                    <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link to="/auth/login">Log In</Link>
                      </Button>
                      <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link to="/auth/register">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MarketingNavbar;
