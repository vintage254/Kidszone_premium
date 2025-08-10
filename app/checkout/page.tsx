"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { getProductPrice } from "@/types";
import { PayPalButtonsWrapper } from "@/components/products/PayPalButtonsWrapper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "@/components/Navbar";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage = () => {
  <Navbar/>
  const { cartItems, products, getCartAmount, currency } = useAppContext();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Check if cart is empty
  const isCartEmpty = Object.keys(cartItems).length === 0;

  // Create payment intent for Stripe
  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getCartAmount(),
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }
      
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };

  // Handle Stripe checkout
  const handleStripeCheckout = async () => {
    if (!clientSecret) {
      await createPaymentIntent();
    }
    // The actual Stripe checkout will be handled by the Elements provider
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
    <div className="container mx-auto px-4 py-8">
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
            <Elements stripe={stripePromise}>
              <div className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">Stripe Payment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You will be redirected to Stripe to complete your payment securely.
                </p>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={handleStripeCheckout}
                >
                  Pay with Stripe
                </Button>
              </div>
            </Elements>
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
    </div>
  );
};

export default CheckoutPage;
