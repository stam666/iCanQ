const mongoose = require("mongoose");
import { OrderController } from "./controllers/order.controller";
import { MqService } from "./services/mq.service";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./src/shared/proto/order.proto";

require("dotenv").config({
  path: "./config.env",
});

const GRPC_HOST = process.env.GRPC_HOST || "localhost";
const GRPC_URL = `${GRPC_HOST}:30043`;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";

const startGrpcServer = async () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB on " + MONGO_URL);

  MqService.amqpConnect();

  var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
  });

  var orderProto = grpc.loadPackageDefinition(packageDefinition);

  const server = new grpc.Server();

  server.addService(orderProto.OrderService.service, {
    getAllOrder: OrderController.getAllOrder,
    getOrderByUserId: OrderController.getOrderByUserId,
    get: OrderController.get,
    insert: OrderController.insert,
    update: OrderController.update,
    remove: OrderController.remove,
  });

  server.bindAsync(GRPC_URL, grpc.ServerCredentials.createInsecure(), () => {
    server.start();

    console.log(`GRPC server is running on ${GRPC_URL}`);
  });
};

startGrpcServer();
