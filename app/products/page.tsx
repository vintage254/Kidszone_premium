"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiltedCard from '@/components/ui/tiltedcards';
import { ShimmerButton } from '@/components/ui/shimmerbutton';
import Link from 'next/link';
import { getProducts } from '@/lib/actions/product.actions';

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          setError('Could not load products');
        }
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hero carousel images
  const heroImages = [
    '/products/image1.jpg',
    '/products/image2.jpg',
    '/products/image3.jpg',
    '/products/image4.jpg',
    '/products/image5.jpg',
    '/products/image6.jpg',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 via-purple-50 to-cyan-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Hero Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Toys For All Ages
                </p>
                <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Fantastic Toy
                </h1>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed max-w-md">
                  There are many variations of passages of toys like industry 
                  have suffered alteration in some form.
                </p>
              </div>
              
              <div className="pt-2 flex gap-4 items-center">
                <ShimmerButton
                  className="px-6 py-2.5 text-base font-semibold"
                  background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                >
                  Contact Us
                </ShimmerButton>
                
                <div className="relative group/tooltip">
                  <button
                    onClick={() => {
                      const productsSection = document.getElementById('products-section');
                      productsSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                    aria-label="Scroll to products"
                  >
                    <svg 
                      className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-300 animate-bounce" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                    View Products
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="/products/hero.jpg" 
                  alt="Fantastic Toy Hero"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-3 -right-3 w-20 h-20 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute top-8 -left-4 w-14 h-14 bg-pink-400 rounded-full opacity-70"></div>
              <div className="absolute -bottom-4 right-8 w-16 h-16 bg-green-400 rounded-full opacity-75"></div>
              <div className="absolute bottom-2 -left-6 w-10 h-10 bg-blue-400 rounded-full opacity-85"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Image Carousel Section */}
      <section className="py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our amazing collection of toys designed to inspire creativity and joy
            </h2>
          </div>

          {/* Infinite Carousel Container */}
          <div className="relative">
            {/* Mobile Infinite Carousel */}
            <div className="block md:hidden">
              <div className="flex animate-infinite-scroll gap-6">
                {/* First set of images */}
                {heroImages.map((image, index) => (
                  <div key={`mobile-1-${index}`} className="flex-none w-72">
                    <TiltedCard
                      imageSrc={image}
                      altText={`Collection ${index + 1}`}
                      containerHeight="280px"
                      containerWidth="100%"
                      imageHeight="260px"
                      imageWidth="100%"
                      scaleOnHover={1.03}
                      rotateAmplitude={6}
                      showMobileWarning={false}
                      showTooltip={false}
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {heroImages.map((image, index) => (
                  <div key={`mobile-2-${index}`} className="flex-none w-72">
                    <TiltedCard
                      imageSrc={image}
                      altText={`Collection ${index + 1}`}
                      containerHeight="280px"
                      containerWidth="100%"
                      imageHeight="260px"
                      imageWidth="100%"
                      scaleOnHover={1.03}
                      rotateAmplitude={6}
                      showMobileWarning={false}
                      showTooltip={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Infinite Carousel */}
            <div className="hidden md:block">
              <div className="flex animate-infinite-scroll-desktop gap-8">
                {/* First set of images */}
                {heroImages.map((image, index) => (
                  <div key={`desktop-1-${index}`} className="flex-none w-80">
                    <TiltedCard
                      imageSrc={image}
                      altText={`Collection ${index + 1}`}
                      containerHeight="320px"
                      containerWidth="100%"
                      imageHeight="300px"
                      imageWidth="100%"
                      scaleOnHover={1.05}
                      rotateAmplitude={8}
                      showMobileWarning={false}
                      showTooltip={false}
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {heroImages.map((image, index) => (
                  <div key={`desktop-2-${index}`} className="flex-none w-80">
                    <TiltedCard
                      imageSrc={image}
                      altText={`Collection ${index + 1}`}
                      containerHeight="320px"
                      containerWidth="100%"
                      imageHeight="300px"
                      imageWidth="100%"
                      scaleOnHover={1.05}
                      rotateAmplitude={8}
                      showMobileWarning={false}
                      showTooltip={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section id="products-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              All Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of premium toys and educational materials
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              {/* Mobile Product Carousel */}
              <div className="block md:hidden mb-8">
                <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex-none w-80 snap-start">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <TiltedCard
                          imageSrc={product.image1 || '/images/placeholder.png'}
                          altText={product.title}
                          containerHeight="280px"
                          containerWidth="100%"
                          imageHeight="260px"
                          imageWidth="100%"
                          scaleOnHover={1.05}
                          rotateAmplitude={8}
                          showMobileWarning={false}
                          showTooltip={false}
                        />
                        
                        <div className="p-6 space-y-4">
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900">
                              ${product.price}
                            </span>
                            <Link href={`/products/${product.id}`}>
                              <ShimmerButton
                                className="px-4 py-2 text-sm"
                                background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              >
                                View Details
                              </ShimmerButton>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Product Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <TiltedCard
                      imageSrc={product.image1 || '/images/placeholder.png'}
                      altText={product.title}
                      containerHeight="280px"
                      containerWidth="100%"
                      imageHeight="260px"
                      imageWidth="100%"
                      scaleOnHover={1.08}
                      rotateAmplitude={12}
                      showMobileWarning={false}
                      showTooltip={false}
                    />
                    
                    <div className="p-6 space-y-4">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        <Link href={`/products/${product.id}`}>
                          <ShimmerButton
                            className="px-4 py-2 text-sm"
                            background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          >
                            View Details
                          </ShimmerButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
