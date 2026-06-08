import { defineField, defineType } from "sanity";
import { ShoppingBag } from "lucide-react";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: ShoppingBag,
  fields: [
    defineField({ 
      name: "name", 
      title: "Product Name", 
      type: "string", 
      validation: (r) => r.required() 
    }),
    defineField({ 
      name: "slug", 
      title: "Slug", 
      type: "slug", 
      options: { source: "name" }, 
      validation: (r) => r.required() 
    }),
    defineField({ 
      name: "price", 
      title: "Price (₹ INR)", 
      type: "number", 
      validation: (r) => r.min(0) 
    }),
    defineField({ 
      name: "description", 
      title: "Description", 
      type: "text", 
      rows: 4 
    }),
    defineField({
      name: "image", 
      title: "Product Image", 
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ 
      name: "inStock", 
      title: "In Stock", 
      type: "boolean", 
      initialValue: true 
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "image" },
  },
});
