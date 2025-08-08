import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProducts } from "@/lib/actions/product.actions";
import ProductsTable from "@/components/admin/ProductsTable";

const AdminProductsPage = async () => {
  const result = await getProducts();

  if (!result.success) {
    return <p className="text-destructive">{result.message}</p>;
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>
      <ProductsTable products={result.data || []} />
    </section>
  );
};

export default AdminProductsPage;
