
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isLandingPage?: boolean;
}

const MobileMenu = ({ isMenuOpen, toggleMenu, isLandingPage = false }: MobileMenuProps) => {
  const { user } = useAuth();
  
  return (
    <div className="md:hidden">
      <Sheet open={isMenuOpen} onOpenChange={toggleMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="font-bold text-xl">Menu</span>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="flex flex-col space-y-4 mt-6">
              <Link 
                to="/" 
                className="text-base font-medium py-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              
              {isLandingPage && (
                <>
                  <a 
                    href="#features" 
                    className="text-base font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Features
                  </a>
                  <a 
                    href="#how-it-works" 
                    className="text-base font-medium py-2"
                    onClick={toggleMenu}
                  >
                    How It Works
                  </a>
                  <a 
                    href="#testimonials" 
                    className="text-base font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Testimonials
                  </a>
                </>
              )}
              
              {!isLandingPage && (
                <>
                  <Link 
                    to="/app/flashcards" 
                    className="text-base font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Flashcards
                  </Link>
                  <Link 
                    to="/app/multiple-choice" 
                    className="text-base font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Multiple Choice
                  </Link>
                  <Link 
                    to="/app/writing" 
                    className="text-base font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Writing
                  </Link>
                </>
              )}
              
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <>
                    <Link 
                      to="/app/profile" 
                      className="block w-full" 
                      onClick={toggleMenu}
                    >
                      <Button className="w-full">My Profile</Button>
                    </Link>
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                      >
                        Log Out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block w-full" 
                      onClick={toggleMenu}
                    >
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <div className="mt-2">
                      <Link 
                        to="/signup" 
                        className="block w-full" 
                        onClick={toggleMenu}
                      >
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
