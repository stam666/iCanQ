import mongoose, { Schema, Document } from 'mongoose';

// Define the Order interface
interface IOrder extends Document {
  orderId: string;
  userId: string;
  restaurantId: string;
  createdTime: Date;
  pickupTime: Date;
  queueNumber: number;
  orderLines: Record<string, number>; // dict of menuId: amount
  orderStatus: string;
  totalPrice: number;
}

// Create the Mongoose schema for the Order
const orderSchema = new Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  createdTime: { type: Date, required: true },
  pickupTime: { type: Date, required: true },
  queueNumber: { type: Number, required: true },
  orderLines: { type: Object, required: true },
  orderStatus: { type: String, required: true },
  totalPrice: { type: Number, required: true },
});

// Create and export the Order model
const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
