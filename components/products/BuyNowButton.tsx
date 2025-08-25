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
        // Add item to cart first
        const result = await addToCart(productId, 1, selectedFilters || {});
        
        if (result.success) {
          toast.success("Item added to cart!");
          // Redirect to shipping page instead of direct checkout
          router.push('/shipping');
        } else {
          toast.error(result.message || 'Failed to add item to cart');
        }
      } catch (error) {
        console.error('Buy now error:', error);
        toast.error('An error occurred while processing your request');
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
