
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">CILS B1 Prep</span>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
                Dashboard
              </Link>
              <Link to="/gamification" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
                Gamification
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div>
                <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://via.placeholder.com/150"
                    alt="User"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
