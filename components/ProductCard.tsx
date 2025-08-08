import React from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { type Product } from '@/database/schema';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group h-full flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={product.image1 || '/images/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-grow">{product.title}</h3>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-lg font-bold text-primary">${product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
