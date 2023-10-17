import { Router } from "express";
import { OrderController } from "./order.controller";
import { UserMiddleware } from "../users/middleware/user.middleware";

const orderRouter = Router();

orderRouter
    .get("/", OrderController.getOrders)
    .get("/:id", UserMiddleware.protect, OrderController.getOrder)
    .post("/", UserMiddleware.protect, OrderController.addOrder)
    .put("/:id", UserMiddleware.protect, OrderController.updateOrder)
    .delete("/:id", UserMiddleware.protect, OrderController.removeOrder);

export default orderRouter;