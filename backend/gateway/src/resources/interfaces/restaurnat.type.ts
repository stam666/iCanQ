import { Document } from "mongoose";

export interface IRestaurant extends Document {
  restaurantId: string;
  userId: string;
  restaurantName: string;
  restaurantInfo: string;
  openStatus: boolean;
  menu: Array<string>;
}
