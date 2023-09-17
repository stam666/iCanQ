import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import mongoose from "mongoose";
import userRouter from "../rest/users/route";
import client from "./grpc-cilent/order.client";

//Change dotenv path -> I have trouble with this. So, I use the absolute path instead.

require("dotenv").config({
  path: "/Users/yaninchaya/Desktop/SoftwareArch/iCanQ/backend/src/config.env",
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

  // test gRPC
  app.get("/", (req, res) => {
    client.getAllOrder(null, (err: any, data: any) => {
      if (!err) {
        console.log(data.orders);
        res.send(data.orders);
      } else {
        console.log(err);
      }
    });
  });

  //get One Order
  app.get("/getOrder/:id", (req, res) => {
    client.get({ orderId: req.params.id }, (err: any, data: any) => {
      if (!err) {
        console.log(data);
        res.send(data);
      } else {
        if (err.details === "Not found") {
          res.status(404).send("Order Not Found : " + req.params.id);
        }
        res.status(500).send("Failed to get Order : " + req.params.id);
      }
    });
  });

  //add Order
  app.post("/addOrder", (req, res) => {
    let newOrderItem = {
      orderId: req.body.orderId,
      userId: req.body.userId,
      restaurantId: req.body.restaurantId,
      queueNumber: req.body.queueNumber,
      orderLines: req.body.orderLines,
      orderStatus: req.body.orderStatus,
      totalPrice: req.body.totalPrice,
    };
    client.insert(newOrderItem, (err: any, data: any) => {
      if (!err) {
        console.log("New Order created successfully", data.orderId);
        res.send("New Order created successfully : " + data.orderId);
      } else {
        if (err.details === "Insert error") {
          res.status(500).send("Failed to create new Order");
        }
      }
    });
  });

  // remove Order
  app.post("/removeOrder/:id", (req, res) => {
    client.remove({ orderId: req.params.id }, (err: any, _: any) => {
      if (!err) {
        console.log("orderItem removed successfully", req.params.id);
        res.send("Order Delete Succesfully");
      } else {
        if (err.details === "Not found") {
          res.status(404).send("Order Not Found : " + req.params.id);
        }
        res.status(500).send("Failed to remove Order");
        console.log(err);
      }
    });
  });
  const port = process.env.PORT || 8080;
  connection = app.listen(port, () => {});
  const APIAdress = connection.address() as AddressInfo;
  return APIAdress;
};

export { startGateway };
