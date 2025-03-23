
import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2"
    >
      <div className="relative">
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-white to-red-500">
          CILS B1
        </span>
        <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-green-500 via-white to-red-500"></div>
      </div>
    </Link>
  );
};

export default Logo;
