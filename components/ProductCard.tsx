import React from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currency, router } = useAppContext();

  const handleClick = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <div 
      className="text-gray-700 cursor-pointer transition-transform hover:scale-105"
      onClick={handleClick}
    >
      <div className="overflow-hidden rounded-lg">
        <Image
          className="hover:scale-110 transition ease-in-out duration-300"
          src={product.image[0] || '/start/product_placeholder.png'}
          alt={product.name}
          width={300}
          height={300}
        />
      </div>
      <p className="pt-3 pb-1 text-sm font-medium">{product.name}</p>
      <p className="text-sm font-bold">
        {currency}
        {product.price}
      </p>
    </div>
  );
};

export default ProductCard;
