
import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2"
    >
      <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-italian-green via-italian-white to-italian-red">
        CILS B1
      </span>
    </Link>
  );
};

export default Logo;
