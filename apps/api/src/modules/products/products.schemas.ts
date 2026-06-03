import { z } from "zod";

const baseProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.union([z.url(), z.literal("")]).optional().transform((value) => value || undefined)
});

export const productCategorySchema = z.enum(["Todos", "Hogar", "Cocina", "Tecnología", "Bolsos"]);
export const productSortSchema = z.enum(["featured", "price-asc", "price-desc", "stock"]);
export const listProductsQuerySchema = z.object({
  search: z.string().trim().optional().transform((value) => value || undefined),
  category: productCategorySchema.optional().default("Todos"),
  sort: productSortSchema.optional().default("featured")
});
export const createProductSchema = baseProductSchema;
export const updateProductSchema = baseProductSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
