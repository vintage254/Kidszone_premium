"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function PayPalSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const PayerID = searchParams.get('PayerID');

    if (token && PayerID) {
      capturePayment(token);
    } else {
      setProcessing(false);
      toast.error('Invalid PayPal payment parameters');
    }
  }, [searchParams]);

  const capturePayment = async (orderID: string) => {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        toast.success('Payment successful! Thank you for your purchase.');
        
        // Clear cart after successful payment
        const { clearUserCart } = await import('@/lib/actions/order.actions');
        await clearUserCart();
        
        // Redirect to orders page after a delay
        setTimeout(() => {
          router.push('/orders');
        }, 3000);
      } else {
        toast.error(data.error || 'Payment capture failed');
      }
    } catch (error) {
      console.error('Payment capture error:', error);
      toast.error('An error occurred while processing your payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
              <p className="text-gray-600">Please wait while we confirm your PayPal payment...</p>
            </>
          ) : success ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed and you will receive an email confirmation shortly.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/orders')}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  View My Orders
                </Button>
                <Button 
                  onClick={() => router.push('/products')}
                  variant="outline"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                There was an issue processing your PayPal payment. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/cart')}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Return to Cart
                </Button>
                <Button 
                  onClick={() => router.push('/contact')}
                  variant="outline"
                  className="w-full"
                >
                  Contact Support
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
