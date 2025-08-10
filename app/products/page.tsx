"use client";
import React, { useEffect, useState, useMemo } from 'react';
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
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Flip text messages for different shop categories
  const flipMessages = [
    {
      category: "Children Toys",
      description: "Discover our amazing collection of educational and fun toys designed to inspire creativity and learning in children of all ages."
    },
    {
      category: "Kids Furniture", 
      description: "Explore our beautiful and safe furniture collection perfect for creating magical spaces where children can play, learn and grow."
    },
    {
      category: "Baby Clothes",
      description: "Browse our adorable and comfortable clothing range made from premium materials to keep your little ones cozy and stylish."
    },
    {
      category: "Nursery Essentials",
      description: "Find everything you need to create the perfect nursery with our curated collection of essentials for your precious bundle of joy."
    }
  ];

  // Dynamically generate product categories for filtering
  const productCategories = useMemo(() => {
    if (!products) return [];

    // Extract unique categories from products, filtering out any falsy values
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    // Format for the filter buttons
    const categoryOptions = categories.map(category => ({
      value: category.toLowerCase(),
      label: category,
    }));

    // Add 'All Products' to the beginning of the list
    return [{ value: 'all', label: 'All Products' }, ...categoryOptions];
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          (product.category && product.category.toLowerCase() === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

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

  // Cycle through flip messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % flipMessages.length
      );
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [flipMessages.length]);

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
                  Your One-Stop Baby & Kids Shop
                </p>
                <div className="overflow-hidden h-16 lg:h-20">
                  <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    <span className="inline-block animate-flip-text">
                      {flipMessages[currentMessageIndex].category}
                    </span>
                  </h1>
                </div>
                <div className="overflow-hidden h-20 lg:h-24">
                  <p className="text-base lg:text-lg text-gray-700 leading-relaxed max-w-md animate-flip-text">
                    {flipMessages[currentMessageIndex].description}
                  </p>
                </div>
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
              <div className="relative z-10 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-sm shadow-lg rounded-2xl p-3">
                <img 
                  src="/products/hero.jpg" 
                  alt="Fantastic Toy Hero"
                  className="w-full h-auto rounded-xl shadow-2xl"
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
                  <div key={`mobile-1-${index}`} className="flex-none w-72 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-sm shadow-lg rounded-2xl p-3">
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
                  <div key={`mobile-2-${index}`} className="flex-none w-72 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-sm shadow-lg rounded-2xl p-3">
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
                  <div key={`desktop-1-${index}`} className="flex-none w-80 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-sm shadow-lg rounded-2xl p-3">
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
                  <div key={`desktop-2-${index}`} className="flex-none w-80 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-sm shadow-lg rounded-2xl p-3">
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

          {/* Search and Filter Section */}
          <div className="mb-8 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-auto">
                <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                  {productCategories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category.value
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {filteredProducts.length > 0 ? (
                  <>Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products</>
                ) : (
                  'No products found matching your criteria'
                )}
              </p>
            </div>
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

          {!loading && !error && filteredProducts.length > 0 && (
            <>
              {/* Mobile Product Carousel */}
              <div className="block md:hidden mb-8">
                <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="flex-none w-80 snap-start">
                      <div className="bg-gradient-to-br from-white/50 via-white/40 to-white/30 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-white/20">
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
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-gradient-to-br from-white/50 via-white/40 to-white/30 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-white/20 hover:shadow-xl transition-all duration-300">
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
