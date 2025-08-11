"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { getProductPrice, getProductImages } from "@/types";
import { PayPalButtonsWrapper } from "@/components/products/PayPalButtonsWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CheckoutPage = () => {
  const { cartItems, products, getCartAmount, currency } = useAppContext();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [loading, setLoading] = useState(false);

  // Check if cart is empty
  const isCartEmpty = Object.keys(cartItems).length === 0;

  // Create cart items for Stripe
  const createCartItems = () => {
    const items: any[] = [];
    Object.entries(cartItems).forEach(([itemId, sizes]) => {
      const product = products.find(p => p.id === itemId);
      if (!product) return;
      
      Object.entries(sizes).forEach(([size, quantity]) => {
        items.push({
          productId: product.id,
          name: `${product.title} - Size ${size}`,
          price: getProductPrice(product),
          quantity,
          image: getProductImages(product)[0]
        });
      });
    });
    return items;
  };

  // Handle Stripe checkout
  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getCartAmount(),
          cartItems: createCartItems(),
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
      
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isCartEmpty) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-xl mb-4">Your cart is empty</p>
        <Button onClick={() => router.push("/cart")} className="bg-orange-600 hover:bg-orange-700">
          Go to Cart
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {Object.entries(cartItems).map(([itemId, sizes]) => {
              const product = products.find(p => p.id === itemId);
              if (!product) return null;
              
              return Object.entries(sizes).map(([size, quantity]) => (
                <div key={`${itemId}-${size}`} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-gray-600 text-sm">Size: {size} × {quantity}</p>
                  </div>
                  <p>{currency}{(getProductPrice(product) * quantity).toFixed(2)}</p>
                </div>
              ));
            })}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{currency}{getCartAmount().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Payment Method</h2>
          
          <div className="flex gap-4">
            <Button 
              variant={paymentMethod === "stripe" ? "default" : "outline"}
              className={paymentMethod === "stripe" ? "bg-orange-600 hover:bg-orange-700" : ""}
              onClick={() => setPaymentMethod("stripe")}
            >
              Credit Card (Stripe)
            </Button>
            <Button 
              variant={paymentMethod === "paypal" ? "default" : "outline"}
              className={paymentMethod === "paypal" ? "bg-orange-600 hover:bg-orange-700" : ""}
              onClick={() => setPaymentMethod("paypal")}
            >
              PayPal
            </Button>
          </div>
          
          {paymentMethod === "stripe" && (
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">Credit Card Payment</h3>
              <p className="text-sm text-gray-600 mb-4">
                You will be redirected to Stripe's secure checkout page to complete your payment.
              </p>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                onClick={handleStripeCheckout}
                disabled={loading}
              >
                {loading ? "Loading..." : "Pay with Credit Card"}
              </Button>
            </div>
          )}
          
          {paymentMethod === "paypal" && (
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">PayPal Payment</h3>
              <p className="text-sm text-gray-600 mb-4">
                You will be redirected to PayPal to complete your payment securely.
              </p>
              <PayPalButtonsWrapper 
                currency={currency} 
                onSuccess={() => {
                  // Handle successful payment
                  alert("Payment successful! Thank you for your purchase.");
                  // Clear cart after successful payment
                  // Note: In a real app, this would be handled by the payment success callback
                  router.push("/");
                }} 
              />
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => router.push("/cart")}
            className="w-full"
          >
            Back to Cart
          </Button>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
