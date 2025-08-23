'use client';

import { useEffect, useState } from "react";
import { getProductById, getProductsByCategory } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from 'next/link';
import TiltedCard from "@/components/ui/tiltedcards";
import { InteractiveHoverButton } from "@/components/ui/interactivebutton";
import { toast } from 'sonner';
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BuyNowButton } from "@/components/products/BuyNowButton";

interface ProductPageProps {
  params: { id: string };
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  filters: any;
  category: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  isFeatured: boolean;
  isBanner: boolean;
  createdAt: Date | null;
}

const ProductPage = ({ params }: ProductPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [cartVariations, setCartVariations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [imageCarouselIndex, setImageCarouselIndex] = useState(0);
  const [relatedCarouselIndex, setRelatedCarouselIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      const { id } = resolvedParams;
      const result = await getProductById(id);

      if (!result.success || !result.data) {
        notFound();
      }

      const productData = result.data;
      setProduct(productData);

      // Fetch related products from the same category
      const relatedResult = await getProductsByCategory(productData.category, id);
      if (relatedResult.success && relatedResult.data) {
        setRelatedProducts(relatedResult.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="bg-gray-200 aspect-square rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;

  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean) as string[];
  const rating = 4.5; // Mock rating
  const reviewCount = 441; // Mock review count

  // Handle add to cart with validation
  const handleAddToCart = async () => {
    if (!product) return;
    
    // Validation - check if product has filters and if they're selected
    if (product.filters && Array.isArray(product.filters) && product.filters.length > 0) {
      for (const filter of product.filters) {
        if (!selectedFilters[filter.name]) {
          toast.error(`Please select a ${filter.name} before adding to cart`);
          return;
        }
      }
    }
    
    setIsAddingToCart(true);
    
    try {
      // Import the server action
      const { addToCart: addToServerCart } = await import('@/lib/actions/order.actions');
      
      // Add to cart using the server action with filters
      const result = await addToServerCart(product.id, 1, selectedFilters);
      
      if (result.success) {
        const filterKey = Object.keys(selectedFilters).length > 0 
          ? Object.entries(selectedFilters).map(([key, value]) => `${key}: ${value}`).join(', ')
          : 'default';
        setCartVariations(prev => ({
          ...prev,
          [filterKey]: (prev[filterKey] || 0) + 1
        }));
        toast.success(`${product.title} added to cart!`);
        setCartItemsCount(prev => prev + 1);
      } else {
        toast.error(result.message || 'Failed to add item to cart');
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Get cart count for this specific product
  const getProductCartCount = () => {
    return cartItemsCount;
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-16 mb-16">
        {/* Product Images Carousel */}
        <div className="space-y-6">
          <div className="relative">
            <TiltedCard
              imageSrc={images[imageCarouselIndex] || '/images/placeholder.png'}
              altText={product.title}
              containerHeight="500px"
              containerWidth="100%"
              imageHeight="500px"
              imageWidth="100%"
              scaleOnHover={1.05}
              rotateAmplitude={8}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
            />
            <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImageCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setImageCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
          </div>
          
          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImageCarouselIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    imageCarouselIndex === index 
                      ? 'bg-blue-500 scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : i === Math.floor(rating) && rating % 1 !== 0
                        ? 'fill-yellow-400/50 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {reviewCount} reviews
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-6">
              $ {parseFloat(product.price).toFixed(2)}
            </p>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Dynamic Filters */}
          {product.filters && product.filters.map((filter: any) => (
            <div key={filter.name}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{filter.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                {filter.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFilters(prev => ({ ...prev, [filter.name]: option }))}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                      selectedFilters[filter.name] === option
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Current Selection Display */}
          {Object.keys(selectedFilters).length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Current Selection:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFilters).map(([key, value]) => (
                  <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {key}: {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cart Variations Display */}
          {Object.keys(cartVariations).length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-3">In Your Cart:</h4>
              <div className="space-y-2">
                {Object.entries(cartVariations).map(([variation, quantity]) => (
                  <div key={variation} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {variation === 'default' ? 'No filters' : variation}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-sm font-bold"
                        onClick={() => setCartVariations(prev => {
                          const newVariations = { ...prev };
                          if (newVariations[variation] > 1) {
                            newVariations[variation]--;
                          } else {
                            delete newVariations[variation];
                          }
                          setCartItemsCount(prev => prev - 1);
                          return newVariations;
                        })}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button
                        className="w-6 h-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-sm font-bold"
                        onClick={async () => {
                          try {
                            // Parse the variation back to filters
                            const filters = variation === 'default' ? {} : 
                              variation.split(', ').reduce((acc, pair) => {
                                const [key, value] = pair.split(': ');
                                acc[key] = value;
                                return acc;
                              }, {} as Record<string, string>);
                            
                            const { addToCart: addToServerCart } = await import('@/lib/actions/order.actions');
                            const result = await addToServerCart(product.id, 1, filters);
                            
                            if (result.success) {
                              setCartVariations(prev => ({
                                ...prev,
                                [variation]: (prev[variation] || 0) + 1
                              }));
                              setCartItemsCount(prev => prev + 1);
                              toast.success('Item added to cart!');
                            } else {
                              toast.error(result.message || 'Failed to add item to cart');
                            }
                          } catch (error) {
                            console.error('Error adding to cart:', error);
                            toast.error('Failed to add item to cart');
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || loading}
              className="w-full px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              {getProductCartCount() > 0 && (
                <span className="ml-2 bg-white text-orange-500 px-2 py-1 rounded-full text-sm font-bold">
                  {getProductCartCount()}
                </span>
              )}
            </button>
            <BuyNowButton 
              productId={product.id} 
              product={product}
              selectedFilters={selectedFilters}
            />
            <Link href="/cart">
              <button className="w-full px-8 py-3 bg-gray-800 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                View Cart ({getProductCartCount()})
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          More from {product.category}
        </h2>
        
        {relatedProducts.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ 
                  transform: `translateX(-${relatedCarouselIndex * 100}%)`,
                  width: `${Math.ceil(relatedProducts.length / 4) * 100}%`
                }}
              >
                {Array.from({ length: Math.ceil(relatedProducts.length / 4) }, (_, pageIndex) => (
                  <div key={pageIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full flex-shrink-0">
                    {relatedProducts.slice(pageIndex * 4, (pageIndex + 1) * 4).map((relatedProduct) => {
                      const relatedImages = [relatedProduct.image1, relatedProduct.image2, relatedProduct.image3, relatedProduct.image4].filter(Boolean) as string[];
                      
                      return (
                        <div key={relatedProduct.id} className="group">
                          <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100">
                            <Image
                              src={relatedImages[0] || '/images/placeholder.png'}
                              alt={relatedProduct.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {relatedProduct.title}
                            </h3>
                            <p className="text-lg font-bold text-gray-900">
                              $ {parseFloat(relatedProduct.price).toFixed(2)}
                            </p>
                            <Link href={`/products/${relatedProduct.id}`}>
                              <InteractiveHoverButton className="w-full mt-2">
                                View Product
                              </InteractiveHoverButton>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Navigation */}
            {Math.ceil(relatedProducts.length / 4) > 1 && (
              <>
                <button
                  onClick={() => setRelatedCarouselIndex((prev) => (prev === 0 ? Math.ceil(relatedProducts.length / 4) - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setRelatedCarouselIndex((prev) => (prev === Math.ceil(relatedProducts.length / 4) - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M6 18l6-3" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600 mb-2">
              No more products in this category
            </p>
            <p className="text-gray-500">
              This is the only product in this category right now.
            </p>
          </div>
        )}
      </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductPage;
