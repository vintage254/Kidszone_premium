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
  productTitle: string | null;
  productImage: string | null;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";
  trackingNumber: string | null;
  createdAt: string | null;
  price: string | null;
};

