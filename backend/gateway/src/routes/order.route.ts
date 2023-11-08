import express from "express";
import { OrderController } from "../controllers/order.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", AuthMiddleware.protect, OrderController.getMyOrders);

export const OrderRouter = router;
