import { getOrdersByUserId } from "@/lib/actions/order.actions";
import { UserOrders } from "@/components/orders/UserOrders";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const OrdersPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const result = await getOrdersByUserId();

  if (!result.success) {
    return <p className="text-destructive text-center py-12">{result.message}</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Your Orders</h1>
      <UserOrders orders={result.data} />
    </main>
  );
};

export default OrdersPage;
