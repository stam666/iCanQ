import express from "express";
import { RestaurantController } from "./controllers/restaurant.controller";
import mongoose from "mongoose";

require("dotenv").config({
  path: "../../../../config.env",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.RESTAURANT_SERVICE_PORT || 8002;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB on " + mongoUrl);

app
  .patch("/:id", RestaurantController.editRestaurantInfo)
  .patch("/setRestaurantStatus/:id", RestaurantController.setRestaurantStatus)
  .get("/getRestaurantStatus", RestaurantController.getRestaurantStatus)
  .get("/getAllRestaurantMenu/:id", RestaurantController.getAllRestaurantMenu)
  .get("/getRestaurant", RestaurantController.getRestaurantByUserId)
  .post("/updateMenu", RestaurantController.updateMenuToRestaurant);
app
  .post("/", RestaurantController.createRestaurant)
  .get("/", RestaurantController.getAllRestaurants);

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Restaurant service is running at https://localhost:${PORT}`
  );
});
