import { Router } from "express";
import { authMiddleware, adminOnly } from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import { loginController, meController } from "./auth.controller";
import { loginSchema } from "./auth.schemas";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), loginController);
authRouter.get("/me", authMiddleware, adminOnly, meController);
