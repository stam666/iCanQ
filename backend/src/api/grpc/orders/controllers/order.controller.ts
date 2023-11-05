import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import {
  IOrderItem,
  IOrderList,
  ISingleOrderRequest,
  Queue,
} from '../../../../shared/common/interfaces/orderTypes';
import Order from '../models/order.model';
import mongoose from 'mongoose';
import { MqService } from '../services/mq.service';

var grpc = require('@grpc/grpc-js');

require('dotenv').config({
  path: './config.env',
});

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/testDB');
console.log('Connected to MongoDB on ' + process.env.MONGO_URL);

// GET All Order -> This service needs to be fixed.
// getAllOrder: async (_: any, callback: any) => {
//   const orders = await Order.find();

//   const response = orders.map((order) => ({
//     userId: order.userId,
//     restaurantId: order.restaurantId,
//     queueNumber: order.queueNumber,
//     orderLines: order.orderLines,
//     orderStatus: order.orderStatus,
//     totalPrice: order.totalPrice,
//   }));
//   console.log(response);
//   callback(null, { response });
// },

const getAllOrder = async (_: any, callback: sendUnaryData<IOrderList>) => {
  try {
    const orderDocs = await Order.find();
    const orders = orderDocs.map((order) => ({
      ...order.toObject(),
      orderId: order._id.toString(),
      createdTime: order.createdTime,
      pickupTime: order.pickupTime,
    }));
    callback(null, { orders });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: 'Internal Server Error',
    });
  }
};

const get = async (
  call: ServerUnaryCall<ISingleOrderRequest, IOrderItem>,
  callback: sendUnaryData<IOrderItem>
) => {
  const order = await Order.findById(
    new mongoose.Types.ObjectId(call.request.orderId)
  );

  if (order) {
    callback(null, {
      ...order.toObject(),
      orderId: order._id.toString(),
      createdTime: order.createdTime,
      pickupTime: order.pickupTime,
    });
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Not found',
    });
  }
};

// Create Order
const insert = async (
  call: ServerUnaryCall<IOrderItem, IOrderItem>,
  callback: sendUnaryData<IOrderItem>
) => {
  const now = new Date();
  const newOrderItem = new Order({
    userId: call.request.userId,
    restaurantId: call.request.restaurantId,
    createdTime: now,
    pickupTime: now,
    queueNumber: call.request.queueNumber ?? 0,
    orderLines: call.request.orderLines,
    orderStatus: call.request.orderStatus ?? "Pending",
    totalPrice: call.request.totalPrice ?? 100,
  });
  try {
    const result = await newOrderItem.save();
    MqService.publishOrder(result, Queue.CREATE);
    console.log(result);
    callback(null, { ...call.request, orderId: result._id.toString() });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      details: 'Insert Error',
    });
  }
};

// Update an order
const update = async (
  call: ServerUnaryCall<IOrderItem, IOrderItem>,
  callback: sendUnaryData<IOrderItem>
) => {
  const orderId = call.request.orderId;
  const updatedData = call.request;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updatedData },
      { new: true }
    );

    if (updatedOrder) {
      // Convert updatedOrder to IOrderItem format
      const updatedOrderItem: IOrderItem = {
        orderId: updatedOrder._id.toString(),
        userId: updatedOrder.userId,
        restaurantId: updatedOrder.restaurantId,
        queueNumber: updatedOrder.queueNumber,
        orderLines: updatedOrder.orderLines as any, // Type assertion to map format
        orderStatus: updatedOrder.orderStatus,
        totalPrice: updatedOrder.totalPrice,
        createdTime: updatedOrder.createdTime,
        pickupTime: updatedOrder.pickupTime,
      };

      callback(null, updatedOrderItem);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Not found',
      });
    }
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: 'Internal Server Error',
    });
  }
};

// Remove an order
const remove = async (
  call: ServerUnaryCall<ISingleOrderRequest, any>,
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
      details: 'Not found',
    });
  }
};

export const OrderController = {
  getAllOrder,
  get,
  insert,
  update,
  remove,
};
