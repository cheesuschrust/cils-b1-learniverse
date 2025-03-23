
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Daily practice to prepare for your Italian citizenship test
            </p>
            <div className="flex">
              <div className="w-6 h-4 bg-[#26B887]"></div>
              <div className="w-6 h-4 bg-[#FF6978]"></div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Study</h3>
            <ul className="space-y-3">
              <li><Link to="/app/flashcards" className="text-gray-600 hover:text-gray-900 hover:underline">Flashcards</Link></li>
              <li><Link to="/app/multiple-choice" className="text-gray-600 hover:text-gray-900 hover:underline">Multiple Choice</Link></li>
              <li><Link to="/app/listening" className="text-gray-600 hover:text-gray-900 hover:underline">Listening Practice</Link></li>
              <li><Link to="/app/writing" className="text-gray-600 hover:text-gray-900 hover:underline">Writing Practice</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-gray-600 hover:text-gray-900 hover:underline">Login</Link></li>
              <li><Link to="/signup" className="text-gray-600 hover:text-gray-900 hover:underline">Sign Up</Link></li>
              <li><Link to="/app/dashboard" className="text-gray-600 hover:text-gray-900 hover:underline">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/resources/citizenship" className="text-gray-600 hover:text-gray-900 hover:underline">Official Citizenship Info</Link></li>
              <li><Link to="/resources/certification" className="text-gray-600 hover:text-gray-900 hover:underline">CILS Certification</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© {currentYear} CILS B1 Cittadinanza. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
