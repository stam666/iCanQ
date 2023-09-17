import express from 'express';
import { Server } from 'http';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
import mongoose from 'mongoose';
import userRouter from '../rest/users/route';
import client from "./grpc-cilent/order.client";
// const client = require("./grpc-cilent/order.client");

dotenv.config();

let connection: Server;

const startGateway = async (): Promise<AddressInfo> => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const mongoUrl =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/testDB';

  mongoose.connect(mongoUrl);
  app.use((req, res, next) => {
    // maybe authenticate in gateway
    next();
  });

  // mock proxy userService
  app.use('/users', userRouter);
	// test gRPC
	app.get("/", (req, res) => {
		client.getAllOrder(null, (err: any, data: any) => {
			if (!err) {
				res.render("menu", {
					results: data.menu
				});
			}
		});
	});

  const port = process.env.PORT || 8080;
  connection = app.listen(port, () => {});
  const APIAdress = connection.address() as AddressInfo;
  return APIAdress;
};

export { startGateway };
