import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import mongoose from "mongoose";
import userRouter from "../rest/users/route";
import restaurantRouter from "../rest/restaurants/route";
import menuRouter from "../rest/menus/route";
import orderRouter from "../rest/orders/route";

require("dotenv").config({
  path: "./config.env",
});

let connection: Server;

const startGateway = async (): Promise<AddressInfo> => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
  mongoose.connect(mongoUrl);
  console.log("Connected to MongoDB on " + mongoUrl);
  app.use((req, res, next) => {
    // maybe authenticate in gateway
    next();
  });

  app.use("/users", userRouter);
  app.use("/restaurants", restaurantRouter);
  app.use("/menu", menuRouter)
  app.use("/order", orderRouter)

  const port = process.env.PORT || 8080;
  connection = app.listen(port, () => {});
  const APIAdress = connection.address() as AddressInfo;
  return APIAdress;
};

export { startGateway };
