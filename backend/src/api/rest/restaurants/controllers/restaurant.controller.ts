import { RequestHandler } from "express";
import Restaurant from "../models/restaurant.model";
import axios from "axios";

async function getUserId(req: any) {
  const config = {
    proxy: {
      host: process.env.HOST || "localhost",
      port: Number(process.env.PORT) || 8000,
    },
    headers: {
      Authorization: req.headers.authorization,
    },
  };
  const response = await axios.get(`/users/auth/me`, config);
  const userId = response.data.data._id;
  return userId;
}
const createRestaurant: RequestHandler = async (req, res) => {
  try {
    const { restaurantName, restaurantInfo, openStatus } = req.body;
    const userId = await getUserId(req);
    const menu = Array<string>();

    const newRestaurant = await Restaurant.create({
      userId: userId,
      restaurantName: restaurantName,
      restaurantInfo: restaurantInfo,
      openStatus: openStatus,
      menu: menu,
    });

    res.status(200).json({
      success: true,
      data: newRestaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
    console.log(error);
  }
};

const editRestaurantInfo: RequestHandler = async (req, res) => {
  try {
    const { restaurantInfo } = req.body;
    const restaurantOwner = await Restaurant.findById(req.params.id);
    const userId = await getUserId(req);
    console.log(userId);
    if (restaurantOwner.userId !== userId) {
      res.status(403).json({
        success: false,
        data: "You are not the owner of this restaurant",
      });
      return;
    }
    const updateRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        restaurantInfo: restaurantInfo,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: updateRestaurant,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
    console.log(err);
  }
};

const getRestaurantStatus: RequestHandler = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({
        success: false,
        data: "Restaurant not found",
      });
      return;
    }
    const status = restaurant.openStatus;

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
    console.log(err);
  }
};

const setRestaurantStatus: RequestHandler = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const setStatus = req.body.openStatus;

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      {
        openStatus: setStatus,
      },
      { new: true }
    );
    if (!restaurant) {
      res.status(404).json({
        success: false,
        data: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: restaurant.openStatus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
  }
};

export const RestaurantController = {
  createRestaurant,
  editRestaurantInfo,
  getRestaurantStatus,
  setRestaurantStatus,
};
