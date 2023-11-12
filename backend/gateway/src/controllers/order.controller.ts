import { ServerErrorResponse } from "@grpc/grpc-js";
import { OrderClient } from "../clients/order.client";
import {
  AuthenticatedRequest,
  RestaurantRequest,
} from "../middlewares/auth.middleware";
import {
  IOrder,
  IOrderList,
  OrderStatus,
} from "../resources/interfaces/order.type";
import { Request, Response } from "express";
import { RestaurantService } from "../services/restaurant.service";

const getAllOrder = async (req: Request, res: Response) => {
  OrderClient.getAllOrder({}, (err: ServerErrorResponse, data: IOrderList) => {
    if (!err) {
      console.log(data);
      res.status(200).json(data);
    } else {
      res.status(500).json({ message: "Error getting orders" });
    }
  });
};

const getOrder = async (req: Request, res: Response) => {
  OrderClient.get(
    { orderId: req.params.orderId },
    (err: ServerErrorResponse, data: IOrder) => {
      if (!err) {
        console.log(data);
        res.status(200).json(data);
      } else {
        res.status(500).json({ message: "Error getting order" });
      }
    }
  );
};

const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  OrderClient.getByFilter(
    { userId },
    (err: ServerErrorResponse, data: IOrderList) => {
      if (!err) {
        console.log(data);
        res.status(200).json(data);
      } else {
        res.status(500).json({ message: "Error getting orders" });
      }
    }
  );
};

const placeOrder = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { restaurantId, orderItems } = req.body;
  const orderRequest: IOrder = {
    userId,
    restaurantId,
    orderItems,
  };

  OrderClient.insert(orderRequest, (err: ServerErrorResponse, data: IOrder) => {
    if (!err) {
      console.log(data);
      res.status(201).json(data);
    } else {
      res.status(500).json({ message: "Error placing order" });
    }
  });
};

const getRestaurantOrders = async (req: RestaurantRequest, res: Response) => {
  const restaurantId = req.restaurant._id;
  OrderClient.getByFilter(
    { restaurantId },
    (err: ServerErrorResponse, data: IOrderList) => {
      if (!err) {
        console.log(data);
        res.status(200).json(data);
      } else {
        res.status(500).json({ message: "Error getting orders" });
      }
    }
  );
};

const cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  OrderClient.get({ orderId }, (err: ServerErrorResponse, order: IOrder) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching order" });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel order" });
    }

    OrderClient.update(
      { ...order, status: OrderStatus.Cancelled },
      (err: ServerErrorResponse, data: IOrder) => {
        if (!err) {
          console.log(data);
          res.status(200).json(data);
        } else {
          res.status(500).json({ message: "Error cancelling order" });
        }
      }
    );
  });
};

const updateOrderStatus = (req: RestaurantRequest, res: Response) => {
  const { orderId } = req.params;
  const { restaurant } = req;

  OrderClient.get({ orderId }, (err: ServerErrorResponse, order: IOrder) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching order" });
    }

    if (order.restaurantId !== restaurant._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update order status" });
    }

    const status: OrderStatus = req.body.status;
    OrderClient.update(
      { ...order, status },
      (err: ServerErrorResponse, updatedOrder: IOrder) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error updating order status" });
        } else {
          return res.status(200).json(updatedOrder);
        }
      }
    );
  });
};

export const OrderController = {
  getOrder,
  getAllOrder,
  getMyOrders,
  placeOrder,
  cancelOrder,
  getRestaurantOrders,
  updateOrderStatus,
};
