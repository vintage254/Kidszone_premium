import { db } from "@/database/drizzle";
import { products, orders } from "@/database/schema";
import { count, eq } from "drizzle-orm";

export async function getAdminDashboardStats() {
  try {
    const productCount = await db.select({ value: count() }).from(products);
    const orderCount = await db.select({ value: count() }).from(orders);
    const paidOrdersCount = await db.select({ value: count() }).from(orders).where(eq(orders.status, 'PAID'));
    const deliveredOrdersCount = await db.select({ value: count() }).from(orders).where(eq(orders.status, 'DELIVERED'));

    return {
      success: true,
      data: {
        totalProducts: productCount[0].value,
        totalOrders: orderCount[0].value,
        paidOrders: paidOrdersCount[0].value,
        deliveredOrders: deliveredOrdersCount[0].value,
      },
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return {
      success: false,
      error: "Failed to load dashboard data.",
    };
  }
}
