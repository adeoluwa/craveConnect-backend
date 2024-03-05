import "reflect-metadata";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import fs from "fs";

import logger from "./utils/logger";
import {
  setGlobalErrorHandler,
  setGlobalMiddlewares,
  setRoutes,
} from "./utils/serverUtils";

// Import controllers
import UserController from "./controllers/UserController/user.controller";
import FoodController from "./controllers/FoodController/food.controller";
import VendorController from "./controllers/VendorController/vendor.controller";
import AdminController from "./controllers/AdminController/admin.controller";

process.env.Tz = "Africa/Lagos";

class Kernel {
  app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.webhooks();

    this.mapControllersToRoutes([
      UserController,
      FoodController,
      VendorController,
      AdminController,
    ]);
    this.routes();
    this.errorHandler();
    this.databaseConnection();
  }

  middlewares() {
    setGlobalMiddlewares(this.app);
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.set("view engine", "ejs");
    this.app.use(express.json());

    this.app.set("PORT", process.env.PORT || 5000);
    this.app.set("NODE_ENV", process.env.NODE_ENV);
    // this.app.use(this.responseInterceptor);
  }

  webhooks() {}

  routes() {
    setRoutes(this.app);
    this.app.get("/", (req, res, next) =>
      res.status(200).json({
        message: "hello",
      })
    );
  }

  errorHandler() {
    setGlobalErrorHandler(this.app);
  }

  databaseConnection() {
    (async function () {
      try {
        await mongoose.connect(process.env.DB_URL!);
        logger.info("Database Module Connected");
      } catch (error) {
        logger.error("Database connection error: ", error);
      }
    })();
  }

  mapControllersToRoutes(controllers: any[]) {
    controllers.forEach((controller) => {
      const basePath = controller.prototype.basePath || "";
      const routes = controller.prototype.routes || [];

      routes.forEach((route: { path: string; method: string; key: any }) => {
        logger.info(
          `[${route.method}] ${basePath}${route.path} to ${controller.name}`
        );

        const middleware =
          controller.prototype.middleware?.[route.key] ||
          controller.prototype.middleware;

        const guards =
          controller.prototype.guards?.[route.key] || controller.guards;

        const handlers: any = [];

        if (guards) {
          const guardArray = Array.isArray(guards) ? guards : [guards];
          guardArray.forEach((guard: any) => {
            if (typeof guard.authenticate === "function") {
              handlers.push(
                guard.authenticate as (
                  req: Request,
                  res: Response,
                  next: NextFunction
                ) => void
              );
            } else {
              throw new Error(
                `Invalid guard in ${controller.name}.${route.key}. The guuard must have an 'authenticate' function.`
              );
            }
          });
        }

        if (middleware) {
          handlers.push(
            ...(Array.isArray(middleware)
              ? middleware
              : middleware !== undefined
              ? []
              : [middleware])
          );
        }

        if (controller.prototype.hasOwnProperty(route.key)) {
          handlers.push(
            controller.prototype[route.key].bind(controller.prototype) as (
              req: Request,
              res: Response,
              next: NextFunction
            ) => void
          );
        } else {
          logger.warn(
            `Method ${route.key} not found on ${controller.name}, skipping.`
          );
        }

        if (handlers.length > 0) {
          return (this.app as any)[route.method.toLowerCase()](
            `${basePath}${route.path}`,
            ...handlers.map((handler) => {
              return (req: Request, res: Response, next: NextFunction) => {
                return handler(req, res, next);
              };
            })
          );
        } else {
          logger.warn(
            `No middleware or handler found for ${route.method} ${basePath}${route.path} on ${controller.name}. Skipping.`
          );
        }
      });
    });
  }

  responseInterceptor(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;
    const originalSend = res.send;

    res.json = function (body: any) {
      body.timestamp = Date.now();

      return originalJson.call(this, body);
    };

    res.send = function (body: any) {
      if (typeof body === "object") {
        body.timestamp = Date.now();
        body.success = true;
      }

      return originalSend.call(this, body);
    };

    next();
  }
}

export default new Kernel().app;
