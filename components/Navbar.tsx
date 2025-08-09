"use client"

import Image, { StaticImageData } from 'next/image';
import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import Link from 'next/link';
import { UserButton, useUser, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';

interface AppContext {
  isSeller: boolean;
  router: any;
  getCartCount: () => number;
  userData: any;
}

const Navbar = () => {
  const [menu, setMenu] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { router, getCartCount }: AppContext = useAppContext();
  const { user } = useUser();

  const isSeller = user?.publicMetadata?.role === 'ADMIN' || user?.publicMetadata?.role === 'SELLER';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle menu item clicks
  const handleMenuClick = (menuItem: string, path: string) => {
    setMenu(menuItem);
    setMobileMenuOpen(false);
    router.push(path);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  return (
    <nav 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white py-4'
      }`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => handleMenuClick('home', '/')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-xl">
              <Image 
                className="w-12 transition-transform duration-300 group-hover:scale-110" 
                src="/images/Kidz-logo.png" 
                alt="KidsZone Logo" 
                width={48} 
                height={48} 
              />
            </div>
            <p className="text-2xl font-bold transition-colors duration-300">
              Kids<span className="text-orange-600 group-hover:text-orange-700">Zone</span>
            </p>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 relative">
            {[
              { name: 'Home', key: 'home', path: '/' },
              { name: 'About', key: 'about', path: '/about' },
              { name: 'Contact us', key: 'contact', path: '/contact' }
            ].map((item, index) => (
              <li key={item.key} className="relative">
                <button
                  onClick={() => handleMenuClick(item.key, item.path)}
                  className={`cursor-pointer py-2 px-4 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                    menu === item.key 
                      ? 'text-orange-600 font-semibold' 
                      : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Animated background */}
                  <div 
                    className={`absolute inset-0 bg-orange-50 transform transition-transform duration-300 ${
                      menu === item.key 
                        ? 'scale-100' 
                        : 'scale-0 group-hover:scale-100'
                    }`}
                  />
                  
                  {/* Animated underline */}
                  <div 
                    className={`absolute bottom-0 left-0 h-0.5 bg-orange-600 transition-all duration-300 ${
                      menu === item.key 
                        ? 'w-full' 
                        : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110">
              <Image 
                className="w-6" 
                src={assets.search_icon} 
                alt="Search" 
                width={24} 
                height={24} 
              />
            </button>

            {/* Authentication buttons */}
            <div className="flex items-center gap-4">
              <SignedOut>
                <div className="flex items-center gap-3">
                  <SignInButton>
                    <button 
                      className="px-6 py-2 rounded-full border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button 
                      className="px-6 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
                    >
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Cart icon with count */}
            <button 
              onClick={() => router.push('/cart')} 
              className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 group"
            >
              <Image 
                className="w-6 transition-transform duration-300 group-hover:scale-110" 
                src={assets.cart_icon} 
                alt="Cart" 
                width={24} 
                height={24} 
              />
              {getCartCount() > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 rounded-full flex justify-center items-center text-white text-xs font-bold animate-pulse">
                  {getCartCount()}
                </div>
              )}
            </button>

            {/* Admin dashboard link for admin users */}
            {isSeller && (
              <button 
                onClick={() => router.push('/admin')} 
                className="px-6 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
              >
                Admin Dashboard
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div 
                  className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <div 
                  className={`w-5 h-0.5 bg-gray-600 my-1 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <div 
                  className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2">
            {[
              { name: 'Home', key: 'home', path: '/' },
              { name: 'About', key: 'about', path: '/about' },
              { name: 'Contact us', key: 'contact', path: '/contact' }
            ].map((item, index) => (
              <button
                key={item.key}
                onClick={() => handleMenuClick(item.key, item.path)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                  menu === item.key
                    ? 'bg-orange-600 text-white transform translate-x-2'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:translate-x-1'
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 100}ms` : '0ms'
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;