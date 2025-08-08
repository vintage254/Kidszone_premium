import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/actions/product.actions";

interface EditProductPageProps {
  params: { id: string };
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const result = await getProductById(params.id);

  if (!result.success) {
    return <p className="text-destructive">{result.message}</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <ProductForm product={result.data} />
    </section>
  );
};

export default EditProductPage;
