import { Router } from "express";
import { RestaurantController } from "./controllers/restaurant.controller";
const restaurantRouter = Router();

restaurantRouter
  .patch("/updateRestaurantInfo/:id", RestaurantController.editRestaurantInfo)
  .patch("/setRestaurantStatus/:id", RestaurantController.setRestaurantStatus)
  .get("/getRestaurantStatus/:id", RestaurantController.getRestaurantStatus);
restaurantRouter.post(
  "/createRestaurant/",
  RestaurantController.createRestaurant
);

export default restaurantRouter;
