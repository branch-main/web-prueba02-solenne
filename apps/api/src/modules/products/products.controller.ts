import type { Request, Response } from "express";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "./products.service";

const parseId = (value: string | string[] | undefined) => Number.parseInt(Array.isArray(value) ? value[0] : value || "", 10);

export const listProductsController = async (req: Request, res: Response) => {
  const products = await listProducts(typeof req.query.search === "string" ? req.query.search : undefined);
  res.json({ products });
};

export const getProductController = async (req: Request, res: Response) => {
  const product = await getProduct(parseId(req.params.id));
  res.json({ product });
};

export const createProductController = async (req: Request, res: Response) => {
  const product = await createProduct(req.body);
  res.status(201).json({ product });
};

export const updateProductController = async (req: Request, res: Response) => {
  const product = await updateProduct(parseId(req.params.id), req.body);
  res.json({ product });
};

export const deleteProductController = async (req: Request, res: Response) => {
  await deleteProduct(parseId(req.params.id));
  res.status(204).send();
};
