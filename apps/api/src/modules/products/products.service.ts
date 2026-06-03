import { notFound } from "../../lib/errors";
import { prisma } from "../../lib/prisma";
import { resolveProductImage } from "../images/image-provider.service";
import type { CreateProductInput, UpdateProductInput } from "./products.schemas";

const toProductResponse = (product: {
  id: number;
  name: string;
  description: string;
  price: { toString: () => string };
  stock: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  ...product,
  price: Number(product.price.toString())
});

export const listProducts = async (search?: string) => {
  const products = await prisma.product.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" }
  });

  return products.map(toProductResponse);
};

export const getProduct = async (id: number) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw notFound("Product");
  }

  return toProductResponse(product);
};

export const createProduct = async (input: CreateProductInput) => {
  const imageUrl = input.imageUrl || await resolveProductImage();
  const product = await prisma.product.create({ data: { ...input, imageUrl } });

  return toProductResponse(product);
};

export const updateProduct = async (id: number, input: UpdateProductInput) => {
  await getProduct(id);
  const product = await prisma.product.update({ where: { id }, data: input });

  return toProductResponse(product);
};

export const deleteProduct = async (id: number) => {
  await getProduct(id);
  await prisma.product.delete({ where: { id } });
};
