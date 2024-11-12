import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { Home, Chat, Person } from '@mui/icons-material';

const NavItem = ({ to, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 transition-colors duration-300 group ${
        isActive ? 'text-blue-900' : 'text-gray-500 hover:text-blue-900'
      }`}
    >
      {icon}
      {/* The commented line below is for underline hovers */}
      {/* <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-blue-900 transform transition-transform duration-600 ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}></span> */}
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', to: '/home', icon: <Home /> },
    { name: 'Chat', to: '/chat', icon: <Chat /> },
    { name: 'Profile', to: '/profile', icon: <Person /> },
  ];

  return (
      <AppBar position="fixed" sx={{ boxShadow:'none', borderBottom: '1px solid #e0e0e0', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <nav className="bg-white">
          <div className="mx-auto">
            <div className="flex justify-between items-center h-16 p-8">
              <div className="flex-shrink-0">
                <Link 
                  to="/home" 
                  className="text-2xl font-bold text-blue-900 transition-colors duration-300 hover:text-gray-500"
                >
                  UofT Marketplace
                </Link>
              </div>
              <div className="hidden md:flex space-x-4">
                {navItems.map((item) => (
                  <NavItem key={item.name} to={item.to} icon={item.icon} />
                ))}
              </div>
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="text-gray-500 hover:text-blue-900 focus:outline-none transition-colors duration-300"
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
                    ? 'text-blue-900 bg-blue-50'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </AppBar>
  );
}
