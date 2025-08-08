import React from 'react';
import Link from "next/link";
import { getProducts } from "@/lib/actions/product.actions";
import ProductCard from "./ProductCard";

const HomeProducts = async () => {
  // Fetch all products for the homepage
  const result = await getProducts();

  if (!result.success || !result.data) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-destructive">Could not load products.</p>
      </section>
    );
  }

  const { data: products } = result;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Popular Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
      {/* This can be a simple link now */}
      <div className="text-center mt-12">
        <Link href="/products">
          <span className="px-12 py-3 border rounded-md text-gray-600 hover:bg-gray-100 transition font-semibold">
            See All Products
          </span>
        </Link>
      </div>
    </section>
  );
};

export default HomeProducts;