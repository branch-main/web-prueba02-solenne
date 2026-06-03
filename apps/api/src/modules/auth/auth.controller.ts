import type { Request, Response } from "express";
import { getCurrentUser, login } from "./auth.service";

export const loginController = async (req: Request, res: Response) => {
  const result = await login(req.body);
  res.json(result);
};

export const meController = async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.id);
  res.json({ user });
};
