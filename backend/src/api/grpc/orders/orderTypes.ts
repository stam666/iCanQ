export interface IOrderItem {
  orderId: string;
  userId: string;
  restaurantId: string;
  createdTime: Date;
  pickupTime: Date;
  queueNumber: number;
  orderLines: Map<string, number>;
  orderStatus: string;
  totalPrice: number;
}
export interface ISingleOrderRequest {
  orderId: string;
}
