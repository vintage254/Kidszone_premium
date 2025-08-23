"use client";

import { useTransition } from "react";
import { ShimmerButton } from "@/components/ui/shimmerbutton";
import { addToCart } from "@/lib/actions/order.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  productId: string;
  product?: any;
  selectedFilters?: Record<string, string>;
}

export const BuyNowButton = ({ productId, product, selectedFilters }: BuyNowButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBuyNow = () => {
    // Validate filters if product has filters
    if (product?.filters && Array.isArray(product.filters)) {
      for (const filter of product.filters) {
        if (!selectedFilters?.[filter.name]) {
          toast.error(`Please select a ${filter.name} before purchasing`);
          return;
        }
      }
    }

    startTransition(async () => {
      try {
        // Create checkout session directly for this product
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            cartItems: [{ 
              productId: productId, 
              quantity: 1 
            }] 
          }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
          toast.success("Redirecting to checkout...");
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else {
          toast.error(data.error || 'Failed to create checkout session');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error('An error occurred during checkout');
      }
    });
  };

  return (
    <ShimmerButton
      onClick={handleBuyNow}
      disabled={isPending}
      className="w-full py-3 text-white font-medium"
      background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      shimmerColor="#ffffff"
      shimmerDuration={isPending ? "1s" : "3s"}
    >
      {isPending ? "Processing..." : "Buy Now"}
    </ShimmerButton>
  );
};
