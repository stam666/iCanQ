import { Server } from "http";
import { Server as SocketIO, Socket } from "socket.io";
import Order from "../models/order.model";
import { IOrderItem } from "../../../shared/common/interfaces/orderTypes";

interface CustomSocket extends Socket {
  userId: string;
}

let io: SocketIO = null;

const configureSocket = async (server: Server) => {
  io = new SocketIO(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket: CustomSocket, next) => {
    socket.userId = Array.isArray(socket.handshake.query.userId)
      ? socket.handshake.query.userId[0]
      : socket.handshake.query.userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`Socket: ${socket.id} connected`);

    socket.on("open", async (userId: string) => {
      console.log(`User:${userId} connect to Socket:${socket.id}`);
      socket.join(userId);
      const orders = await Order.find({ userId: userId });
      socket.emit("orders", orders);
    });

    socket.on("disconnect", () => {
      console.log(`Socket: ${socket.id} disconnected`);
    });
  });
};

const triggerUpdateOrder = async (order: IOrderItem) => {
  try {
    const orders = await Order.find({ userId: order.userId });
    await io.to(order.userId).emit("orders", orders);
    console.log("Order emitted successfully");
  } catch (error) {
    console.error("Error emitting order:", error);
  }
};

export const SocketsService = {
  configureSocket: configureSocket,
  triggerUpdateOrder: triggerUpdateOrder,
};
