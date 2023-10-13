import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRestaurant extends Document {
  restaurantId: string;
  userId: string;
  restaurantName: string;
  restaurantInfo: string;
  openStatus: boolean;
  menu: Array<string>;
}

const restaurantSchema: Schema<IRestaurant> = new Schema<IRestaurant>({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: "User",
  },
  restaurantName: {
    type: String,
    required: true,
    unique: true,
  },
  restaurantInfo: {
    type: String,
    required: true,
  },
  openStatus: {
    type: Boolean,
    required: true,
  },
  menu: {
    type: [String],
  },
});

const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>(
  "Restaurant",
  restaurantSchema
);
export default Restaurant;
