
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { ExternalLink, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Daily practice to prepare for your Italian citizenship test
            </p>
            <div className="flex space-x-1">
              <div className="w-6 h-4 bg-[#26B887] rounded-sm"></div>
              <div className="w-6 h-4 bg-[#FF6978] rounded-sm"></div>
              <div className="w-6 h-4 bg-[#33A5EF] rounded-sm"></div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-gray-800">Study Tools</h3>
            <ul className="space-y-3">
              <li><Link to="/app/flashcards" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors flex items-center"><span>Flashcards</span></Link></li>
              <li><Link to="/app/multiple-choice" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors flex items-center"><span>Multiple Choice</span></Link></li>
              <li><Link to="/app/listening" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors flex items-center"><span>Listening Practice</span></Link></li>
              <li><Link to="/app/writing" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors flex items-center"><span>Writing Practice</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-gray-800">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors">Login</Link></li>
              <li><Link to="/signup" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors">Sign Up</Link></li>
              <li><Link to="/app/dashboard" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-gray-800">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/resources/citizenship" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors group flex items-center">
                <span>Official Citizenship Info</span>
                <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link></li>
              <li><Link to="/resources/certification" className="text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors group flex items-center">
                <span>CILS Certification</span>
                <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© {currentYear} CILS B1 Cittadinanza. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-[#33A5EF] hover:underline transition-colors">Terms of Service</Link>
            <span className="text-sm text-gray-600 flex items-center">Made with <Heart className="h-3 w-3 mx-1 text-[#FF6978]" /> in Italy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
