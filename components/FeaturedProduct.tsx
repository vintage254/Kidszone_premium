import React from 'react';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/actions/product.actions';
import Link from 'next/link';

const FeaturedProduct = async () => {
  const result = await getFeaturedProducts();

  if (!result.success || !result.data || result.data.length === 0) {
    return null; // Don't render the section if there are no featured products
  }
  const products = result.data;
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="relative group">
            <Image
              src={product.image1 || '/images/placeholder.png'}
              alt={product.title}
              width={500}
              height={500}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-300"></div>
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{product.title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {product.description}
              </p>
              <span className="inline-block mt-2 bg-primary text-white px-4 py-2 rounded">
                View Product
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;