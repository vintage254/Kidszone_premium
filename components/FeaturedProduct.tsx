"use client";
import React, { useEffect, useState } from 'react';
import { getFeaturedProducts } from '@/lib/actions/product.actions';
import Link from 'next/link';
import TiltedCard from '@/components/ui/tiltedcards';
import { InteractiveHoverButton } from '@/components/ui/interactivebutton';

// Function to truncate description with read more link
const truncateDescription = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

const FeaturedProduct = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <p className="text-gray-500">Loading featured products...</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map((product) => (
          <div key={product.id} className="space-y-4">
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
  );
};

export default FeaturedProduct;