import { getOrders } from "@/lib/actions/order.actions";
import { OrdersTable } from "@/components/admin/OrdersTable";

const AdminOrdersPage = async () => {
  const result = await getOrders();

  if (!result.success) {
    return <p className="text-destructive">{result.message}</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Manage Orders</h1>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <OrdersTable orders={result.data} />
      </div>
    </section>
  );
};

export default AdminOrdersPage;
