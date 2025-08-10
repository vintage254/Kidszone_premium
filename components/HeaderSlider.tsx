'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { assets } from '../assets/assets';
import Link from 'next/link';
import { ShimmerButton } from './ui/shimmerbutton';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: assets.header_slide_2,
    title: 'Musical Learning & Fun',
    description: 'Inspire creativity with our interactive piano sets and musical instruments for little ones.',
  },
  {
    id: 2,
    image: assets.header_slide_1,
    title: 'Comfort & Entertainment',
    description: 'Soothing baby rockers and bouncer seats designed for comfort and development.',
  },
  {
    id: 3,
    image: assets.header_slide_3,
    title: 'Safe & Secure Carriers',
    description: 'Premium baby carriers for bonding moments and hands-free convenience.',
  },
];

const HeaderSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-sm shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
            }}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col md:justify-center justify-start md:items-start items-start md:p-12 p-6 pt-8">
            {/* Heading - desktop centered, mobile higher up */}
            <h2 className="text-white text-4xl md:text-4xl text-2xl font-bold max-w-md drop-shadow-lg">
              {slide.title}
            </h2>
            
            {/* Desktop description - full size, under heading */}
            <p className="hidden md:block text-white text-lg mt-4 max-w-lg drop-shadow-md">
              {slide.description}
            </p>
            
            {/* Desktop Shop Now button - under description */}
            <Link href="/products" className="hidden md:block mt-6">
              <ShimmerButton
                background="linear-gradient(to right, #ff7e5f, #feb47b)"
                className="px-8 py-3 font-semibold shadow-lg"
              >
                Shop Now
              </ShimmerButton>
            </Link>
            
            {/* Mobile Shop Now button - positioned higher, brighter */}
            <Link href="/products" className="block md:hidden mt-3">
              <ShimmerButton
                background="linear-gradient(to right, #ff4500, #ff6347, #ffa500)"
                className="px-6 py-2 font-bold shadow-xl text-sm"
              >
                Shop Now
              </ShimmerButton>
            </Link>
          </div>
          
          {/* Mobile description - bottom right, darker color for contrast */}
          <div className="absolute bottom-16 right-4 block md:hidden">
            <p className="text-gray-800 text-xs max-w-xs drop-shadow-lg text-right font-medium">
              {slide.description}
            </p>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;