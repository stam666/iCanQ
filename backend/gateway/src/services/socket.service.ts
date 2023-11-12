import { Server } from "http";
import { Socket, Server as SocketIO } from "socket.io";
import { IOrder } from "../resources/interfaces/order.type";
import { AuthMiddleware } from "../middlewares/auth.middleware";

let io: SocketIO = null;

const configureSocket = async (server: Server) => {
  io = new SocketIO(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket: Socket, next) => {
    AuthMiddleware.authSocketThenJoinRoom(socket, next);
  });

  io.on("connection", (socket: Socket) => {
    socket.on("disconnect", () => {
      console.log(`Socket: ${socket.id} disconnected`);
    });
  });
};

const triggerOrderCreated = async (order: IOrder) => {
  try {
    const { restaurantId } = order;
    const restaurantRoom = `restaurant:${restaurantId}`;
    io.to(restaurantRoom).emit("orderCreated", order);
    console.log(`Order emitted to ${restaurantRoom} successfully`);
  } catch (error) {
    console.error("Error emitting order:", error);
  }
};

const triggerOrderUpdated = async (order: IOrder) => {
  try {
    const { userId, restaurantId } = order;
    const userRoom = `user:${userId}`;
    const restaurantRoom = `restaurant:${restaurantId}`;
    io.to(userRoom).to(restaurantRoom).emit("orderUpdated", order);
    console.log(
      `Order emitted to ${userRoom} and ${restaurantRoom} successfully`
    );
  } catch (error) {
    console.error("Error emitting order:", error);
  }
};

export const SocketsService = {
  configureSocket: configureSocket,
  triggerOrderCreated: triggerOrderCreated,
  triggerOrderUpdated: triggerOrderUpdated,
};
