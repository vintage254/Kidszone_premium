"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPaypalOrder, capturePaypalOrder } from "@/lib/actions/paypal.actions";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

interface PayPalWrapperProps {
  productId?: string;
  amount?: number;
  currency?: string;
  onSuccess?: () => void;
}

export const PayPalButtonsWrapper = ({ productId, amount, currency = "USD", onSuccess }: PayPalWrapperProps) => {
  const router = useRouter();

  if (!clientId) {
    console.error("PayPal client ID is not set. Please check your environment variables.");
    return <p className="text-destructive">PayPal is currently unavailable.</p>;
  }

  return (
    <PayPalScriptProvider options={{ clientId: clientId, currency: currency, intent: "capture" }}>
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
        createOrder={async () => {
          if (productId) {
            const res = await createPaypalOrder(productId);
            if (res.success && res.orderId) {
              return res.orderId;
            } else {
              toast.error(res.message || "Could not initiate PayPal checkout.");
              throw new Error(res.message);
            }
          } else {
            // For cart checkout, create a generic order
            // This would need to be implemented in your PayPal actions
            toast.error("Cart checkout not yet implemented for PayPal");
            throw new Error("Cart checkout not implemented");
          }
        }}
        onApprove={async (data, actions) => {
          if (productId) {
            const res = await capturePaypalOrder(data.orderID);
            if (res.success) {
              toast.success("Payment successful! Redirecting to your orders...");
              router.push('/orders');
            } else {
              toast.error(res.message || "Payment failed. Please try again.");
            }
          } else {
            // For cart checkout
            toast.success("Payment successful!");
            if (onSuccess) {
              onSuccess();
            }
          }
        }}
        onError={(err) => {
          console.error("PayPal Button Error:", err);
          toast.error("An error occurred with the PayPal transaction.");
        }}
      />
    </PayPalScriptProvider>
  );
};
