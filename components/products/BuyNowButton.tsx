"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/actions/stripe.actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

interface BuyNowButtonProps {
  productId: string;
}

export const BuyNowButton = ({ productId }: BuyNowButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleBuyNow = () => {
    startTransition(async () => {
      const result = await createCheckoutSession(productId);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Button onClick={handleBuyNow} disabled={isPending} size="lg" className="w-full">
      {isPending ? "Processing..." : "Buy Now"}
    </Button>
  );
};
