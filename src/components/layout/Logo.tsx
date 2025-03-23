
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 transition-transform hover:scale-105"
    >
      <div className="bg-gradient-to-r from-[#26B887] to-[#33A5EF] p-2 rounded-lg text-white">
        <BookOpen className="h-5 w-5" />
      </div>
      <div className="relative">
        <span className="font-bold text-xl tracking-tight">
          <span className="text-[#26B887]">CILS</span>
          <span className="text-[#FF6978]">B1</span>
          <span className="text-gray-700 text-sm ml-1">Cittadinanza</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
