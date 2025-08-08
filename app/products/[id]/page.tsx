import { getProductById } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BuyNowButton } from "@/components/products/BuyNowButton";
import { PayPalButtonsWrapper } from "@/components/products/PayPalButtonsWrapper";

interface ProductPageProps {
  params: { id: string };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const result = await getProductById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const { data: product } = result;
  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean) as string[];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
            <Image 
              src={images[0] || '/images/placeholder.png'} 
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1).map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <Image 
                  src={img} 
                  alt={`${product.title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{product.title}</h1>
          <p className="text-2xl font-bold text-primary mb-6">${product.price}</p>
          <p className="text-base text-gray-700 mb-8">{product.description}</p>
          
          <div className="space-y-4">
            <BuyNowButton productId={product.id} />
            <div className="relative text-center my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <span className="relative bg-background px-2 text-xs uppercase text-muted-foreground">Or pay with</span>
            </div>
            <PayPalButtonsWrapper productId={product.id} />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            <p className="text-gray-600">{product.category}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
