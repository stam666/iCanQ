// import { Router } from "express";
import express from "express";
import { OrderController } from "./controllers/order.controller";
import { UserMiddleware } from "../users/middleware/user.middleware";
import mongoose from "mongoose";

// const orderRouter = Router();
require("dotenv").config({
  path: "../../../../config.env",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.ORDER_SERVICE_PORT || 8004;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB on " + mongoUrl);

app
  .get("/", OrderController.getOrders)
  .get("/:id", UserMiddleware.protect, OrderController.getOrder)
  .post("/", UserMiddleware.protect, OrderController.addOrder)
  .put("/:id", UserMiddleware.protect, OrderController.updateOrder)
  .delete("/:id", UserMiddleware.protect, OrderController.removeOrder);

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Order service is running at https://localhost:${PORT}`
  );
});
