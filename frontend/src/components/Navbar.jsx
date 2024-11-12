import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { useStytch } from "@stytch/react";

const NavItem = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-3 py-2 transition-colors duration-300 group ${
        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      {children}
      <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}></span>
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const stytch = useStytch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await stytch.session.revoke();
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', to: '/home' },
    { name: 'Chat', to: '/chat' },
    { name: 'Profile', to: '/profile' },
  ];

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link 
                to="/home" 
                className="text-2xl font-bold text-blue-600 transition-colors duration-300 hover:text-blue-800"
              >
                Bobaplace
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <NavItem key={item.name} to={item.to}>
                  {item.name}
                </NavItem>
              ))}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-blue-600 focus:outline-none transition-colors duration-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`block px-4 py-2 transition-colors duration-300 ${
                location.pathname === item.to 
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </nav>
    </AppBar>
  );
}