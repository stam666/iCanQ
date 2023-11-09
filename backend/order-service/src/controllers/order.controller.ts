import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";

import Order from "../models/order.model";
import mongoose from "mongoose";
import { MqService } from "../services/mq.service";
import {
  IOrder,
  IOrderFilter,
  IOrderId,
  IOrderList,
  OrderStatus,
  Queue,
} from "../resources/interfaces/order.type";

var grpc = require("@grpc/grpc-js");

const getAllOrder = async (_: any, callback: sendUnaryData<IOrderList>) => {
  try {
    const orderDocs = await Order.find();
    const orders = orderDocs.map((order) => ({
      ...order.toObject(),
    }));
    callback(null, { orders });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: `Internal Server Error: ${err.message}`,
    });
  }
};

const get = async (
  call: ServerUnaryCall<IOrderId, IOrder>,
  callback: sendUnaryData<IOrder>
) => {
  const order = await Order.findById(
    new mongoose.Types.ObjectId(call.request.orderId)
  );

  if (order) {
    callback(null, {
      ...order.toObject(),
    });
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Not found",
    });
  }
};

const getByFilter = async (
  call: ServerUnaryCall<IOrderFilter, IOrderList>,
  callback: sendUnaryData<IOrderList>
) => {
  const filter = call.request;
  try {
    const orderDocs = await Order.find(filter);
    const orders = orderDocs.map((order) => ({
      ...order.toObject(),
    }));
    callback(null, { orders });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: `Internal Server Error: ${err.message}`,
    });
  }
};

// Create Order
const insert = async (
  call: ServerUnaryCall<IOrder, IOrder>,
  callback: sendUnaryData<IOrder>
) => {
  const now = new Date();
  const totalPrice = call.request.orderItems.reduce(
    (total, item) => total + item.price * item.amount,
    0
  );
  const newOrderItem = new Order({
    userId: call.request.userId,
    restaurantId: call.request.restaurantId,
    orderItems: call.request.orderItems,
    status: OrderStatus.Pending,
    totalPrice: totalPrice,
    pickupTime: call.request.pickupTime ?? now,
  });
  try {
    const result = await newOrderItem.save();
    MqService.publishOrder(result, Queue.CREATE);
    console.log(result);
    callback(null, { ...result.toObject() });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: `Internal Server Error: ${err.message}`,
    });
  }
};

// Update an order
const update = async (
  call: ServerUnaryCall<IOrder, IOrder>,
  callback: sendUnaryData<IOrder>
) => {
  try {
    const orderId = call.request._id;
    const updatedData = call.request;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updatedData },
      { new: true }
    );
    if (updatedOrder) {
      callback(null, { ...updatedOrder.toObject() });
      MqService.publishOrder(updatedOrder, Queue.UPDATE);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: `Internal Server Error: ${err.message}`,
    });
  }
};

// Remove an order
const remove = async (
  call: ServerUnaryCall<IOrderId, any>,
  callback: sendUnaryData<any>
) => {
  const existingOrderItem = await Order.findById(
    new mongoose.Types.ObjectId(call.request.orderId)
  );
  if (existingOrderItem) {
    await existingOrderItem.deleteOne();
    callback(null, {});
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Not found",
    });
  }
};

export const OrderController = {
  getAllOrder,
  get,
  getByFilter,
  insert,
  update,
  remove,
};
