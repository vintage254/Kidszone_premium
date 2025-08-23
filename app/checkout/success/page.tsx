"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { clearUserCart } from "@/lib/actions/order.actions";

const CheckoutSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useAppContext();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const clearedRef = useRef(false);

  useEffect(() => {
    const id = searchParams.get('session_id');
    if (id && !clearedRef.current) {
      setSessionId(id);
      // Clear the cart once after successful payment
      clearCart();
      // Also clear the server-side cart for the authenticated user
      (async () => {
        try {
          await clearUserCart();
        } catch (e) {
          console.error('Failed to clear DB cart after success:', e);
        }
      })();
      clearedRef.current = true;
    }
    // Depend on searchParams only; ref prevents repeated clearing even if this runs again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {sessionId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                Order Reference: <span className="font-mono text-sm">{sessionId}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => router.push("/")} 
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Continue Shopping
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push("/orders")} 
              className="w-full"
            >
              View Orders
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            You will receive an email confirmation shortly with your order details.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

const CheckoutSuccess = () => {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccess;
