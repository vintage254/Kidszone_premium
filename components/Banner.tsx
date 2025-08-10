"use client";
import React, { useEffect, useState } from "react";
import { getBannerProducts } from "@/lib/actions/product.actions";
import Link from "next/link";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { CardStack } from "./ui/card-stack";
import { InteractiveHoverButton } from "./ui/interactivebutton";
import TiltedCard from "./ui/tiltedcards";
import { BackgroundLines } from "./ui/background-lines";

export const Banner = () => {
  const [bannerProduct, setBannerProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerProducts = async () => {
      try {
        const result = await getBannerProducts();
        if (result.success && result.data && result.data.length > 0) {
          setBannerProduct(result.data[0]); // Get the most recent banner product
        } else {
          setError('No banner product found');
        }
      } catch (err) {
        setError('Failed to fetch banner product');
      } finally {
        setLoading(false);
      }
    };

    fetchBannerProducts();
  }, []);

  if (loading) {
    return (
      <div className="my-16 bg-secondary rounded-xl overflow-hidden p-8 md:p-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading banner...</p>
        </div>
      </div>
    );
  }

  if (error || !bannerProduct) {
    return null; // Don't render if no banner product is set
  }

  // Collect all available images from the banner product
  const bannerImages = [
    bannerProduct.image1,
    bannerProduct.image2,
    bannerProduct.image3,
    bannerProduct.image4,
  ].filter(img => img && img.trim() !== ''); // Filter out null/empty images

  // Use all 4 images for the grid
  const displayImages = bannerImages.slice(0, 4);

  // Create card data for mobile CardStack (image only, no text) with TiltedCards effect
  const cardStackItems = displayImages.map((image, index) => ({
    id: index + 1,
    name: "", // Empty to hide text
    designation: "", // Empty to hide text
    content: (
      <div className="w-full h-full flex items-center justify-center">
        <TiltedCard
          imageSrc={image}
          altText={`${bannerProduct.title} - Image ${index + 1}`}
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="200px"
          imageWidth="100%"
          scaleOnHover={1.03}
          rotateAmplitude={6}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={false}
          overlayContent={null}
        />
      </div>
    ),
  }));

  return (
    <div className="my-16 p-8 relative">
      <BackgroundLines className="absolute inset-0 w-full h-full">
        <div></div>
      </BackgroundLines>
      
      {/* Mobile Layout - CardStack */}
      <div className="block md:hidden relative z-10">
        <div className="flex flex-col items-center space-y-8">
          {/* Card Stack for Images */}
          <div className="flex justify-center">
            <CardStack items={cardStackItems} offset={15} scaleFactor={0.06} />
          </div>
          
          {/* Product Information and Button Below */}
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold line-clamp-2">
              {bannerProduct.title}
            </h2>
            <p className="text-base text-muted-foreground line-clamp-4">
              {bannerProduct.description}
            </p>
            <Link href={`/products/${bannerProduct.id}`} className="inline-block">
              <InteractiveHoverButton>
                Shop Now
              </InteractiveHoverButton>
            </Link>
            
            {/* Mobile Monthly Offer CTA */}
            <div className="mt-8 p-4 bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-orange-300/20 backdrop-blur-sm rounded-2xl border border-orange-200">
              <div className="text-2xl font-bold text-orange-600 mb-2">🎉 20% OFF</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Monthly Special!</div>
              <div className="text-sm text-gray-600 mb-4">
                Limited time offer on all premium kids products
              </div>
              <Link href="/products" className="inline-block">
                <InteractiveHoverButton className="bg-orange-600 text-white hover:bg-orange-700">
                  Claim Offer
                </InteractiveHoverButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - BentoGrid */}
      <div className="hidden md:block">
        <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem] md:grid-cols-4 relative z-10">
          {/* Main banner info - spans 2 columns, no images */}
          <BentoGridItem
            className="md:col-span-2 border-none bg-gradient-to-br from-white/50 via-white/30 to-white/20 backdrop-blur-sm shadow-lg rounded-2xl"
            title={
              <div className="text-2xl md:text-3xl font-bold line-clamp-2 mb-4">
                {bannerProduct.title}
              </div>
            }
            description={
              <div className="text-base text-muted-foreground line-clamp-4 mb-6">
                {bannerProduct.description}
              </div>
            }
            icon={
              <Link href={`/products/${bannerProduct.id}`} className="inline-block">
                <InteractiveHoverButton>
                  View Product
                </InteractiveHoverButton>
              </Link>
            }
          />
          

          
          {/* Product images using TiltedCard - each takes 1 column */}
          {displayImages.map((image, index) => (
            <BentoGridItem
              key={index}
              className="md:col-span-1 border-none bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-sm shadow-lg rounded-2xl p-2"
              header={
                <div className="w-full h-full">
                  <TiltedCard
                    imageSrc={image}
                    altText={`${bannerProduct.title} - Image ${index + 1}`}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="280px"
                    imageWidth="100%"
                    scaleOnHover={1.05}
                    rotateAmplitude={8}
                    showMobileWarning={false}
                    showTooltip={false}
                  />
                </div>
              }
            />
          ))}
          
          {/* Fill remaining slots if less than 3 images (since we reserve 1 slot for the offer) */}
          {displayImages.length < 3 && Array.from({ length: 3 - displayImages.length }).map((_, index) => (
            <BentoGridItem
              key={`placeholder-${index}`}
              className="md:col-span-1 border-none bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-sm shadow-lg rounded-2xl"
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-100 dark:from-neutral-800 dark:to-neutral-700 to-neutral-50 opacity-50"></div>
              }
            />
          ))}
          
          {/* Monthly Offer Card - spans 1 column - MOVED TO LAST POSITION */}
          <BentoGridItem
            className="md:col-span-1 border-none bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-300/10 backdrop-blur-sm shadow-lg rounded-2xl"
            title={
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">20% OFF</div>
                <div className="text-lg font-semibold text-gray-800">Monthly Offer</div>
              </div>
            }
            description={
              <div className="text-sm text-gray-600 text-center mb-4">
                Special discount on all premium kids products this month!
              </div>
            }
            icon={
              <div className="flex justify-center">
                <Link href="/products" className="inline-block">
                  <InteractiveHoverButton className="bg-orange-600 text-white hover:bg-orange-700">
                    Shop Now
                  </InteractiveHoverButton>
                </Link>
              </div>
            }
          />
        </BentoGrid>
      </div>
    </div>
  );
};
