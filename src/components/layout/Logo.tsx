
import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2"
    >
      <div className="relative">
        <span className="font-bold text-xl tracking-tight">
          <span className="text-[#26B887]">CILS</span>
          <span className="text-[#FF6978]">B1</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
