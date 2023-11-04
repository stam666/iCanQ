import express from "express";
import cors from "cors";
import { Server } from "http";
import { AddressInfo } from "net";
// import userRouter from "../rest/users/route";

const { createProxyMiddleware } = require("http-proxy-middleware");

require("dotenv").config({
  path: "./config.env",
});
let connection: Server;

const startGateway = async (): Promise<AddressInfo> => {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );

  app.use((req, res, next) => {
    // maybe authenticate in gateway
    next();
  });

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
  const port = process.env.PORT || 8080;
  connection = app.listen(port, () => {});
  const APIAdress = connection.address() as AddressInfo;
  return APIAdress;
};
export { startGateway };
