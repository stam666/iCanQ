import { RequestHandler } from "express";
import axios from "axios";
import client from "../order.client";
import { ServerErrorResponse } from "@grpc/grpc-js";
import { IOrderItem } from "../../../../shared/common/interfaces/orderTypes";
import { RequestCustom } from "../../users/middleware/user.middleware";

const getOrders: RequestHandler = async (req, res) => {
  client.getAllOrder(null, (err: ServerErrorResponse, data: IOrderItem[]) => {
    if (!err) {
      console.log(data);
      res.send(data);
    } else {
      console.log(err);
    }
  });
};

const getOrder: RequestHandler = async (req, res) => {
  const orderId = req.params.id;

  client.get({ orderId }, (err: ServerErrorResponse, data: IOrderItem) => {
    if (!err) {
      console.log(data);
      res.send(data);
    } else {
      if (err.details === "Not found") {
        res.status(404).send("Order Not Found : " + orderId);
      } else {
        res.status(500).send("Failed to get Order : " + orderId);
      }
    }
  });
};

const addOrder: RequestHandler = async (req: RequestCustom, res) => {
  const userId = req.user.id;
  const orderDetails = req.body as IOrderItem;

  const totalPrice = req.body.orderLines.reduce(
    (total: number, orderLine: Map<string, number>) => {
      return (
        total +
        orderLine.get("quantity")! * orderLine.get("price")! * (1 - 0.1)
      );
    },
    0
  );

  let newOrderItem = {
    userId,
    restaurantId: req.body.restaurantId,
    queueNumber: req.body.queueNumber,
    orderLines: req.body.orderLines,
    orderStatus: "Pending",
    totalPrice,
  } as IOrderItem;

  client.insert(newOrderItem, (err: ServerErrorResponse, data: IOrderItem) => {
    if (!err) {
      console.log("New Order created successfully", data.orderId);
      res.send("New Order created successfully : " + data.orderId);
    } else {
      if (err.details === "Insert error") {
        res.status(500).send("Failed to create new Order");
      }
    }
  });
};

const updateOrder: RequestHandler = async (req, res) => {
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
};

const removeOrder: RequestHandler = async (req, res) => {
  const orderId = req.params.id;

  client.remove({ orderId }, (err: ServerErrorResponse, _: any) => {
    if (!err) {
      console.log("Order removed successfully", orderId);
      res.send("Order Delete Succesfully");
    } else {
      if (err.details === "Not found") {
        res.status(404).send("Order Not Found : " + orderId);
      } else {
        res.status(500).send("Failed to remove Order");
        console.log(err);
      }
    }
  });
};

export const OrderController = {
  getOrders,
  getOrder,
  addOrder,
  updateOrder,
  removeOrder,
};
