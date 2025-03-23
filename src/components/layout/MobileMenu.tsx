
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu = ({ isMenuOpen, toggleMenu }: MobileMenuProps) => {
  return (
    <>
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

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 p-4 glass shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              to="/"
              className="flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-secondary"
              onClick={() => toggleMenu()}
            >
              Home
            </Link>
            <Link
              to="#features"
              className="flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-secondary"
              onClick={() => toggleMenu()}
            >
              Features
            </Link>
            <Link
              to="#how-it-works"
              className="flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-secondary"
              onClick={() => toggleMenu()}
            >
              How It Works
            </Link>
            <Link
              to="#testimonials"
              className="flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-secondary"
              onClick={() => toggleMenu()}
            >
              Testimonials
            </Link>
            
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Link to="/login" onClick={() => toggleMenu()}>
                <Button variant="ghost" className="w-full justify-start">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => toggleMenu()}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
