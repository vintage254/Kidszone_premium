import StatCard from "@/components/admin/StatCard";
import { getAdminDashboardStats } from "@/lib/admin/actions/stats";
import { Package, ShoppingCart, CreditCard, Truck } from 'lucide-react';

const AdminDashboardPage = async () => {
  const result = await getAdminDashboardStats();

  if (!result.success || !result.data) {
    return <p className="text-destructive">{result.error || 'Error loading dashboard data.'}</p>;
  }

  const { totalProducts, totalOrders, paidOrders, deliveredOrders } = result.data;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">E-commerce Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={totalProducts} icon={Package} />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCart} />
        <StatCard title="Paid Orders" value={paidOrders} icon={CreditCard} />
        <StatCard title="Delivered Orders" value={deliveredOrders} icon={Truck} />
      </div>
    </section>
  );
};

export default AdminDashboardPage;
