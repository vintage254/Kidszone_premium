"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EditOrderModal } from "./EditOrderModal";

// Define a type for the joined order data
export type OrderData = {
  orderId: string;
  productTitle: string | null;
  customerEmail: string | null;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";
  trackingNumber: string | null;
  createdAt: string | null;
  price: string | null;
};

interface OrdersTableProps {
  orders: OrderData[];
}

const getStatusVariant = (status: OrderData['status']) => {
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

export const OrdersTable = ({ orders }: OrdersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tracking</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell className="font-medium">{order.orderId.slice(0, 8)}...</TableCell>
              <TableCell>{order.productTitle}</TableCell>
              <TableCell>{order.customerEmail}</TableCell>
              <TableCell>${order.price}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell>{order.trackingNumber || "N/A"}</TableCell>
              <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="text-right">
                <EditOrderModal order={order} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No orders found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
