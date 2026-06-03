import { Router } from "express";
import { adminOnly, authMiddleware } from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  createProductController,
  deleteProductController,
  getProductController,
  listProductsController,
  updateProductController
} from "./products.controller";
import { createProductSchema, updateProductSchema } from "./products.schemas";

export const productsRouter = Router();

productsRouter.get("/", listProductsController);
productsRouter.get("/:id", getProductController);
productsRouter.post("/", authMiddleware, adminOnly, validateBody(createProductSchema), createProductController);
productsRouter.put("/:id", authMiddleware, adminOnly, validateBody(updateProductSchema), updateProductController);
productsRouter.delete("/:id", authMiddleware, adminOnly, deleteProductController);
