import { Document } from "mongoose";

export interface IOrderId {
  orderId: string;
}

export enum Queue {
  CREATE = "order.create",
  UPDATE = "order.update",
}

export enum OrderStatus {
  Pending = "pending",
  Preparing = "preparing",
  Ready = "ready",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface IOrderFilter {
  userId?: string;
  restaurantId?: string;
}

export interface IOrderList {
  orders: IOrder[];
}

export interface IOrderItem {
  menuId: string;
  name: string;
  price: number;
  amount: number;
  note: string;
}

export interface IOrder {
  _id?: string;
  userId?: string;
  restaurantId?: string;
  orderItems?: IOrderItem[];
  status?: OrderStatus;
  totalPrice?: number;
  pickupTime?: Date;
  createdTime?: Date;
  updatedTime?: Date;
}

