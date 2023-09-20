const mongoose = require("mongoose");
import Order from "./models/order.model";
import { ISingleOrderRequest, IOrderItem } from "./orderTypes";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
const PROTO_PATH = "../../../config/protos/order.proto";

// Change dotenv path
require("dotenv").config({
  path: "../../../../config.env",
});

// Connect to MongoDB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/testDB");
console.log("Connected to MongoDB on " + process.env.MONGO_URL);

// Create gRPC server
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var orderProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// Add service to gRPC server
server.addService(orderProto.OrderService.service, {
  // GET All Order -> This service needs to be fixed.
  getAllOrder: async (_: any, callback: any) => {
    const orders = await Order.find();

    const response = orders.map((order) => ({
      userId: order.userId,
      restaurantId: order.restaurantId,
      queueNumber: order.queueNumber,
      orderLines: order.orderLines,
      orderStatus: order.orderStatus,
      totalPrice: order.totalPrice,
    }));
    console.log(response);
    callback(null, { response });
  },
  // GET One Order
  get: async (
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
        details: "Not found",
      });
    }
  },

  // Create Order
  insert: async (
    call: ServerUnaryCall<IOrderItem, IOrderItem>,
    callback: sendUnaryData<IOrderItem>
  ) => {
    const now = new Date();
    const newOrderItem = new Order({
      userId: call.request.userId,
      restaurantId: call.request.restaurantId,
      createdTime: now,
      pickupTime: now,
      queueNumber: call.request.queueNumber,
      orderLines: call.request.orderLines,
      orderStatus: call.request.orderStatus,
      totalPrice: call.request.totalPrice,
    });
    try {
      const result = await newOrderItem.save();
      console.log(result);
      callback(null, { ...call.request, orderId: result._id.toString() });
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Insert Error",
      });
    }
  },

  // Update an order
  update: async (
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
          details: "Not found",
        });
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Internal Server Error",
      });
    }
  },

  // Remove an order
  remove: async (
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
        details: "Not found",
      });
    }
  },
});
console.log(`Listening on localhost:30043`);
server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();

    console.log("server is running on 127.0.0.1:30043");
  }
);
