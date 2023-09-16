const mongoose = require('mongoose');
const  Order = require("./models/order.model");
// import path from "../../../config/protos/order.proto"
const PROTO_PATH = "../../../config/protos/order.proto";

require("dotenv").config({ path: '.env' });
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/testDB');

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

var orderProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(orderProto.OrderService.service, {
	getAll: async (call: any, callback: any) => {
		const menu = await Order.find();
		callback(null, { menu });
	},
	get: async (call: any, callback: any) => {
		const order = await Order.findById(call.request.id);

		if (order) {
			callback(null, order);
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not found"
			});
		}
	},
	insert: async (call: any, callback: any) => {
		const order = await Order.create(call.request);
		callback(null, order);
	},
	update: async (call: any, callback: any) => {
		const { id, ...body } = call.request;
		const order = await Order.findByIdAndUpdate(id, body, { new: true });

		if (order) {
			callback(null, order);
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not Found"
			});
		}
	},
	remove: async (call: any, callback: any) => {
		const order = await Order.findByIdAndDelete(call.request.id);

		if (order) {
			callback(null, {});
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "NOT Found"
			});
		}
	}
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();