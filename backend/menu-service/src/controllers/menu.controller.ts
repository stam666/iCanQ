import { connect } from "@planetscale/database";
import { RequestHandler } from "express";
import axios from "axios";
import mongoose from "mongoose";

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};
const conn = connect(config);
console.log("Connected to PlanetscaleDB on " + config.host);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/testDB";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB on " + mongoUrl);

async function addMenuToRestaurant(
  isCreate: boolean,
  restaurantId: string,
  menuId: string,
) {
  try {
    await axios.post(
      `${process.env.GATEWAY_URI}/restaurants/updateMenu`,
      // await axios.post(
      //   `http://localhost:8002/createMenu`,
      {
        menuId: menuId,
      },
      {
        params: {
          isCreate: isCreate,
          restaurantId: restaurantId,
        },
      },
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

const getMenu: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await conn.execute("SELECT * FROM menus WHERE id = ? ", [id]);
    if (menu.rows.length == 0) {
      return res.status(400).json({ success: false });
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
    console.log(error);
    res.status(400).json({});
  }
};

const createMenu: RequestHandler = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const { name, price } = req.body;
    const isCreate = true;
    const createdMenu = await conn.execute(
      "INSERT INTO menus (name, price) VALUES (?, ?)",
      [name, price],
    );
    const menuId = createdMenu.insertId;

    const isAddSuccess = await addMenuToRestaurant(
      isCreate,
      restaurantId,
      menuId,
    );
    if (!isAddSuccess) {
      return res
        .status(400)
        .json({ success: false, message: "cannot find the restaurant" });
    }
    res.status(200).json({ success: true, data: createdMenu.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

const updateMenu: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { price } = req.body;
    const result = await conn.execute(
      "UPDATE menus SET price = ? WHERE id = ?",
      [price, id],
    );
    if (result.rowsAffected == 0) {
      return res
        .status(400)
        .json({ success: false, message: "cannot find the menu" });
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
    const isCreate = false;
    const result = await conn.execute("DELETE FROM menus WHERE id = ?", [id]);
    if (result.rowsAffected == 0) {
      return res
        .status(400)
        .json({ success: false, message: "cannot find the menu" });
    }

    const isDeleteSuccess = await addMenuToRestaurant(
      isCreate,
      restaurantId,
      id,
    );

    if (!isDeleteSuccess) {
      return res
        .status(400)
        .json({ success: false, message: "cannot find the restaurant" });
    }
    res.status(200).json({ success: true });
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
