import React from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { Product as ProductType } from '../types';
import { assets } from '../assets/assets';

interface ProductProps {
  product: ProductType;
}

const Product: React.FC<ProductProps> = ({ product }) => {

  const { currency, router } = useAppContext()

  return (
    <div
      onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
          width={800}
          height={800}
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
          <Image
            className="h-3 w-3"
            src={assets.heart_icon_red}
            alt="heart_icon"
          />
        </button>
            </div>
      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">{currency}{product.offerPrice}</p>
        <button className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
            Buy now
        </button>
      </div>
    </div>
    )
}

export default Product;