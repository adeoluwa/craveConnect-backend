import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import { stream } from "./logger";
import Exception from "./ExceptionHandler";
import HttpStatusCode from "../helpers/HttpsResponse";
import globalErrorHandler from "../helpers/globalErrorHandler";

export function setGlobalMiddlewares(app: express.Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(morgan("combined", { stream: stream }));
  app.use(express.static(path.join(__dirname, "../../public")));
}

export function setRoutes(app: express.Application) {
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Crave Connect Backend Api" });
  });
}

export function setGlobalErrorHandler(app: express.Application) {
  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    return next(
      new Exception("Route not found", HttpStatusCode.HTTP_NOT_FOUND, {
        message:
          "The route you are looking for has ben moved or does not exist",
      })
    );
  });

  app.use(globalErrorHandler);
}
