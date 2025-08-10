"use client";
import React, { useEffect, useState } from "react";
import { getBannerProducts } from "@/lib/actions/product.actions";
import Link from "next/link";
import { Button } from "./ui/button";
import RollingGallery from "./ui/rollinggallery";

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

  return (
    <div className="flex flex-col md:flex-row items-center justify-around bg-secondary my-16 rounded-xl overflow-hidden p-8 md:p-4">
      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:space-y-3 max-w-md">
        <h2 className="text-2xl md:text-4xl font-semibold">
          {bannerProduct.title}
        </h2>
        <p className="font-medium text-muted-foreground">
          {bannerProduct.description}
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href={`/products/${bannerProduct.id}`}>
            View Product
          </Link>
        </Button>
      </div>
      <div className="mt-8 md:mt-0 w-full md:w-1/2">
        <RollingGallery 
          images={bannerImages}
          autoplay={true}
          pauseOnHover={true}
        />
      </div>
    </div>
  );
};
