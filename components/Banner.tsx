import React from "react";
import Image from "next/image";
import { getBannerProducts } from "@/lib/actions/product.actions";
import Link from "next/link";
import { Button } from "./ui/button";

export const Banner = async () => {
  const result = await getBannerProducts();

  if (!result.success || !result.data || result.data.length === 0) {
    return null; // Don't render if no banner product is set
  }

  const bannerProduct = result.data[0]; // Get the most recent banner product
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
      <div className="mt-8 md:mt-0">
        <Image
          className="max-w-xs md:max-w-sm lg:max-w-md object-contain"
          src={bannerProduct.image1 || '/images/placeholder.png'}
          alt={bannerProduct.title}
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};
