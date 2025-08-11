import { getOrdersByUserId } from "@/lib/actions/order.actions";
import { UserOrders } from "@/components/orders/UserOrders";
import { UserOrder } from '@/lib/types';
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OrdersPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getOrdersByUserId();

  const validOrders = (result.data?.filter(order => order.status && order.status !== 'FAILED') || []) as UserOrder[];

  if (!result.success) {
    return <p className="text-destructive text-center py-12">{result.message}</p>;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Your Orders</h1>
      <UserOrders orders={validOrders} />
    </main>
      <Footer />
    </>
  );
};

export default OrdersPage;
