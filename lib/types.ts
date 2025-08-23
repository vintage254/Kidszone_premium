export interface Job {
  id: string;
  title: string;
  description: string;
  level: string;
  budget: string;
  isPublished: boolean;
  createdAt: Date;
  deadline: Date;
}

export type UserOrder = {
  orderId: string;
  status: "PAID" | "SHIPPED" | "DELIVERED" | "FAILED";
  trackingNumber: string | null;
  createdAt: Date | null;
  total: string;
  items: {
    productTitle: string;
    productImage: string | null;
    quantity: number;
    price: string;
  }[];
};

