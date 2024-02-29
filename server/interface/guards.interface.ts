import { Request, Response, NextFunction } from "express";

export interface RouteGuards {
  authenticate: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}
