"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import ImageUploader from "./ImageUploader";
import type { Product } from "@/database/schema";
import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";
import { productFormSchema, type ProductFormValues } from "@/lib/validators/product";

interface ProductFormProps {
  product?: Product;
}

const ProductForm = ({ product }: ProductFormProps) => {
  const [isPending, startTransition] = useTransition();

  // Calculate default images
  const defaultImages: string[] = [];
  if (product) {
    if (product.image1) defaultImages.push(product.image1);
    if (product.image2) defaultImages.push(product.image2);
    if (product.image3) defaultImages.push(product.image3);
    if (product.image4) defaultImages.push(product.image4);
  }
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product ? parseFloat(product.price) : 0,
      category: product?.category || "",
      images: defaultImages,
      isFeatured: product?.isFeatured || false,
      isBanner: product?.isBanner || false,
      filters: product?.filters as any[] || [],
    },
  });

  // Watch the images field for debugging
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "filters",
  });

  const onSubmit = (values: ProductFormValues) => {
    startTransition(async () => {
      if (product) {
        // Update product
        const result = await updateProduct(product.id, values);
        if (result?.errors) {
          toast.error(result.message);
        } else {
          toast.success("Product updated successfully!");
        }
      } else {
        // Create product
        const result = await createProduct(values);
        if (result?.errors) {
          toast.error(result.message);
        } else {
          toast.success("Product created successfully!");
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Product title" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product description" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="9.99" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Toys, Books" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUploader 
                  value={field.value || []} 
                  onChange={(newImages) => {
                    console.log('🔄 ProductForm - onChange called with:', newImages);
                    console.log('📊 Current field value:', field.value);
                    console.log('✅ Setting new field value:', newImages);
                    field.onChange(newImages);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-8">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isBanner"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Banner</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium">Filters</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 p-2 border rounded-md">
              <FormField
                control={form.control}
                name={`filters.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Filter Name (e.g., Size)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`filters.${index}.options`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Options (comma-separated)" {...field} value={Array.isArray(field.value) ? field.value.join(',') : ''} onChange={(e) => field.onChange(e.target.value.split(','))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ name: "", options: [] })}
          >
            Add Filter
          </Button>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? (product ? 'Updating...' : 'Saving...') : (product ? 'Update Product' : 'Save Product')}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
