"use client"

import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';
import { assets } from '../assets/assets';
import Link from 'next/link';

import { useAppContext } from '@/context/AppContext';

interface AppContext {
  isSeller: boolean;
  router: any;
  getCartCount: () => number;
  userData: any;
}

const Navbar = () => {
  const [menu, setMenu] = useState('home');
  const { isSeller, router, getCartCount, userData }: AppContext = useAppContext();



  return (
    <div className="flex justify-between items-center py-4">
      <div onClick={() => router.push('/')} className="flex items-center gap-2 cursor-pointer">
        <Image className="w-12" src={assets.logo} alt="KidsZone Logo" width={48} height={48} />
        <p className="text-2xl font-bold">
          Kids<span className="text-orange-600">Zone</span>
        </p>
      </div>
      <ul className="hidden md:flex gap-8">
        <Link href="/" onClick={() => setMenu('home')} className={`cursor-pointer ${menu === 'home' ? 'text-orange-600' : ''}`}>
          Home
        </Link>
        <li onClick={() => setMenu('about')} className={`cursor-pointer ${menu === 'about' ? 'text-orange-600' : ''}`}>
          About
        </li>
        <li onClick={() => setMenu('contact')} className={`cursor-pointer ${menu === 'contact' ? 'text-orange-600' : ''}`}>
          Contact us
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <Image className="w-6 cursor-pointer" src={assets.search_icon} alt="Search" width={24} height={24} />
        
        {/* Authentication buttons */}
        {!userData ? (
          <button 
            onClick={() => router.push('/sign-in')} 
            className="px-4 py-2 rounded-full border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition"
          >
            Sign In
          </button>
        ) : (
          <button 
            onClick={() => router.push('/sign-out')}
            className="px-4 py-2 rounded-full border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white transition"
          >
            Sign Out
          </button>
        )}
        
        {/* Cart icon with count */}
        <div onClick={() => router.push('/cart')} className="relative cursor-pointer">
          <Image className="w-6" src={assets.cart_icon} alt="Cart" width={24} height={24} />
          {getCartCount() > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-600 rounded-full flex justify-center items-center text-white text-xs">
              {getCartCount()}
            </div>
          )}
        </div>
        
        {/* Admin dashboard link for admin users */}
        {isSeller && userData && (
          <button onClick={() => router.push('/admin')} className="px-4 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition">
            Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;