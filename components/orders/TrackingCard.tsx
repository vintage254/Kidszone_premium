"use client";

import { CheckCircle, Clock, Truck, Package, XCircle } from "lucide-react";

export interface Order {
  orderId: string;
  productTitle: string;
  productImage: string | null;
  status: string;
  trackingNumber?: string | null;
  createdAt: string;
  price: string;
}

interface TrackingCardProps {
  order: Order;
  showFullTimeline?: boolean;
}

export const TrackingCard = ({ order, showFullTimeline = true }: TrackingCardProps) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PAID':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100',
          label: 'Payment Confirmed'
        };
      case 'SHIPPED':
        return {
          icon: Truck,
          color: 'text-blue-600 bg-blue-100',
          label: 'Shipped'
        };
      case 'DELIVERED':
        return {
          icon: Package,
          color: 'text-purple-600 bg-purple-100',
          label: 'Delivered'
        };
      case 'FAILED':
        return {
          icon: XCircle,
          color: 'text-red-600 bg-red-100',
          label: 'Failed'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600 bg-gray-100',
          label: 'Unknown'
        };
    }
  };

  const getTimelineSteps = (currentStatus: string) => {
    const allSteps = [
      { key: 'PAID', label: 'Payment Confirmed', description: 'Payment received successfully' },
      { key: 'SHIPPED', label: 'Order Shipped', description: 'Your order is on its way' },
      { key: 'DELIVERED', label: 'Delivered', description: 'Order delivered successfully' }
    ];

    const statusOrder = ['PAID', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const statusInfo = getStatusInfo(order.status);
  const timelineSteps = getTimelineSteps(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {order.productImage && (
            <img
              src={order.productImage}
              alt={order.productTitle}
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {order.productTitle}
            </h3>
            <p className="text-gray-600">${parseFloat(order.price).toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              Order ID: {order.orderId.slice(0, 8)}...
            </p>
            <p className="text-sm text-gray-500">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full ${statusInfo.color}`}>
          <StatusIcon className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{statusInfo.label}</span>
        </div>
      </div>

      {/* Tracking Number */}
      {order.trackingNumber && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">Tracking Number</p>
          <p className="text-blue-700 font-mono">{order.trackingNumber}</p>
        </div>
      )}

      {/* Timeline - Only show if requested */}
      {showFullTimeline && (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {timelineSteps.map((step, index) => (
              <div key={step.key} className="relative flex items-start">
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  step.completed 
                    ? 'bg-green-100 border-green-500' 
                    : step.active
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-100 border-gray-300'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : step.active ? (
                    <Clock className="w-6 h-6 text-blue-600" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  )}
                </div>
                <div className="ml-6 flex-1 min-w-0">
                  <h4 className={`text-base font-medium ${
                    step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm ${
                    step.completed || step.active ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                  {step.active && order.status === 'SHIPPED' && order.trackingNumber && (
                    <p className="text-sm text-blue-600 mt-1">
                      Processing complete - Order shipped with tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
