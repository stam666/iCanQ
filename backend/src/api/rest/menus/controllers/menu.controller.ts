import { connect } from '@planetscale/database'
import { RequestHandler } from 'express';

require('dotenv').config()

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
}
const conn = connect(config)

const getMenu: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id
    const menu = await conn.execute('SELECT * FROM menus WHERE id = ? ', [id])
    if (menu.rows.length == 0) {
      res.status(400).json({ success: false })
    }
    res.status(200).json(menu.rows[0]);
  } catch (error) {
    res.status(400).json({});
  }
}

const getAllMenus: RequestHandler = async (req, res) => {
  try {
    const menus = await conn.execute('SELECT * FROM menus')
    res.status(200).json(menus.rows);
  } catch (error) {
    res.status(400).json({});
  }
}

const createMenu: RequestHandler = async (req, res) => {
  try {
    const { name, price } = req.body
    await conn.execute('INSERT INTO menus (name, price) VALUES (?, ?)', [name, price]);
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

const updateMenu: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id
    const { price } = req.body
    const result = await conn.execute('UPDATE menus SET price = ? WHERE id = ?', [price, id]);
    if (result.rowsAffected == 0) {
      res.status(400).json({ success: false, message: "cannot find the menu" })
    }
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

const deleteMenu: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id
    const result = await conn.execute('DELETE FROM menus WHERE id = ?', [id]);
    if (result.rowsAffected == 0) {
      res.status(400).json({ success: false, message: "cannot find the menu" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

export const MenuController = { getMenu, getAllMenus, createMenu, updateMenu, deleteMenu }
