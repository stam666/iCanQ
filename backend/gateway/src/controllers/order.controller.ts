import { ServerErrorResponse } from "@grpc/grpc-js";
import { OrderClient } from "../clients/order.client";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { IOrderList } from "../resources/interfaces/order.type";

const getMyOrders = async (req: AuthenticatedRequest, res) => {
  const userId = req.user._id;
  OrderClient.getByFilter(
    { userId },
    (err: ServerErrorResponse, data: IOrderList) => {
      if (!err) {
        console.log(data);
        res.send(data);
      } else {
        console.log(err);
      }
    }
  );
};

export const OrderController = {
  getMyOrders,
};