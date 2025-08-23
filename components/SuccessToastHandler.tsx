"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export const SuccessToastHandler = () => {
  useEffect(() => {
    toast.success("Payment successful! Your order has been placed.", {
      duration: 5000,
    });
  }, []);

  return null;
};
