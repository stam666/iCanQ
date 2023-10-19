export interface IRestaurant {
  _id: string;
  userId: string;
  restaurantName: string;
  restaurantInfo: string;
  openStatus: boolean;
  menu: Array<string>;
}
