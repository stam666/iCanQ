import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import { IOrderItem, IOrderList } from "../grpc/orders/orderTypes";
import mongoose from "mongoose";
import userRouter from "../rest/users/route";
import restaurantRouter from "../rest/restaurants/route";
import client from "./grpc-client/order.client";
import { ServerErrorResponse } from "@grpc/grpc-js";
import menuRouter from "../rest/menus/route";

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

  // mock proxy userService
  app.use("/users", userRouter);
  app.use("/restaurants", restaurantRouter);
  //mock proxy menuService
  app.use("/menu", menuRouter)

  // test gRPC
  app.get("/", (req: express.Request, res: express.Response) => {
    client.getAllOrder(null, (err: ServerErrorResponse, data: IOrderList) => {
      if (!err) {
        console.log(data);
        res.send(data);
      } else {
        console.log(err);
      }
    });
  });

  //get One Order
  app.get("/getOrder/:id", (req: express.Request, res: express.Response) => {
    client.get(
      { orderId: req.params.id },
      (err: ServerErrorResponse, data: IOrderItem) => {
        if (!err) {
          console.log(data);
          res.send(data);
        } else {
          if (err.details === "Not found") {
            res.status(404).send("Order Not Found : " + req.params.id);
          } else {
            res.status(500).send("Failed to get Order : " + req.params.id);
          }
        }
      }
    );
  });

  //add Order
  app.post("/addOrder", (req: express.Request, res: express.Response) => {
    let newOrderItem = {
      orderId: req.body.orderId,
      userId: req.body.userId,
      restaurantId: req.body.restaurantId,
      queueNumber: req.body.queueNumber,
      orderLines: req.body.orderLines,
      orderStatus: req.body.orderStatus,
      totalPrice: req.body.totalPrice,
    };
    client.insert(
      newOrderItem,
      (err: ServerErrorResponse, data: IOrderItem) => {
        if (!err) {
          console.log("New Order created successfully", data.orderId);
          res.send("New Order created successfully : " + data.orderId);
        } else {
          if (err.details === "Insert error") {
            res.status(500).send("Failed to create new Order");
          }
        }
      }
    );
  });

  // Update Order
  app.put("/updateOrder/:id", (req: any, res: any) => {
    const orderId = req.params.id;

    // Create an object with the updated order data based on the request body
    const updatedOrderItem = {
      orderId,
      userId: req.body.userId,
      restaurantId: req.body.restaurantId,
      queueNumber: req.body.queueNumber,
      orderLines: req.body.orderLines,
      orderStatus: req.body.orderStatus,
      totalPrice: req.body.totalPrice,
    };

    console.log(updatedOrderItem);

    client.update(
      updatedOrderItem,
      (err: ServerErrorResponse, data: IOrderItem) => {
        if (!err) {
          console.log("Order updated successfully", data.orderId);
          res.send("Order updated successfully : " + data.orderId);
        } else {
          if (err.details === "Not found") {
            res.status(404).send("Order Not Found : " + orderId);
          } else {
            res.status(500).send("Failed to update Order : " + orderId);
          }
        }
      }
    );
  });

  // remove Order
  app.post(
    "/removeOrder/:id",
    (req: express.Request, res: express.Response) => {
      client.remove(
        { orderId: req.params.id },
        (err: ServerErrorResponse, _: any) => {
          if (!err) {
            console.log("orderItem removed successfully", req.params.id);
            res.send("Order Delete Succesfully");
          } else {
            if (err.details === "Not found") {
              res.status(404).send("Order Not Found : " + req.params.id);
            } else {
              res.status(500).send("Failed to remove Order");
              console.log(err);
            }
          }
        }
      );
    }
  );

  const port = process.env.PORT || 8080;
  connection = app.listen(port, () => {});
  const APIAdress = connection.address() as AddressInfo;
  return APIAdress;
};

export { startGateway };
