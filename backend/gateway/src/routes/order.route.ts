import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

//customer routes
router.get("/", OrderController.getAllOrder);
router.get("/:orderId", OrderController.getOrder);
router.get("/myorders", AuthMiddleware.protect, OrderController.getMyOrders);
router.post("/", AuthMiddleware.protect, OrderController.placeOrder);
router.patch(
  "/cancel/:orderId",
  AuthMiddleware.protect,
  OrderController.cancelOrder
);

// restaurant routes
router.get(
  "/restaurant",
  AuthMiddleware.protect,
  AuthMiddleware.authorize("restaurant"),
  OrderController.getRestaurantOrders
);
router.patch(
  "/restaurant/status/:orderId",
  AuthMiddleware.protect,
  AuthMiddleware.authorize("restaurant"),
  OrderController.updateOrderStatus
);

router.get("/", OrderController.getAllOrder);
router.get("/:orderId", OrderController.getOrder);
router.get("/myorders", AuthMiddleware.protect, OrderController.getMyOrders);
router.post("/", AuthMiddleware.protect, OrderController.placeOrder);
router.patch("/cancel/:orderId", AuthMiddleware.protect, OrderController.cancelOrder);

export const OrderRouter = router;
