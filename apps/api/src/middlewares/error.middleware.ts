import type { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { ApiError } from "../lib/errors";

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message, errors: error.errors });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }))
    });
    return;
  }

  if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
    res.status(409).json({ message: "A record with this value already exists" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};
