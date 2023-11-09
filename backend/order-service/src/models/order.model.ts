import mongoose, { Schema } from "mongoose";
import { IOrder, IOrderItem, OrderStatus } from "../resources/interfaces/order.type";

const orderItemsSchema = new Schema<IOrderItem>({
  menuId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  note: { type: String, default: ""},
});

const orderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  orderItems: { type: [orderItemsSchema], required: true },
  status: { type: String, required: true, enum: Object.values(OrderStatus) },
  totalPrice: { type: Number, required: true },
  pickupTime: { type: Date, required: true, default: Date.now },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
