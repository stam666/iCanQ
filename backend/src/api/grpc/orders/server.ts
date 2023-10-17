const mongoose = require("mongoose");
import { OrderController } from "./controllers/order.controller";
const PROTO_PATH = "./src/shared/proto/order.proto";

// Change dotenv path
require("dotenv").config({
  path: "./config.env",
});

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
  getAllOrder: OrderController.getAllOrder,
  get: OrderController.get,
  insert: OrderController.insert,
  update: OrderController.update,
  remove: OrderController.remove,
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
