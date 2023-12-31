import express from "express";
require("dotenv").config({
  path: "../config.env",
});

import cors from "cors";
import { Server, createServer } from "http";
import { AddressInfo } from "net";
import mongoose from "mongoose";

const { createProxyMiddleware } = require("http-proxy-middleware");
import { MqService } from "./services/mq.service";

import { SocketsService } from "./services/socket.service";
import { OrderRouter } from "./routes/order.route";
import { ReviewRouter } from "./routes/review.route";
import { Queue } from "./resources/interfaces/order.type";

const startGateway = async () => {
  const app = express();
  const httpServer: Server = createServer(app);

  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
  mongoose.connect(mongoUrl);
  console.log("Connected to MongoDB on " + mongoUrl);

  await MqService.amqpConnect();
  SocketsService.configureSocket(httpServer);
  MqService.assertAndConsumeQueue(
    Queue.CREATE,
    SocketsService.triggerOrderCreated
  );
  MqService.assertAndConsumeQueue(
    Queue.UPDATE,
    SocketsService.triggerOrderUpdated
  );

  app.use(
    cors({
      origin: process.env.CLIENT_URI,
      credentials: true,
    })
  );

  // USER SERVICE
  const userProxy = createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URI}`,
    changeOrigin: true,
    pathRewrite: {
      "^/users": "",
    },
  });
  app.use("/users", userProxy);
  // app.use("/users", userRouter);

  /// RESTAURANT SERVICE
  const restaurantProxy = createProxyMiddleware({
    target: `${process.env.RESTAURANT_SERVICE_URI}`,
    changeOrigin: true,
    pathRewrite: {
      "^/restaurants": "",
    },
  });

  app.use("/restaurants", restaurantProxy);

  // MENU SERVICE
  const menuProxy = createProxyMiddleware({
    target: `${process.env.MENU_SERVICE_URI}`,
    changeOrigin: true,
    pathRewrite: {
      "^/menu": "",
    },
  });

  app.use("/menu", menuProxy);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ORDER SERVICE
  // const orderServiceProxy = createProxyMiddleware({
  //   target: `${process.env.ORDER_SERVICE_URI}`,
  //   changeOrigin: true,
  //   pathRewrite: {
  //     "^/order": "",
  //   },
  // });

  // app.use("/order", orderServiceProxy);
  app.use("/order", OrderRouter);

  /// REVIEW SERVICE
  // const reviewProxy = createProxyMiddleware({
  //   target: `${process.env.REVIEW_SERVICE_URI}`,
  //   changeOrigin: true,
  //   pathRewrite: {
  //     "^/reviews": "",
  //   },
  // });

  // app.use("/reviews", reviewProxy);
  app.use("/review", ReviewRouter);

  const PORT = process.env.PORT || 8000;
  httpServer.listen(PORT, () => {
    console.log(`⚡️[server]: Gateway is running at ${process.env.GATEWAY_URI}`);
  });
};

startGateway();
