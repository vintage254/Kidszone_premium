"use client";

import React, { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CheckoutPage = () => {
  const { cartItems } = useAppContext();
  const router = useRouter();

  // Check if cart is empty
  const isCartEmpty = Object.keys(cartItems).length === 0;

  useEffect(() => {
    // Redirect to shipping page if cart has items
    if (!isCartEmpty) {
      router.push('/shipping');
    }
  }, [isCartEmpty, router]);

  if (isCartEmpty) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-xl mb-4">Your cart is empty</p>
          <Button onClick={() => router.push("/cart")} className="bg-orange-600 hover:bg-orange-700">
            Go to Cart
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
        <p className="text-xl mb-4">Please wait while we redirect you to the shipping information page.</p>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
