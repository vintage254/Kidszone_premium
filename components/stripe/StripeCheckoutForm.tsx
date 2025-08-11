"use client";

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface StripeCheckoutFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  clientSecret,
  amount,
  currency,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Billing address state
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    address: {
      line1: "",
      city: "",
      postal_code: "",
      country: "US",
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: billingDetails,
          },
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "An error occurred");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setSuccess(true);
        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push("/checkout/success");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setBillingDetails((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setBillingDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-2xl mb-4">✓</div>
        <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
        <p className="text-gray-600">
          Thank you for your purchase. You will be redirected shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={billingDetails.name}
            onChange={handleInputChange}
            required
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={billingDetails.email}
            onChange={handleInputChange}
            required
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address.line1">Address</Label>
        <Input
          id="address.line1"
          name="address.line1"
          type="text"
          value={billingDetails.address.line1}
          onChange={handleInputChange}
          required
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="address.city">City</Label>
          <Input
            id="address.city"
            name="address.city"
            type="text"
            value={billingDetails.address.city}
            onChange={handleInputChange}
            required
            placeholder="New York"
          />
        </div>
        <div>
          <Label htmlFor="address.postal_code">ZIP Code</Label>
          <Input
            id="address.postal_code"
            name="address.postal_code"
            type="text"
            value={billingDetails.address.postal_code}
            onChange={handleInputChange}
            required
            placeholder="10001"
          />
        </div>
        <div>
          <Label htmlFor="address.country">Country</Label>
          <Input
            id="address.country"
            name="address.country"
            type="text"
            value={billingDetails.address.country}
            onChange={handleInputChange}
            required
            placeholder="US"
          />
        </div>
      </div>

      <div>
        <Label>Payment Information</Label>
        <div className="border rounded-md p-3 mt-2">
          <PaymentElement />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total Amount:</span>
          <span>
            {currency}{amount.toFixed(2)}
          </span>
        </div>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
        >
          {processing ? "Processing..." : `Pay ${currency}${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

export default StripeCheckoutForm;
