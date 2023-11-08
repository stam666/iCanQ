const PROTO_PATH = "./src/resources/order.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const GRPC_HOST = process.env.GRPC_HOST || "localhost";
const GRPC_URL = `${GRPC_HOST}:30043`;

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var orderService = grpc.loadPackageDefinition(packageDefinition).OrderService;

const client = new orderService(GRPC_URL, grpc.credentials.createInsecure());
console.log(`⚡️[server]: grpc is running at ${GRPC_URL}`);

export const OrderClient = client;
