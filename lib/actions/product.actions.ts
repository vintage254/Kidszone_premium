"use server";

import { productFormSchema, type ProductFormValues } from "@/lib/validators/product";
import { db } from "@/database/drizzle";
import { products } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



export async function createProduct(values: ProductFormValues) {

  const validatedFields = productFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error: Please check the form fields.",
    };
  }

  try {
    const { images, price, isFeatured, isBanner, ...rest } = validatedFields.data;
    await db.insert(products).values({
      ...rest,
      price: String(price),
      image1: images[0] || "",
      image2: images[1] || "",
      image3: images[2] || "",
      image4: images[3] || "",
      isFeatured: isFeatured || false,
      isBanner: isBanner || false,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Product.",
    };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function getProducts() {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return {
      success: true,
      data: allProducts,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: "Database Error: Failed to fetch products.",
    };
  }
}

export async function updateProduct(productId: string, values: ProductFormValues) {
  const validatedFields = productFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error: Please check the form fields.",
    };
  }

  try {
    const { images, price, isFeatured, isBanner, ...rest } = validatedFields.data;
    await db.update(products).set({
      ...rest,
      price: String(price),
      image1: images[0] || "",
      image2: images[1] || "",
      image3: images[2] || "",
      image4: images[3] || "",
      isFeatured: isFeatured || false,
      isBanner: isBanner || false,
    }).where(eq(products.id, productId));
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Update Product.",
    };
  }

  revalidatePath(`/admin/products`);
  revalidatePath(`/admin/products/${productId}/edit`);
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  try {
    await db.delete(products).where(eq(products.id, productId));

    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully." };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: "Database Error: Failed to delete product.",
    };
  }
}

export async function getBannerProducts() {
  try {
    const bannerProducts = await db.select().from(products).where(eq(products.isBanner, true)).orderBy(desc(products.createdAt));
    return {
      success: true,
      data: bannerProducts,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: "Database Error: Failed to fetch banner products.",
    };
  }
}

export async function getFeaturedProducts() {
  try {
    const featuredProducts = await db.select().from(products).where(eq(products.isFeatured, true)).orderBy(desc(products.createdAt));
    return {
      success: true,
      data: featuredProducts,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: "Database Error: Failed to fetch featured products.",
    };
  }
}

export async function getProductById(productId: string) {
  try {
    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);

    if (product.length === 0) {
      return { success: false, message: "Product not found." };
    }

    return { success: true, data: product[0] };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database Error: Failed to fetch product." };
  }
}
