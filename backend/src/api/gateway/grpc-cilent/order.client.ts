const PROTO_PATH = "./src/config/protos/order.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var orderService = grpc.loadPackageDefinition(packageDefinition).OrderService;

const client = new orderService(
  "localhost:30043",
  grpc.credentials.createInsecure()
);

export default client;
