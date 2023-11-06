import express from "express";
import cors from "cors";
import { Server, createServer } from "http";
import { AddressInfo } from "net";
import mongoose from "mongoose";
// import userRouter from "../rest/users/route";

const { createProxyMiddleware } = require("http-proxy-middleware");
import { MqService } from "./services/mq.service";
import { SocketsService } from "./services/socket.service";
import { Queue } from "../../shared/common/interfaces/orderTypes";
import reviewRouter from "../rest/reviews/route";

require("dotenv").config({
  path: "./config.env",
});

const startGateway = async (): Promise<AddressInfo> => {
  const app = express();
  const httpServer: Server = createServer(app);
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";

  await mongoose.connect(mongoUrl);
  console.log("Connected to MongoDB on " + mongoUrl);

  await MqService.amqpConnect();
  await SocketsService.configureSocket(httpServer);
  MqService.assertAndConsumeQueue(Queue.CREATE);

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // USER SERVICE
  app.use(
    "/users",
    createProxyMiddleware({
      target: `${process.env.USER_SERVICE_URI}`,
      pathRewrite: {
        "^/users": "",
      },
    })
  );
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

  // ORDER SERVICE
  const orderServiceProxy = createProxyMiddleware({
    target: `${process.env.ORDER_SERVICE_URI}`,
    changeOrigin: true,
    pathRewrite: {
      "^/order": "",
    },
  });

  app.use("/order", orderServiceProxy);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const port = process.env.PORT || 8000;
  httpServer.listen(port, () => {});
  const APIAdress = httpServer.address() as AddressInfo;
  return APIAdress;
};
export { startGateway };
