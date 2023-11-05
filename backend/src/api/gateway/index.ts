import express from "express";
import { Server, createServer } from "http";
import { AddressInfo } from "net";
import mongoose from "mongoose";
import userRouter from "../rest/users/route";
import restaurantRouter from "../rest/restaurants/route";
import menuRouter from "../rest/menus/route";
import orderRouter from "../rest/orders/route";
import cors from "cors";
import { MqService } from "./services/mq.service";
import { SocketsService } from "./services/socket.service";
import { Queue } from "../../shared/common/interfaces/orderTypes";

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

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors(
    {
      origin: 'http://localhost:3000',
      credentials: true
    }
  ))

  app.use("/users", userRouter);
  app.use("/restaurants", restaurantRouter);
  app.use("/menu", menuRouter)
  app.use("/order", orderRouter)
  
  const port = process.env.PORT || 8000;
  httpServer.listen(port, () => {});
  const APIAdress = httpServer.address() as AddressInfo;
  return APIAdress;
};

export { startGateway };
