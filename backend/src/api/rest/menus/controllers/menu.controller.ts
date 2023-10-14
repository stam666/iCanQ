import { connect } from "@planetscale/database";
import { RequestHandler } from "express";
import Restaurant from "../../restaurants/models/restaurant.model";

require("dotenv").config({
  path: "./config.env",
});

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};
const conn = connect(config);

const getMenu: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await conn.execute("SELECT * FROM menus WHERE id = ? ", [id]);
    if (menu.rows.length == 0) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({
      success: true,
      data: menu.rows[0],
    });
  } catch (error) {
    res.status(400).json({});
  }
};

const getAllMenus: RequestHandler = async (req, res) => {
  try {
    const menus = await conn.execute("SELECT * FROM menus");
    res.status(200).json(menus.rows);
  } catch (error) {
    res.status(400).json({});
  }
};

const createMenu: RequestHandler = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const { name, price } = req.body;
    const createdMenu = await conn.execute(
      "INSERT INTO menus (name, price) VALUES (?, ?)",
      [name, price]
    );
    const menuId = createdMenu.insertId;

    const updateRestaurantMenu = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { menu: menuId } },
      { new: true }
    );
    console.log(updateRestaurantMenu);
    if (!updateRestaurantMenu) {
      res
        .status(400)
        .json({ success: false, message: "cannot find the restaurant" });
    }
    res.status(200).json({ success: true, data: createdMenu.rows[0] });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const updateMenu: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { price } = req.body;
    const result = await conn.execute(
      "UPDATE menus SET price = ? WHERE id = ?",
      [price, id]
    );
    if (result.rowsAffected == 0) {
      res.status(400).json({ success: false, message: "cannot find the menu" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const deleteMenu: RequestHandler = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const id = req.params.id;
    const result = await conn.execute("DELETE FROM menus WHERE id = ?", [id]);
    if (result.rowsAffected == 0) {
      res.status(400).json({ success: false, message: "cannot find the menu" });
    }
    const updateRestaurantMenu = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $pull: { menu: id } },
      { new: true }
    );

    if (!updateRestaurantMenu) {
      res
        .status(400)
        .json({ success: false, message: "cannot find the restaurant" });
    }
    res.status(200).json({ success: true, data: updateRestaurantMenu.menu });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

export const MenuController = {
  getMenu,
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
