import { notFound } from "../../lib/errors";
import { prisma } from "../../lib/prisma";
import { resolveProductImage } from "../images/image-provider.service";
import type { ListProductsQuery, CreateProductInput, UpdateProductInput } from "./products.schemas";

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

const categoryKeywords = {
  Hogar: ["lámpara", "lampara", "cerámica", "ceramica", "manta", "hogar", "mesa"],
  Cocina: ["café", "cafe", "tetera", "cocina", "jarra", "servicio"],
  Tecnología: ["altavoz", "audio", "inalámbrico", "inalambrico", "cargador"],
  Bolsos: ["bolso", "tote", "viaje", "lona"]
};

const textSearch = (value: string) => ({
  OR: [
    { name: { contains: value, mode: "insensitive" as const } },
    { description: { contains: value, mode: "insensitive" as const } }
  ]
});

const categorySearch = (category: ListProductsQuery["category"]) => {
  if (category === "Todos") return undefined;

  const keywords = categoryKeywords[category];
  return { OR: keywords.flatMap((keyword) => [
    { name: { contains: keyword, mode: "insensitive" as const } },
    { description: { contains: keyword, mode: "insensitive" as const } }
  ]) };
};

export const listProducts = async ({ search, category, sort }: ListProductsQuery) => {
  const filters = [search ? textSearch(search) : undefined, categorySearch(category)].filter((filter) => filter !== undefined);
  const orderBy = sort === "price-asc" ? { price: "asc" as const } : sort === "price-desc" ? { price: "desc" as const } : sort === "stock" ? { stock: "desc" as const } : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where: filters.length > 0 ? { AND: filters } : undefined,
    orderBy
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
