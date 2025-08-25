"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getCart, removeFromCart } from "@/lib/actions/order.actions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        const result = await getCart();
        console.log('Cart fetch result:', result); // Debug log
        if (result.success && result.data) {
          console.log('Cart data:', result.data); // Debug log
          setCartItems(result.data as CartItem[]);
        } else {
          console.error('Cart fetch failed:', result.message); // Debug log
          toast.error(result.message || "Failed to fetch cart");
        }
      } catch (error) {
        console.error('Cart fetch error:', error); // Debug log
        toast.error("An error occurred while fetching cart");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const handleRemoveItem = async (cartId: string) => {
    setRemoving(cartId);
    try {
      const result = await removeFromCart(cartId);
      if (result.success) {
        setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
        toast.success("Item removed from cart");
      } else {
        toast.error(result.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("An error occurred while removing item");
    } finally {
      setRemoving(null);
    }
  };


  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.product) {
        return total + parseFloat(item.product.price) * item.quantity;
      }
      return total;
    }, 0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!loading && cartItems.length === 0) {
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

  const total = calculateTotal();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                {cartItems.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex items-center p-6 border-b last:border-b-0"
                  >
                    {item.product && (
                      <>
                        <div className="w-20 h-20 relative flex-shrink-0">
                          <Image
                            src={item.product.image1 || "/images/placeholder.png"}
                            alt={item.product.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.product.title}
                          </h3>
                          {item.filters && Object.keys(item.filters).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1 mb-2">
                              {Object.entries(item.filters).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                >
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-lg font-bold text-orange-600">
                            ${parseFloat(item.product.price).toFixed(2)} each
                          </p>
                          <p className="text-sm text-gray-500">
                            Subtotal: ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(item.cartId)}
                            disabled={removing === item.cartId}
                            className="text-red-600 hover:text-red-700"
                          >
                            {removing === item.cartId ? "Removing..." : "Remove"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Checkout */}
            <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping (US)</span>
                  <span>$100.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(total + 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/shipping">
                  <Button
                    disabled={cartItems.length === 0}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
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
