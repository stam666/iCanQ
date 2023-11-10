const PROTO_PATH = "./src/resources/order.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const GRPC_HOST = process.env.GRPC_HOST || "localhost";
const GRPC_PORT = process.env.GRPC_PORT || 30043;
const GRPC_URL = `${GRPC_HOST}:${GRPC_PORT}`;
const GRPC_URI = process.env.GRPC_URI || "localhost:30043";

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var orderService = grpc.loadPackageDefinition(packageDefinition).OrderService;

const client = new orderService(GRPC_URI, grpc.credentials.createInsecure());
console.log(`⚡️[server]: grpc is running at ${GRPC_URI}`);

export const OrderClient = client;
