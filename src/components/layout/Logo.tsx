
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 transition-transform hover:scale-105"
    >
      <div className="bg-gradient-to-r from-[#009246] via-[#ffffff] to-[#ce2b37] p-2 rounded-lg text-white shadow-md">
        <BookOpen className="h-5 w-5" />
      </div>
      <div className="relative">
        <span className="font-bold text-xl tracking-tight flex items-center">
          <span className="text-[#009246] drop-shadow-sm">CILS</span>
          <span className="text-[#ce2b37] drop-shadow-sm">B1</span>
          <span className="text-gray-800 text-sm ml-1 font-medium">Cittadinanza</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
