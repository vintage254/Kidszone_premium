"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { UserOrder } from '@/lib/types';

interface UserOrdersProps {
  orders: UserOrder[];
}

const getStatusVariant = (status: UserOrder['status']) => {
  switch (status) {
    case 'PAID':
      return 'default';
    case 'SHIPPED':
      return 'secondary';
    case 'DELIVERED':
      return 'outline';
    case 'PENDING':
    default:
      return 'destructive';
  }
};

export const UserOrders = ({ orders }: UserOrdersProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">No Orders Found</h2>
        <p className="text-muted-foreground mt-2">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
          <div className="relative h-48 w-full md:h-auto md:w-48 flex-shrink-0">
            <Image 
              src={order.productImage || '/images/placeholder.png'} 
              alt={order.productTitle || 'Product Image'}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold mb-2">{order.productTitle}</h3>
              <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
            </div>
            <p className="text-lg font-bold text-primary mb-4">${order.price}</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Ordered On:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Tracking:</strong> {order.trackingNumber || 'Not available yet'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
