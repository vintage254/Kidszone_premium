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
    case 'FAILED':
      return 'destructive';
    case 'FAILED':
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
        <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">Order #{order.orderId.slice(-8)}</h3>
                <p className="text-sm text-muted-foreground">
                  Ordered on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
            </div>
            
            {/* Order Items */}
            <div className="space-y-4 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image 
                      src={item.productImage || '/images/placeholder.png'} 
                      alt={item.productTitle}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{item.productTitle}</h4>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium">${parseFloat(item.price).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold">Total: ${parseFloat(order.total).toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Tracking:</strong> {order.trackingNumber || 'Not available yet'}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
