import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { Log } from "logging_middleware";

export async function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await Log(
    "backend",
    "info",
    "express-server",
    `${req.method} ${req.originalUrl}`
  );

  next();
}