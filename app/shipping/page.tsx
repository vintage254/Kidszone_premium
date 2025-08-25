'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner';
import { getCart } from '@/lib/actions/order.actions';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

interface CartItem {
  cartId: string;
  quantity: number;
  filters: Record<string, string> | null;
  createdAt: Date | null;
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    price: string;
    image1: string | null;
    image2: string | null;
    image3: string | null;
    image4: string | null;
    isFeatured: boolean;
    isBanner: boolean;
    filters: unknown;
    createdAt: Date | null;
  } | null;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function ShippingPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  useEffect(() => {
    async function fetchCart() {
      try {
        const result = await getCart();
        if (result.success && result.data) {
          setCartItems(result.data as CartItem[]);
        } else {
          toast.error(result.message || "Failed to fetch cart");
          router.push('/cart');
        }
      } catch (error) {
        toast.error("An error occurred while fetching cart");
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [router]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.product) {
        return total + parseFloat(item.product.price) * item.quantity;
      }
      return total;
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'address1', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof ShippingInfo]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    }
  };

  const handleStripePayment = async () => {
    setSubmitting(true);
    
    try {
      const cartItemsForCheckout = cartItems
        .filter((item) => item.product)
        .map((item) => ({
          productId: item.product!.id,
          quantity: item.quantity,
        }));

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          cartItems: cartItemsForCheckout,
          shippingInfo: shippingInfo
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayPalPayment = async () => {
    // Validate required fields first
    const requiredFields = ['fullName', 'email', 'address1', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof ShippingInfo]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setPaymentMethod('paypal');
    setSubmitting(true);
    
    try {
      const { createPaypalCartOrder } = await import('@/lib/actions/paypal.actions');
      
      const cartItemsForCheckout = cartItems
        .filter((item) => item.product)
        .map((item) => ({
          productId: item.product!.id,
          quantity: item.quantity,
        }));

      const result = await createPaypalCartOrder(cartItemsForCheckout, shippingInfo);
      
      if (result.success && result.orderId) {
        // Use the approval URL directly from the PayPal response
        if (result.approvalUrl) {
          window.location.href = result.approvalUrl;
        } else {
          toast.error('Failed to get PayPal approval URL');
        }
      } else {
        toast.error(result.message || 'Failed to create PayPal order');
      }
    } catch (error) {
      console.error("PayPal error:", error);
      toast.error("An error occurred with PayPal payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p>Loading shipping information...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link href="/products">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const subtotal = calculateTotal();
  const shipping = 100;
  const total = subtotal + shipping;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Information</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Delivery Address</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address1">Address Line 1 *</Label>
                  <Input
                    id="address1"
                    name="address1"
                    type="text"
                    required
                    value={shippingInfo.address1}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input
                    id="address2"
                    name="address2"
                    type="text"
                    value={shippingInfo.address2}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select State</option>
                      <option value="MA">Massachusetts</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      required
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-semibold">Payment Method</h3>
                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      {submitting && paymentMethod === 'stripe' ? "Processing..." : "Pay with Credit Card"}
                    </Button>
                    <Button 
                      type="button"
                      disabled={submitting}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                      onClick={handlePayPalPayment}
                    >
                      {submitting && paymentMethod === 'paypal' ? "Processing..." : "Pay with PayPal"}
                    </Button>
                  </div>
                  <Link href="/cart" className="block">
                    <Button type="button" variant="outline" className="w-full">
                      Back to Cart
                    </Button>
                  </Link>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  item.product && (
                    <div key={item.cartId} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        {item.filters && Object.keys(item.filters).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.filters).map(([key, value]) => (
                              <span key={key} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="font-medium">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  )
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping (US)</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
