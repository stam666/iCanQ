import { RequestHandler } from "express";
import Restaurant from "../models/restaurant.model";
import axios from "axios";

async function getUserId(req: any) {
  const config = {
    headers: {
      Authorization: req.headers.authorization,
    },
  };

  const response = await axios.get(
    `http://localhost:${process.env.PORT}/users/auth/me`,
    config,
  );
  const userId = response.data.data._id;
  return userId;
}
const getRestaurantByUserId: RequestHandler = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      res.status(400).json({
        success: false,
        data: "Missing user ID",
      });
      return;
    }

    const restaurant = await Restaurant.findOne({ userId: userId });
    if (!restaurant) {
      res.status(404).json({
        success: false,
        data: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
  }
};
const getAllRestaurants: RequestHandler = async (req, res) => {
  try {
    const allRestaurants = await Restaurant.find();

    if (allRestaurants.length === 0) {
      res.status(404).json({
        success: false,
        data: "No restaurant found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: allRestaurants,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
  }
};

const createRestaurant: RequestHandler = async (req, res) => {
  try {
    const { userId, restaurantName, restaurantInfo, openStatus } = req.body;
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
    console.log(error);
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
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
      { new: true },
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
    const restaurantId = req.query.id;

    if (!restaurantId) {
      res.status(400).json({
        success: false,
        data: "Missing restaurant ID",
      });
      return;
    }
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
      { new: true },
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

const fetchMenuData = async (menuId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:${process.env.PORT}/menu/${menuId}`,
    );

    if (response.status === 400) {
      return null;
    }

    return {
      menuId: response.data.data.id,
      name: response.data.data.name,
      price: response.data.data.price,
    };
  } catch (error) {
    console.log(error);
    console.error(`Error fetching data for ID ${menuId}: ${error.message}`);
    return null;
  }
};

const getAllRestaurantMenu: RequestHandler = async (req, res) => {
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
    const menuList = restaurant.menu;
    const results = [];
    Promise.all(menuList.map((menuId) => fetchMenuData(menuId)))
      .then((menuData) => {
        // Filter out any null values which indicate errors
        const validMenuData = menuData.filter((data) => data !== null);
        results.push(...validMenuData);

        console.log(results);
        res.status(200).json({
          success: true,
          data: results,
        });
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
        res.status(500).json({
          success: false,
          data: "Something went wrong",
        });
        return;
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
  }
};

const updateMenuToRestaurant: RequestHandler = async (req, res) => {
  try {
    const isCreate = req.query.isCreate;
    const restaurantId = req.query.restaurantId;
    const menuId = req.body.menuId;
    console.log(isCreate);
    if (
      isCreate === undefined ||
      restaurantId === undefined ||
      menuId === undefined
    ) {
      res.status(400).json({
        success: false,
        data: "Missing required field",
      });
      return;
    }
    if (isCreate === "true") {
      const updateRestaurantMenu = await Restaurant.findOneAndUpdate(
        { _id: restaurantId },
        { $push: { menu: menuId } },
        { new: true },
      ).catch((err) => {
        console.error("Error:", err);
      });

      console.log(updateRestaurantMenu);
      if (!updateRestaurantMenu) {
        res
          .status(400)
          .json({ success: false, message: "cannot find the restaurant" });
      }
      res.status(200).json({ success: true, data: updateRestaurantMenu });
    } else {
      console.log("delete", menuId);
      const updateRestaurantMenu = await Restaurant.findOneAndUpdate(
        { _id: restaurantId },
        { $pull: { menu: menuId } },
        { new: true },
      ).catch((err) => {
        console.error("Error:", err);
      });

      console.log(updateRestaurantMenu);
      if (!updateRestaurantMenu) {
        res
          .status(400)
          .json({ success: false, message: "cannot find the restaurant" });
      }
      res.status(200).json({ success: true, data: updateRestaurantMenu });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
  }
};
export default getUserId;
export const RestaurantController = {
  getAllRestaurants,
  createRestaurant,
  editRestaurantInfo,
  getRestaurantStatus,
  setRestaurantStatus,
  getAllRestaurantMenu,
  getRestaurantByUserId,
  updateMenuToRestaurant,
};
