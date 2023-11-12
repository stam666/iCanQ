export interface IOrderItem {
  orderId?: string;
  userId: string;
  restaurantId: string;
  createdTime?: Date;
  pickupTime?: Date;
  queueNumber?: number;
  orderLines: Map<string, number>;
  orderStatus?: string;
  totalPrice?: number;
}
export interface ISingleOrderRequest {
  orderId: string;
}

export interface IOrderList {
  orders: IOrderItem[];
}

export enum Queue {
  CREATE = "order.create",
  UPDATE = "order.update",
}
