"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { getProductImages, getProductPrice } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cartItems, products, updateQuantity, getCartAmount, currency } = useAppContext();
  const router = useRouter();
  const [cartData, setCartData] = useState<any[]>([]);

  useEffect(() => {
    const data = [];
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product.id === itemId);
      if (itemInfo) {
        for (const size in cartItems[itemId]) {
          data.push({
            ...itemInfo,
            size,
            quantity: cartItems[itemId][size],
            images: getProductImages(itemInfo),
            numericPrice: getProductPrice(itemInfo)
          });
        }
      }
    }
    setCartData(data);
  }, [cartItems, products]);

  const handleCheckout = () => {
    // For now, redirect to a simple checkout page
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cartData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Button onClick={() => router.push("/")} className="bg-orange-600 hover:bg-orange-700">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartData.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-4">
                  <div className="relative w-24 h-24">
                    <Image 
                      src={item.images[0] || '/images/placeholder.png'} 
                      alt={item.title} 
                      fill 
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">Size: {item.size}</p>
                    <p className="font-bold">{currency}{item.numericPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => updateQuantity(item.id, item.size, 0)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currency}{getCartAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{currency}{getCartAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
            
            <Link href="/" className="block text-center mt-4 text-orange-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
