import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../lib/errors";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    next(new ApiError(401, "Missing authorization token"));
    return;
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthUser;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired authorization token"));
  }
};

export const adminOnly = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    next(new ApiError(403, "Admin access required"));
    return;
  }

  next();
};
