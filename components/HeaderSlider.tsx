'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { assets } from '../assets/assets';

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
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center items-start p-12">
            <h2 className="text-white text-4xl font-bold max-w-md drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-white text-lg mt-4 max-w-lg drop-shadow-md">
              {slide.description}
            </p>
            <button className="mt-6 px-8 py-3 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Shop Now
            </button>
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