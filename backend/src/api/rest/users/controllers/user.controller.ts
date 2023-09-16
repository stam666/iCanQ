import { RequestHandler } from 'express';
import User from '../models/user.model';

const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({});
  }
};

export const UserController = {
  getAllUsers,
};
