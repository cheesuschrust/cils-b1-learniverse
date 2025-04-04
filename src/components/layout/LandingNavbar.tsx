
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import DesktopNavigation from "./DesktopNavigation";
import MobileMenu from "./MobileMenu";

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Determine if this is the landing page
  const isLandingPage = location.pathname === "/";
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full py-4 px-6 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <DesktopNavigation />
        <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} isLandingPage={isLandingPage} />
      </div>
    </header>
  );
};

export default LandingNavbar;
