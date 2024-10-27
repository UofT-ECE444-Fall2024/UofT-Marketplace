import React, { useState } from 'react'

const NavItem = ({ href, children }) => (
  <a
    href={href}
    className="relative px-3 py-2 text-gray-700 transition-colors duration-300 hover:text-blue-600 group"
  >
    {children}
    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
  </a>
)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Search', href: '#' },
    { name: 'Chat', href: '#' },
    { name: 'Profile', href: '#' },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-blue-600 transition-colors duration-300 hover:text-blue-800">
              Logo
            </a>
          </div>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavItem key={item.name} href={item.href}>
                {item.name}
              </NavItem>
            ))}
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
          <a
            key={item.name}
            href={item.href}
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
          >
            {item.name}
          </a>
        ))}
      </div>
    </nav>
  )
}
