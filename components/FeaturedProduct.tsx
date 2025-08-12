"use client";
import React, { useEffect, useState, useRef } from 'react';
import { getFeaturedProducts } from '@/lib/actions/product.actions';
import Link from 'next/link';
import TiltedCard from '@/components/ui/tiltedcards';
import { InteractiveHoverButton } from '@/components/ui/interactivebutton';
import MagicLoader from '@/components/ui/magicloader';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Function to truncate description with read more link
const truncateDescription = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

const FeaturedProduct = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState<{[key: string]: boolean}>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const result = await getFeaturedProducts();
        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          setError('Could not load featured products');
        }
      } catch (err) {
        setError('Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="mt-14">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-medium">Featured Products</p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>
        <div className="flex items-center justify-center h-64">
          <MagicLoader text="Loading featured products..." />
        </div>
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return null; // Don't render the section if there are no featured products
  }

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      {/* Mobile Carousel View */}
      <div className="block sm:hidden mt-12">
        <div className="relative overflow-hidden px-4">
          {/* Navigation Arrows */}
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                const scrollAmount = 320; // card width + gap
                scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
              }
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                const scrollAmount = 320; // card width + gap
                scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => {
              const isExpanded = showFullDescription[product.id] || false;
              const shouldTruncate = product.description.length > 120;
              
              return (
                <div key={product.id} className="flex-none w-80 snap-start">
                  <div className="space-y-4 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-sm shadow-lg rounded-2xl p-4">
                    <TiltedCard
                      imageSrc={product.image1 || '/images/placeholder.png'}
                      altText={product.title}
                      containerHeight="350px"
                      containerWidth="100%"
                      imageHeight="300px"
                      imageWidth="100%"
                      scaleOnHover={1.05}
                      rotateAmplitude={12}
                      showMobileWarning={false}
                      showTooltip={false}
                      displayOverlayContent={false}
                      overlayContent={null}
                    />
                    
                    {/* Description and Shop Now below the card */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-gray-900">{product.title}</h3>
                      <div className="text-base text-gray-700 leading-relaxed font-medium">
                        <p className={`transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {isExpanded ? product.description : truncateDescription(product.description, 120)}
                        </p>
                        {shouldTruncate && (
                          <button
                            onClick={() => {
                              setShowFullDescription(prev => ({
                                ...prev,
                                [product.id]: !prev[product.id]
                              }));
                            }}
                            className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm mt-2 transition-colors duration-200"
                          >
                            {isExpanded ? 'See less' : 'See more'}
                            <ChevronRight 
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-90' : ''
                              }`} 
                            />
                          </button>
                        )}
                      </div>
                      <Link href={`/products/${product.id}`}>
                        <InteractiveHoverButton className="mt-2">
                          Shop Now
                        </InteractiveHoverButton>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Swipe indicator */}
          <div className="flex justify-center mt-4 gap-2">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>Swipe</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
          {products.map((product) => (
            <div key={product.id} className="space-y-4 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-sm shadow-lg rounded-2xl p-4">
              <TiltedCard
                imageSrc={product.image1 || '/images/placeholder.png'}
                altText={product.title}
                containerHeight="350px"
                containerWidth="100%"
                imageHeight="300px"
                imageWidth="100%"
                scaleOnHover={1.05}
                rotateAmplitude={12}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
                overlayContent={null}
              />
              
              {/* Description and Shop Now below the card */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900">{product.title}</h3>
                <p className="text-base text-gray-700 leading-relaxed font-medium">
                  {truncateDescription(product.description, 120)}
                </p>
                <Link href={`/products/${product.id}`}>
                  <InteractiveHoverButton className="mt-2">
                    Shop Now
                  </InteractiveHoverButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;