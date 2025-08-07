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
}

const Navbar = () => {
  const [menu, setMenu] = useState('home');
  const { isSeller, router, getCartCount }: AppContext = useAppContext();

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
        <Image className="w-6 cursor-pointer" src={assets.profile_icon} alt="Profile" width={24} height={24} />
        <div onClick={() => router.push('/cart')} className="relative cursor-pointer">
          <Image className="w-6" src={assets.cart_icon} alt="Cart" width={24} height={24} />
          {getCartCount() > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-600 rounded-full flex justify-center items-center text-white text-xs">
              {getCartCount()}
            </div>
          )}
        </div>
        {isSeller && (
          <button onClick={() => router.push('/admin/add-product')} className="px-6 py-2 rounded-full border-2 border-orange-600">
            Add Product
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;