import { Server } from "http";
import { Server as SocketIO } from "socket.io";
import { IOrder } from "../resources/interfaces/order.type";
import { AuthMiddleware, AuthSocket } from "../middlewares/auth.middleware";

let io: SocketIO = null;

const configureSocket = async (server: Server) => {
  io = new SocketIO(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket: AuthSocket, next) => {
    AuthMiddleware.authSocket(socket, next);
  });

  io.on("connection", (socket: AuthSocket) => {
    console.log(`Socket: ${socket.room} connected`);

    socket.on("open", async () => {
      console.log(`User:${socket.room} connect to Socket:${socket.room}`);
      socket.join(socket.room);
    });

    socket.on("disconnect", () => {
      console.log(`Socket: ${socket.room} disconnected`);
    });
  });
};

const triggerOrderCreatedToRestaurant = async (order: IOrder) => {
  try {
    const { restaurantId } = order;
    await io
      .to(restaurantId)
      .emit("new-order", { order });
    console.log("Order emitted successfully");
  } catch (error) {
    console.error("Error emitting order:", error);
  }
};

const triggerOrderUpdatedToCustomer = async (order: IOrder) => {
  try {
    const { userId } = order;
    await io
      .to(userId)
      .emit("update-order", { order });
    console.log("Order emitted successfully");
  } catch (error) {
    console.error("Error emitting order:", error);
  }
}

export const SocketsService = {
  configureSocket: configureSocket,
  triggerOrderCreatedToRestaurant: triggerOrderCreatedToRestaurant,
  triggerOrderUpdatedToCustomer: triggerOrderUpdatedToCustomer
};
