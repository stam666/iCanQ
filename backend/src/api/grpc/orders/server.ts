const mongoose = require("mongoose");
import Order from "./models/order.model";
const PROTO_PATH = "../../../config/protos/order.proto";

// Change dotenv path
require("dotenv").config({
  path: "../../../config.env",
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
  // GET All Order -> This service is needed to be fixed.
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
  get: async (call: any, callback: any) => {
    const order = await Order.findById(
      new mongoose.Types.ObjectId(call.request.orderId)
    );

    if (order) {
      callback(null, {
        ...order.toObject(),
        orderId: order._id.toString(),
        createdTime: order.createdTime.toString(),
        pickupTime: order.pickupTime.toString(),
      });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  // Create Order
  insert: async (call: any, callback: any) => {
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
  //   update: async (call: any, callback: any) => {
  //     const { id, ...body } = call.request;
  //     const order = await Order.findByIdAndUpdate(id, body, { new: true });

  //     if (order) {
  //       callback(null, order);
  //     } else {
  //       callback({
  //         code: grpc.status.NOT_FOUND,
  //         details: "Not Found",
  //       });
  //     }
  //   },
  remove: async (call: any, callback: any) => {
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
